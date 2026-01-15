import { useEffect, useState } from 'react';
import { useConsultation } from '@/hooks/useConsultation';
import { ConfidenceChart } from '@/components/dashboard/ConfidenceChart';
import { ConsultationHistory } from '@/components/dashboard/ConsultationHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, FileText, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { getConsultationHistory } = useConsultation();
  const [consultations, setConsultations] = useState<any[]>([]);

  useEffect(() => {
    getConsultationHistory().then(setConsultations);
  }, []);

  const latestDiagnoses = consultations[0]?.diagnoses || [];
  const chartData = latestDiagnoses.map((d: any) => ({
    name: d.disease_name,
    confidence: d.confidence_score,
    color: '#3B82F6'
  }));

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Health Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestDiagnoses.length > 0 
                ? `${(latestDiagnoses.reduce((a: number, d: any) => a + d.confidence_score, 0) / latestDiagnoses.length * 100).toFixed(0)}%`
                : 'N/A'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Active</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {chartData.length > 0 && <ConfidenceChart data={chartData} />}
        <ConsultationHistory consultations={consultations} onSelect={(id) => console.log('Selected:', id)} />
      </div>
    </div>
  );
}
