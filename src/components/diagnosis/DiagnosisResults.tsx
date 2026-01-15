import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DiagnosisResult, DrugRecommendation } from '@/hooks/useConsultation';
import { getConfidenceLevel, DRUG_ROUTES, DRUG_TIMING } from '@/lib/medical-data';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Pill, 
  Clock, 
  CalendarDays,
  Info,
  TrendingUp,
  Brain,
  ThumbsUp,
  ThumbsDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagnosisResultsProps {
  diagnoses: DiagnosisResult[];
  onFeedback?: (diagnosisId: string, isCorrect: boolean) => void;
}

export const DiagnosisResults = ({ diagnoses, onFeedback }: DiagnosisResultsProps) => {
  const [expandedDiagnosis, setExpandedDiagnosis] = useState<string | null>(diagnoses[0]?.id);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});

  const handleFeedback = (diagnosisId: string, isCorrect: boolean) => {
    onFeedback?.(diagnosisId, isCorrect);
    setFeedbackGiven({ ...feedbackGiven, [diagnosisId]: true });
  };

  if (diagnoses.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>No results yet</AlertTitle>
        <AlertDescription>Submit your symptoms to receive AI-powered diagnosis.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Urgency Alert */}
      {diagnoses.some(d => d.confidence_score >= 0.8) && (
        <Alert className="border-green-500/50 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle>High Confidence Match</AlertTitle>
          <AlertDescription>
            Strong symptom correlation found. Review recommendations and consult a healthcare provider.
          </AlertDescription>
        </Alert>
      )}

      {diagnoses.every(d => d.confidence_score < 0.5) && (
        <Alert className="border-amber-500/50 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle>Low Confidence Results</AlertTitle>
          <AlertDescription>
            Symptom patterns are unclear. We strongly recommend consulting a healthcare professional for proper evaluation.
          </AlertDescription>
        </Alert>
      )}

      {/* Diagnosis Cards */}
      <div className="space-y-4">
        {diagnoses.map((diagnosis, index) => {
          const confidence = getConfidenceLevel(diagnosis.confidence_score);
          const isExpanded = expandedDiagnosis === diagnosis.id;

          return (
            <Card 
              key={diagnosis.id} 
              className={cn(
                "transition-all duration-300",
                isExpanded && "ring-2 ring-primary/50"
              )}
            >
              <CardHeader 
                className="cursor-pointer"
                onClick={() => setExpandedDiagnosis(isExpanded ? null : diagnosis.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold",
                      index === 0 ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{diagnosis.disease_name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <TrendingUp className="h-4 w-4" />
                        <span className={confidence.color}>
                          {confidence.level} Confidence ({(diagnosis.confidence_score * 100).toFixed(1)}%)
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronRight className={cn(
                    "h-5 w-5 transition-transform",
                    isExpanded && "rotate-90"
                  )} />
                </div>
                
                <Progress 
                  value={diagnosis.confidence_score * 100} 
                  className="h-2 mt-4"
                />
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-6">
                  <Tabs defaultValue="explanation">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="explanation">
                        <Brain className="h-4 w-4 mr-2" />
                        Explanation
                      </TabsTrigger>
                      <TabsTrigger value="symptoms">
                        <Info className="h-4 w-4 mr-2" />
                        Symptoms
                      </TabsTrigger>
                      <TabsTrigger value="drugs">
                        <Pill className="h-4 w-4 mr-2" />
                        Treatment
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="explanation" className="mt-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="text-muted-foreground">{diagnosis.explanation}</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="symptoms" className="mt-4">
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Symptom Relevance Analysis:</p>
                        {Object.entries(diagnosis.symptom_relevance || {}).map(([symptom, score]) => (
                          <div key={symptom} className="flex items-center gap-3">
                            <span className="text-sm min-w-[120px]">{symptom}</span>
                            <Progress value={(score as number) * 100} className="flex-1 h-2" />
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {((score as number) * 100).toFixed(0)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="drugs" className="mt-4">
                      <DrugRecommendations drugs={diagnosis.drugs || []} />
                    </TabsContent>
                  </Tabs>

                  {/* Feedback Section */}
                  {onFeedback && !feedbackGiven[diagnosis.id] && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        Was this diagnosis helpful?
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFeedback(diagnosis.id, true)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Helpful
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFeedback(diagnosis.id, false)}
                        >
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Not Helpful
                        </Button>
                      </div>
                    </div>
                  )}

                  {feedbackGiven[diagnosis.id] && (
                    <div className="border-t pt-4">
                      <Badge variant="secondary">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Feedback submitted
                      </Badge>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const DrugRecommendations = ({ drugs }: { drugs: DrugRecommendation[] }) => {
  if (drugs.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>No specific drug recommendations for this condition.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {drugs.map((drug, index) => (
        <AccordionItem key={drug.id || index} value={drug.id || `drug-${index}`}>
          <AccordionTrigger>
            <div className="flex items-center gap-3">
              {drug.is_safe ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div className="text-left">
                <div className="font-medium">{drug.drug_name}</div>
                <div className="text-sm text-muted-foreground">{drug.generic_name}</div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {!drug.is_safe && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Safety Warning</AlertTitle>
                  <AlertDescription>{drug.safety_notes}</AlertDescription>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {/* Prescription Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">💊 Prescription</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dosage:</span>
                      <span className="font-medium">{drug.dosage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frequency:</span>
                      <span className="font-medium">{drug.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{drug.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Route:</span>
                      <span className="font-medium">
                        {DRUG_ROUTES[drug.route as keyof typeof DRUG_ROUTES]?.label || drug.route}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">When to take:</span>
                      <span className="font-medium">
                        {DRUG_TIMING[drug.timing as keyof typeof DRUG_TIMING]?.label || drug.timing}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">📋 Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="flex items-start gap-2">
                      <Pill className="h-4 w-4 mt-0.5 text-primary" />
                      <span>{DRUG_ROUTES[drug.route as keyof typeof DRUG_ROUTES]?.instruction || 'Follow prescribed method'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 text-primary" />
                      <span>{DRUG_TIMING[drug.timing as keyof typeof DRUG_TIMING]?.instruction || 'As directed'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CalendarDays className="h-4 w-4 mt-0.5 text-primary" />
                      <span>Complete the full {drug.duration} course</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side Effects & Warnings */}
              <div className="grid md:grid-cols-2 gap-4">
                {drug.side_effects?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Common Side Effects:</p>
                    <div className="flex flex-wrap gap-1">
                      {drug.side_effects.map((effect, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {drug.contraindications?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Contraindications:</p>
                    <div className="flex flex-wrap gap-1">
                      {drug.contraindications.map((contra, i) => (
                        <Badge key={i} variant="destructive" className="text-xs">
                          {contra}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {drug.warnings?.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warnings</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {drug.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <p className="text-xs text-muted-foreground italic">
                ⚠️ This is an AI recommendation. Always consult with a healthcare professional before taking any medication.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
