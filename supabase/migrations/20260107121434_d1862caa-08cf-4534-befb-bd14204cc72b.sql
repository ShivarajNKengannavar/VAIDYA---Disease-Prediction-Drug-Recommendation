-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  allergies TEXT[],
  chronic_conditions TEXT[],
  blood_type TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create consultations table for health consultations
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symptoms TEXT[] NOT NULL,
  symptom_description TEXT,
  age INTEGER,
  duration_days INTEGER,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'reviewed')),
  consent_given BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create diagnoses table for AI predictions
CREATE TABLE public.diagnoses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE NOT NULL,
  disease_name TEXT NOT NULL,
  confidence_score DECIMAL(5,4) NOT NULL,
  ranking INTEGER NOT NULL,
  symptom_relevance JSONB,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create drug_recommendations table
CREATE TABLE public.drug_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  diagnosis_id UUID REFERENCES public.diagnoses(id) ON DELETE CASCADE NOT NULL,
  drug_name TEXT NOT NULL,
  generic_name TEXT,
  drug_class TEXT,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT,
  route TEXT CHECK (route IN ('oral', 'injection', 'topical', 'inhalation', 'sublingual', 'rectal', 'transdermal')),
  timing TEXT CHECK (timing IN ('before_meal', 'after_meal', 'with_meal', 'empty_stomach', 'bedtime', 'as_needed')),
  contraindications TEXT[],
  side_effects TEXT[],
  warnings TEXT[],
  is_safe BOOLEAN DEFAULT true,
  safety_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table for VAIDYA assistant
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table for research reproducibility
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  model_version TEXT,
  confidence_scores JSONB,
  input_data JSONB,
  output_data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_feedback table for continuous learning
CREATE TABLE public.user_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE NOT NULL,
  diagnosis_id UUID REFERENCES public.diagnoses(id) ON DELETE SET NULL,
  is_correct BOOLEAN,
  actual_condition TEXT,
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drug_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for consultations
CREATE POLICY "Users can view their own consultations" ON public.consultations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own consultations" ON public.consultations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own consultations" ON public.consultations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own consultations" ON public.consultations FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for diagnoses (through consultation ownership)
CREATE POLICY "Users can view diagnoses for their consultations" ON public.diagnoses FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.consultations WHERE consultations.id = diagnoses.consultation_id AND consultations.user_id = auth.uid()));
CREATE POLICY "System can create diagnoses" ON public.diagnoses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.consultations WHERE consultations.id = diagnoses.consultation_id AND consultations.user_id = auth.uid())
);

-- RLS Policies for drug_recommendations (through diagnosis ownership)
CREATE POLICY "Users can view drug recommendations for their diagnoses" ON public.drug_recommendations FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.diagnoses d
  JOIN public.consultations c ON c.id = d.consultation_id
  WHERE d.id = drug_recommendations.diagnosis_id AND c.user_id = auth.uid()
));
CREATE POLICY "System can create drug recommendations" ON public.drug_recommendations FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.diagnoses d
    JOIN public.consultations c ON c.id = d.consultation_id
    WHERE d.id = drug_recommendations.diagnosis_id AND c.user_id = auth.uid()
  )
);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view their own messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own messages" ON public.chat_messages FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for audit_logs (read-only for users)
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_feedback
CREATE POLICY "Users can view their own feedback" ON public.user_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own feedback" ON public.user_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own feedback" ON public.user_feedback FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto-creating profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();