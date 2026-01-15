import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { COMMON_SYMPTOMS, SEVERITY_LEVELS, MEDICAL_DISCLAIMER } from '@/lib/medical-data';
import { ConsultationInput } from '@/hooks/useConsultation';
import { X, AlertTriangle, Search, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SymptomInputProps {
  onSubmit: (data: ConsultationInput) => void;
  loading: boolean;
}

export const SymptomInput = ({ onSubmit, loading }: SymptomInputProps) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomSearch, setSymptomSearch] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [conditionInput, setConditionInput] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  const filteredSymptoms = COMMON_SYMPTOMS.filter(
    (s) => s.toLowerCase().includes(symptomSearch.toLowerCase()) && !selectedSymptoms.includes(s)
  );

  const addSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setSymptomSearch('');
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const addCondition = () => {
    if (conditionInput.trim() && !conditions.includes(conditionInput.trim())) {
      setConditions([...conditions, conditionInput.trim()]);
      setConditionInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven || selectedSymptoms.length === 0) return;

    onSubmit({
      symptoms: selectedSymptoms,
      symptom_description: description,
      age: parseInt(age) || 30,
      duration_days: parseInt(duration) || 1,
      severity,
      allergies,
      chronic_conditions: conditions
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert className="border-amber-500/50 bg-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-sm text-muted-foreground">
          {MEDICAL_DISCLAIMER.split('\n').slice(0, 3).join(' ')}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Select Your Symptoms</CardTitle>
          <CardDescription>Choose from common symptoms or add custom ones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Symptoms */}
          {selectedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <Badge key={symptom} variant="secondary" className="gap-1 py-1.5 px-3">
                  {symptom}
                  <button type="button" onClick={() => removeSymptom(symptom)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Symptom Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symptoms..."
              value={symptomSearch}
              onChange={(e) => setSymptomSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Symptom Suggestions */}
          {symptomSearch && filteredSymptoms.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-muted/50">
              {filteredSymptoms.slice(0, 12).map((symptom) => (
                <Button
                  key={symptom}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => addSymptom(symptom)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {symptom}
                </Button>
              ))}
            </div>
          )}

          {/* Custom Symptom */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom symptom..."
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSymptom())}
            />
            <Button type="button" variant="outline" onClick={addCustomSymptom}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Describe Your Symptoms</CardTitle>
          <CardDescription>Provide additional details about how you're feeling</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe your symptoms in detail... When did they start? What makes them better or worse?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <Label htmlFor="age">Age (years)</Label>
            <Input
              id="age"
              type="number"
              min="0"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="30"
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="1"
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Label>Severity</Label>
            <Select value={severity} onValueChange={(v) => setSeverity(v as any)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEVERITY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medical History</CardTitle>
          <CardDescription>Help us provide safer recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Allergies */}
          <div>
            <Label>Known Allergies</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add allergy (e.g., Penicillin)"
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
              />
              <Button type="button" variant="outline" onClick={addAllergy}>
                Add
              </Button>
            </div>
            {allergies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {allergies.map((a) => (
                  <Badge key={a} variant="destructive" className="gap-1">
                    {a}
                    <button type="button" onClick={() => setAllergies(allergies.filter((x) => x !== a))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Chronic Conditions */}
          <div>
            <Label>Chronic Conditions</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add condition (e.g., Diabetes)"
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
              />
              <Button type="button" variant="outline" onClick={addCondition}>
                Add
              </Button>
            </div>
            {conditions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {conditions.map((c) => (
                  <Badge key={c} variant="outline" className="gap-1">
                    {c}
                    <button type="button" onClick={() => setConditions(conditions.filter((x) => x !== c))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={consentGiven}
              onCheckedChange={(c) => setConsentGiven(c as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="consent" className="font-medium">
                I understand and consent
              </Label>
              <p className="text-sm text-muted-foreground">
                I acknowledge that VAIDYA provides informational guidance only and is not a substitute 
                for professional medical advice. I will consult a healthcare provider for any medical concerns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading || !consentGiven || selectedSymptoms.length === 0}
      >
        {loading ? 'Analyzing Symptoms...' : 'Get AI Diagnosis'}
      </Button>
    </form>
  );
};
