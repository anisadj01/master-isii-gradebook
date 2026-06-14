import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScanLine, Smartphone, Calculator, ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface OnboardingTourProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: Calculator,
    title: 'Bienvenue 👋',
    desc: "Calculez votre moyenne du Master ISII en quelques secondes. Choisissez un semestre, saisissez vos notes (TD, TP, Examen) — la moyenne se met à jour en temps réel.",
  },
  {
    icon: ScanLine,
    title: 'Scanner vos notes 📷',
    desc: "Dans un semestre, cliquez sur Scanner en haut. Importez vos captures d'écran (FR ou AR) : la page التقييم المستمر (CC) et la page علامات الامتحانات (Examen). L'IA remplit automatiquement les champs.",
  },
  {
    icon: Smartphone,
    title: "Installer comme application 📱",
    desc: "Ouvrez le site dans le navigateur, puis :\n• iPhone (Safari) : Partager ⬆️ → « Sur l'écran d'accueil »\n• Android (Chrome) : Menu ⋮ → « Ajouter à l'écran d'accueil »\nL'app s'ouvrira en plein écran comme une vraie application.",
  },
];

const OnboardingTour = ({ open, onClose }: OnboardingTourProps) => {
  const [i, setI] = useState(0);
  if (!open) return null;
  const step = steps[i];
  const isLast = i === steps.length - 1;
  const Icon = step.icon;

  const finish = () => {
    try { localStorage.setItem('onboarding:v1', 'done'); } catch {}
    setI(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] gradient-hero flex flex-col animate-fade-in-up">
      {/* Top bar with Skip */}
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="sm" onClick={finish} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
          Passer
        </Button>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div key={i} className="animate-fade-in-scale flex flex-col items-center max-w-md">
          <div className="p-5 rounded-3xl gradient-accent shadow-glow mb-8">
            <Icon className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            {step.title}
          </h2>
          <p className="text-base md:text-lg text-primary-foreground/85 whitespace-pre-line leading-relaxed">
            {step.desc}
          </p>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mb-6">
        {steps.map((_, idx) => (
          <span
            key={idx}
            className={`h-2 rounded-full transition-all ${
              idx === i ? 'w-8 bg-primary-foreground' : 'w-2 bg-primary-foreground/30'
            }`}
          />
        ))}
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-between gap-3 p-6 pb-10">
        <Button
          variant="ghost"
          onClick={() => setI(i - 1)}
          disabled={i === 0}
          className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground disabled:opacity-0"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Précédent
        </Button>
        {isLast ? (
          <Button size="lg" onClick={finish} className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Check className="w-5 h-5 mr-1" /> Commencer
          </Button>
        ) : (
          <Button size="lg" onClick={() => setI(i + 1)} className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            Suivant <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingTour;
