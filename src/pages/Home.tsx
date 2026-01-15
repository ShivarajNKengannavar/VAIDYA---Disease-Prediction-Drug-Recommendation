import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  HeartPulse, 
  Brain, 
  Pill, 
  Shield, 
  MessageCircle, 
  BarChart3, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  Clock
} from 'lucide-react';

export default function Home() {
  const features = [
    { 
      icon: Brain, 
      title: 'AI Diagnosis', 
      description: 'Advanced ML-powered symptom analysis with explainable confidence scores',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Pill, 
      title: 'Drug Recommendations', 
      description: 'Personalized medication with dosage, timing, and safety checks',
      color: 'from-emerald-500 to-teal-500'
    },
    { 
      icon: MessageCircle, 
      title: 'Health Assistant', 
      description: 'Interactive VAIDYA chatbot for 24/7 health guidance',
      color: 'from-violet-500 to-purple-500'
    },
    { 
      icon: Shield, 
      title: 'Privacy First', 
      description: 'End-to-end encryption with GDPR-compliant data handling',
      color: 'from-orange-500 to-amber-500'
    },
    { 
      icon: BarChart3, 
      title: 'Health Analytics', 
      description: 'Visual insights and trend analysis of your health journey',
      color: 'from-pink-500 to-rose-500'
    },
    { 
      icon: Zap, 
      title: 'Instant Results', 
      description: 'Get AI-powered diagnoses in seconds, not hours',
      color: 'from-yellow-500 to-orange-500'
    },
  ];

  const stats = [
    { value: 15, suffix: '+', label: 'Common Conditions' },
    { value: 1000, suffix: '+', label: 'Drug Interactions Checked' },
    { value: 25, suffix: '+', label: 'Prescriptions Generated' },
    { value: 24, suffix: '/7', label: 'AI Support' },
  ];

  const benefits = [
    'Explainable AI with SHAP analysis',
    'Drug interaction warnings',
    'Personalized health insights',
    'Secure medical records',
    'Multi-symptom analysis',
    'Professional escalation alerts',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/10 min-h-[90vh] flex items-center">
        <div className="container max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-full mb-6 border border-primary/20">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium text-sm">AI-Powered Healthcare Platform</span>
            </div>
            
            <div className="text-sm text-muted-foreground mb-8 max-w-3xl mx-auto">
              Trained on certified medical datasets from <span className="font-semibold">National Health Service (NHS)</span>, 
              <span className="font-semibold">Mayo Clinic</span>, and <span className="font-semibold">World Health Organization (WHO)</span> clinical guidelines
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-primary">VAIDYA</span>
              <br />
              <span className="text-foreground">Health AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience next-generation healthcare with AI-powered disease predictions, 
              personalized drug recommendations, and expert guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 rounded-xl" asChild>
                <Link to="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Comprehensive <span className="text-primary">Health Analysis</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology meets clinical expertise for accurate, personalized healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="p-6 border rounded-lg bg-card">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Choose <span className="text-primary">VAIDYA</span>?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Built with cutting-edge AI and validated against clinical standards, 
                VAIDYA provides reliable health insights you can trust.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" className="mt-10 rounded-xl" asChild>
                <Link to="/signup">
                  Start Your Health Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-8">
                <div className="w-full h-full rounded-2xl bg-card/80 flex items-center justify-center">
                  <HeartPulse className="w-32 h-32 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your <span className="text-primary">Healthcare</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join thousands of users who trust VAIDYA for intelligent health insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-10 py-6 rounded-xl" asChild>
              <Link to="/signup">Create Free Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 py-6 rounded-xl" asChild>
              <Link to="/diagnosis">Try Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">VAIDYA</span>
            </div>
            <p className="text-muted-foreground text-sm text-center">
              © 2026 VAIDYA Health AI. For informational purposes only. Always consult a healthcare professional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
