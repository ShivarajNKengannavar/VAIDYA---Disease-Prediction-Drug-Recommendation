import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const SYSTEM_PROMPT = `You are VAIDYA, an AI-powered health assistant designed to help users understand their health concerns. You are knowledgeable, empathetic, and always prioritize patient safety.

CORE BEHAVIORS:
1. Ask clarifying questions about symptoms (onset, duration, severity, associated factors)
2. Provide educational information about health conditions
3. Explain diagnoses and drug recommendations in simple, understandable language
4. Always recommend professional medical consultation for serious concerns
5. Never provide definitive diagnoses - use phrases like "this could indicate", "consider discussing with your doctor"

SAFETY PROTOCOLS:
- If user describes emergency symptoms (chest pain, difficulty breathing, severe bleeding, stroke symptoms), immediately advise calling emergency services
- Never recommend stopping prescribed medications without doctor consultation
- Always include appropriate medical disclaimers
- Acknowledge uncertainty when symptoms are ambiguous
- Escalate to professional care rather than guessing

COMMUNICATION STYLE:
- Be warm and supportive
- Use clear, jargon-free language
- Break down complex medical concepts
- Provide actionable next steps
- Validate patient concerns while maintaining appropriate boundaries

Remember: You are an informational assistant, not a replacement for professional medical care.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId, consultationId } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Chat request received from user:', userId);

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
          ...messages
        ],
        stream: true
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    console.log('Streaming response from AI...');

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Chat function error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
