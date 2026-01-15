import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DiagnosisResult {
  id: string;
  disease_name: string;
  confidence_score: number;
  ranking: number;
  symptom_relevance: Record<string, number>;
  explanation: string;
  drugs: DrugRecommendation[];
}

export interface DrugRecommendation {
  id: string;
  drug_name: string;
  generic_name: string;
  drug_class: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  timing: string;
  contraindications: string[];
  side_effects: string[];
  warnings: string[];
  is_safe: boolean;
  safety_notes: string;
}

export interface ConsultationInput {
  symptoms: string[];
  symptom_description: string;
  age: number;
  duration_days: number;
  severity: 'mild' | 'moderate' | 'severe';
  allergies?: string[];
  chronic_conditions?: string[];
}

export const useConsultation = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([]);
  const [currentConsultationId, setCurrentConsultationId] = useState<string | null>(null);

  const createConsultation = async (input: ConsultationInput): Promise<string | null> => {
    if (!user) {
      toast.error('Please sign in to create a consultation');
      return null;
    }

    setLoading(true);
    try {
      // Create consultation record
      const { data: consultation, error: consultationError } = await supabase
        .from('consultations')
        .insert({
          user_id: user.id,
          symptoms: input.symptoms,
          symptom_description: input.symptom_description,
          age: input.age,
          duration_days: input.duration_days,
          severity: input.severity,
          consent_given: true,
          status: 'pending'
        })
        .select()
        .single();

      if (consultationError) throw consultationError;

      setCurrentConsultationId(consultation.id);
      return consultation.id;
    } catch (error: any) {
      toast.error('Failed to create consultation: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const runDiagnosis = async (consultationId: string, input: ConsultationInput): Promise<DiagnosisResult[]> => {
    if (!user) {
      toast.error('Please sign in to run diagnosis');
      return [];
    }

    setLoading(true);
    try {
      // Call AI diagnosis edge function
      const response = await supabase.functions.invoke('vaidya-diagnosis', {
        body: {
          consultationId,
          symptoms: input.symptoms,
          symptom_description: input.symptom_description,
          age: input.age,
          duration_days: input.duration_days,
          severity: input.severity,
          allergies: input.allergies || [],
          chronic_conditions: input.chronic_conditions || []
        }
      });

      if (response.error) throw response.error;

      const results = response.data.diagnoses as DiagnosisResult[];
      setDiagnoses(results);

      // Update consultation status
      await supabase
        .from('consultations')
        .update({ status: 'completed' })
        .eq('id', consultationId);

      return results;
    } catch (error: any) {
      console.error('Diagnosis error:', error);
      toast.error('Failed to run diagnosis: ' + error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getConsultationHistory = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          diagnoses (
            *,
            drug_recommendations (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast.error('Failed to fetch history: ' + error.message);
      return [];
    }
  };

  const submitFeedback = async (
    consultationId: string,
    diagnosisId: string,
    isCorrect: boolean,
    actualCondition?: string,
    feedbackText?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          consultation_id: consultationId,
          diagnosis_id: diagnosisId,
          is_correct: isCorrect,
          actual_condition: actualCondition,
          feedback_text: feedbackText
        });

      if (error) throw error;
      toast.success('Thank you for your feedback!');
    } catch (error: any) {
      toast.error('Failed to submit feedback: ' + error.message);
    }
  };

  return {
    loading,
    diagnoses,
    currentConsultationId,
    createConsultation,
    runDiagnosis,
    getConsultationHistory,
    submitFeedback
  };
};
