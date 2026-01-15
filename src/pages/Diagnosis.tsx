import { useState } from 'react';
import { SymptomInput } from '@/components/diagnosis/SymptomInput';
import { DiagnosisResults } from '@/components/diagnosis/DiagnosisResults';
import { useConsultation, ConsultationInput } from '@/hooks/useConsultation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HeartPulse, FileText, Sparkles } from 'lucide-react';

export default function Diagnosis() {
  const { loading, diagnoses, createConsultation, runDiagnosis, submitFeedback, currentConsultationId } = useConsultation();
  const [activeTab, setActiveTab] = useState('input');

  const handleSubmit = async (data: ConsultationInput) => {
    const consultationId = await createConsultation(data);
    if (consultationId) {
      const results = await runDiagnosis(consultationId, data);
      if (results.length > 0) {
        setActiveTab('results');
      }
    }
  };

  const handleFeedback = (diagnosisId: string, isCorrect: boolean) => {
    if (currentConsultationId) {
      submitFeedback(currentConsultationId, diagnosisId, isCorrect);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="container py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Analysis</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-primary">AI Health Diagnosis</h1>
          <p className="text-muted-foreground text-lg">Describe your symptoms to receive AI-powered analysis with drug recommendations</p>
        </div>

        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
              <TabsTrigger value="input" className="text-base"><HeartPulse className="h-4 w-4 mr-2" />Symptom Input</TabsTrigger>
              <TabsTrigger value="results" disabled={diagnoses.length === 0} className="text-base">
                <FileText className="h-4 w-4 mr-2" />Results ({diagnoses.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="input">
              <SymptomInput onSubmit={handleSubmit} loading={loading} />
            </TabsContent>
            <TabsContent value="results">
              <DiagnosisResults diagnoses={diagnoses} onFeedback={handleFeedback} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
