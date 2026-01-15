// Medical knowledge base for VAIDYA
// This provides structured medical data for the AI to use

export const COMMON_SYMPTOMS = [
  "Headache", "Fever", "Cough", "Fatigue", "Nausea", "Vomiting",
  "Diarrhea", "Abdominal pain", "Chest pain", "Shortness of breath",
  "Dizziness", "Back pain", "Joint pain", "Muscle aches", "Sore throat",
  "Runny nose", "Congestion", "Sneezing", "Skin rash", "Itching",
  "Swelling", "Loss of appetite", "Weight loss", "Weight gain",
  "Insomnia", "Excessive thirst", "Frequent urination", "Blurred vision",
  "Numbness", "Tingling", "Anxiety", "Depression", "Memory problems"
];

export const SEVERITY_LEVELS = [
  { value: "mild", label: "Mild", description: "Noticeable but not significantly affecting daily activities" },
  { value: "moderate", label: "Moderate", description: "Affecting daily activities but manageable" },
  { value: "severe", label: "Severe", description: "Significantly impacting daily activities, may need urgent care" }
];

export const DRUG_ROUTES = {
  oral: { label: "Oral (Tablet/Capsule)", icon: "💊", instruction: "Take by mouth with water" },
  injection: { label: "Injection", icon: "💉", instruction: "Administered via injection" },
  topical: { label: "Topical (Cream/Ointment)", icon: "🧴", instruction: "Apply to affected area" },
  inhalation: { label: "Inhalation", icon: "🌬️", instruction: "Inhale as directed" },
  sublingual: { label: "Sublingual", icon: "👅", instruction: "Place under tongue until dissolved" },
  rectal: { label: "Rectal", icon: "💊", instruction: "Insert rectally as directed" },
  transdermal: { label: "Transdermal (Patch)", icon: "🩹", instruction: "Apply patch to clean, dry skin" }
};

export const DRUG_TIMING = {
  before_meal: { label: "Before Meal", instruction: "Take 30 minutes before eating" },
  after_meal: { label: "After Meal", instruction: "Take 30 minutes after eating" },
  with_meal: { label: "With Meal", instruction: "Take during a meal" },
  empty_stomach: { label: "Empty Stomach", instruction: "Take at least 2 hours after last meal" },
  bedtime: { label: "At Bedtime", instruction: "Take before going to sleep" },
  as_needed: { label: "As Needed", instruction: "Take only when symptoms occur" }
};

export const CONFIDENCE_THRESHOLDS = {
  high: 0.75,
  moderate: 0.50,
  low: 0.25
};

export const getConfidenceLevel = (score: number): { level: string; color: string; message: string } => {
  if (score >= CONFIDENCE_THRESHOLDS.high) {
    return { 
      level: "High", 
      color: "text-green-600", 
      message: "Strong correlation with reported symptoms" 
    };
  } else if (score >= CONFIDENCE_THRESHOLDS.moderate) {
    return { 
      level: "Moderate", 
      color: "text-yellow-600", 
      message: "Possible match - consider additional evaluation" 
    };
  } else {
    return { 
      level: "Low", 
      color: "text-red-600", 
      message: "Weak correlation - professional consultation recommended" 
    };
  }
};

export const MEDICAL_DISCLAIMER = `
⚠️ IMPORTANT MEDICAL DISCLAIMER

This AI-powered health assistant provides informational guidance only and is NOT a substitute for professional medical advice, diagnosis, or treatment.

• Always consult a qualified healthcare provider for medical concerns
• Never disregard professional medical advice based on this tool
• In case of emergency, call emergency services immediately
• Drug recommendations are advisory only - require physician approval before use
• This system is designed for educational and research purposes

By using VAIDYA, you acknowledge that you understand and accept these limitations.
`;

export const CONTRAINDICATION_CATEGORIES = [
  "Pregnancy", "Breastfeeding", "Children under 12", "Elderly (65+)",
  "Kidney disease", "Liver disease", "Heart disease", "Diabetes",
  "High blood pressure", "Asthma", "Allergies", "Blood disorders"
];
