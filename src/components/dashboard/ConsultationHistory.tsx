import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Calendar, Clock, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Consultation {
  id: string;
  symptoms: string[];
  severity: string;
  status: string;
  created_at: string;
  diagnoses?: {
    disease_name: string;
    confidence_score: number;
  }[];
}

interface ConsultationHistoryProps {
  consultations: Consultation[];
  onSelect: (id: string) => void;
}

export const ConsultationHistory = ({ consultations, onSelect }: ConsultationHistoryProps) => {
  if (consultations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Consultation History</CardTitle>
          <CardDescription>No previous consultations found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Your past consultations will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultation History</CardTitle>
        <CardDescription>
          {consultations.length} past consultation{consultations.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onSelect(consultation.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {consultation.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <span className="text-sm font-medium truncate">
                      {consultation.symptoms.slice(0, 3).join(', ')}
                      {consultation.symptoms.length > 3 && ` +${consultation.symptoms.length - 3} more`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(consultation.created_at), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(consultation.created_at), 'h:mm a')}
                    </span>
                  </div>

                  {consultation.diagnoses && consultation.diagnoses.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {consultation.diagnoses.slice(0, 2).map((d, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {d.disease_name} ({(d.confidence_score * 100).toFixed(0)}%)
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-2">
                  <Badge
                    variant={consultation.severity === 'severe' ? 'destructive' : 'outline'}
                    className="text-xs capitalize"
                  >
                    {consultation.severity}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
