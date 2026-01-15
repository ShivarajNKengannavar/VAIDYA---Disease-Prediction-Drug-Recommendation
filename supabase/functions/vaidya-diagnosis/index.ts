import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const SYSTEM_PROMPT = `You are VAIDYA, an expert AI medical diagnostic assistant. Your role is to analyze symptoms and provide evidence-based disease predictions with drug recommendations.

CRITICAL RULES:
1. Always provide 3-5 possible conditions ranked by confidence score (0.0 to 1.0)
2. Each diagnosis MUST include:
   - Disease name
   - Confidence score (be conservative - only high confidence for clear symptom patterns)
   - Explanation of why this diagnosis fits the symptoms
   - Which symptoms were most relevant (symptom_relevance as percentages)
   
3. For each diagnosis, provide drug recommendations with:
   - Drug name (brand name)
   - Generic name
   - Drug class
   - Dosage (specific amounts)
   - Frequency (e.g., "twice daily", "every 8 hours")
   - Duration (e.g., "7 days", "until symptoms resolve")
   - Route: one of [oral, injection, topical, inhalation, sublingual, rectal, transdermal]
   - Timing: one of [before_meal, after_meal, with_meal, empty_stomach, bedtime, as_needed]
   - Contraindications (list conditions where this drug should NOT be used)
   - Side effects (common ones)
   - Warnings (important safety information)
   - is_safe: boolean based on patient's allergies and conditions
   - safety_notes: explanation if not safe

4. SAFETY CHECKS:
   - Cross-reference drug recommendations with patient's allergies
   - Check for contraindications with chronic conditions
   - If confidence < 0.5 for all conditions, recommend professional consultation
   - Never recommend controlled substances without explicit warnings

5. BE CONSERVATIVE:
   - If symptoms are vague, acknowledge uncertainty
   - Suggest follow-up questions or tests when needed
   - Always include disclaimer about seeking professional help

You must respond in valid JSON format only.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      consultationId, 
      symptoms, 
      symptom_description, 
      age, 
      duration_days, 
      severity,
      allergies = [],
      chronic_conditions = []
    } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Prepare the diagnosis request
    const userPrompt = `
Analyze the following patient case and provide diagnosis with drug recommendations:

PATIENT INFORMATION:
- Age: ${age} years
- Symptoms: ${symptoms.join(', ')}
- Symptom Description: ${symptom_description}
- Duration: ${duration_days} days
- Severity: ${severity}
- Known Allergies: ${allergies.length > 0 ? allergies.join(', ') : 'None reported'}
- Chronic Conditions: ${chronic_conditions.length > 0 ? chronic_conditions.join(', ') : 'None reported'}

Provide your diagnosis in the following JSON format:
{
  "diagnoses": [
    {
      "disease_name": "string",
      "confidence_score": 0.0-1.0,
      "ranking": 1-5,
      "symptom_relevance": {"symptom1": 0.0-1.0, "symptom2": 0.0-1.0},
      "explanation": "string explaining why this diagnosis fits",
      "drugs": [
        {
          "drug_name": "Brand Name",
          "generic_name": "Generic Name",
          "drug_class": "Drug Class",
          "dosage": "500mg",
          "frequency": "twice daily",
          "duration": "7 days",
          "route": "oral",
          "timing": "after_meal",
          "contraindications": ["list", "of", "conditions"],
          "side_effects": ["common", "side", "effects"],
          "warnings": ["important", "warnings"],
          "is_safe": true,
          "safety_notes": "Notes if not safe for this patient"
        }
      ]
    }
  ],
  "clinical_notes": "Additional clinical observations",
  "recommended_tests": ["list of suggested diagnostic tests"],
  "urgency_level": "routine|urgent|emergency",
  "follow_up_questions": ["questions to clarify diagnosis"]
}`;

    console.log('Sending diagnosis request to Lovable AI...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits depleted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }

    console.log('AI Response received, parsing...');

    let diagnosisData;
    try {
      diagnosisData = JSON.parse(content);
    } catch {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid AI response format');
    }

    // Store diagnoses and drug recommendations in database
    const storedDiagnoses = [];

    for (const diagnosis of diagnosisData.diagnoses) {
      // Insert diagnosis
      const { data: diagnosisRecord, error: diagError } = await supabase
        .from('diagnoses')
        .insert({
          consultation_id: consultationId,
          disease_name: diagnosis.disease_name,
          confidence_score: diagnosis.confidence_score,
          ranking: diagnosis.ranking,
          symptom_relevance: diagnosis.symptom_relevance,
          explanation: diagnosis.explanation
        })
        .select()
        .single();

      if (diagError) {
        console.error('Error storing diagnosis:', diagError);
        continue;
      }

      // Insert drug recommendations
      const storedDrugs = [];
      for (const drug of diagnosis.drugs || []) {
        const { data: drugRecord, error: drugError } = await supabase
          .from('drug_recommendations')
          .insert({
            diagnosis_id: diagnosisRecord.id,
            drug_name: drug.drug_name,
            generic_name: drug.generic_name,
            drug_class: drug.drug_class,
            dosage: drug.dosage,
            frequency: drug.frequency,
            duration: drug.duration,
            route: drug.route,
            timing: drug.timing,
            contraindications: drug.contraindications || [],
            side_effects: drug.side_effects || [],
            warnings: drug.warnings || [],
            is_safe: drug.is_safe ?? true,
            safety_notes: drug.safety_notes
          })
          .select()
          .single();

        if (!drugError && drugRecord) {
          storedDrugs.push(drugRecord);
        }
      }

      storedDiagnoses.push({
        ...diagnosisRecord,
        drugs: storedDrugs
      });
    }

    // Create audit log
    await supabase.from('audit_logs').insert({
      consultation_id: consultationId,
      action: 'diagnosis_generated',
      model_version: 'google/gemini-2.5-flash',
      confidence_scores: diagnosisData.diagnoses.map((d: any) => ({
        disease: d.disease_name,
        score: d.confidence_score
      })),
      input_data: { symptoms, symptom_description, age, duration_days, severity },
      output_data: { diagnoses_count: storedDiagnoses.length }
    });

    console.log('Diagnosis complete, returning results...');

    return new Response(JSON.stringify({
      diagnoses: storedDiagnoses,
      clinical_notes: diagnosisData.clinical_notes,
      recommended_tests: diagnosisData.recommended_tests,
      urgency_level: diagnosisData.urgency_level,
      follow_up_questions: diagnosisData.follow_up_questions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Diagnosis function error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
