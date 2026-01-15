import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SymptomData {
  symptom: string;
  relevance: number;
}

interface SymptomCorrelationProps {
  data: SymptomData[];
  diseaseName: string;
}

export const SymptomCorrelation = ({ data, diseaseName }: SymptomCorrelationProps) => {
  const chartData = data.map(d => ({
    subject: d.symptom,
    A: d.relevance * 100,
    fullMark: 100
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Correlation</CardTitle>
        <CardDescription>
          Symptom relevance for {diseaseName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fontSize: 11 }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Relevance"
                dataKey="A"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.5}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
