import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
  const step = steps[i];
  const isLast = i === steps.length - 1;
  const Icon = step.icon;

  const finish = () => {
    try { localStorage.setItem('onboarding:v1', 'done'); } catch {}
    onClose();
    setI(0);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) finish(); }}>
      <DialogContent className="max-w-sm">
        <div className="flex flex-col items-center text-center pt-2">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-4">
            <Icon className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">{step.title}</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{step.desc}</p>

          <div className="flex gap-1.5 mt-5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === i ? 'w-6 bg-primary' : 'w-1.5 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-4">
          <Button variant="ghost" size="sm" onClick={finish}>
            Passer
          </Button>
          <div className="flex gap-2">
            {i > 0 && (
              <Button variant="outline" size="sm" onClick={() => setI(i - 1)}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
              </Button>
            )}
            {isLast ? (
              <Button size="sm" onClick={finish}>
                <Check className="w-4 h-4 mr-1" /> Commencer
              </Button>
            ) : (
              <Button size="sm" onClick={() => setI(i + 1)}>
                Suivant <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTour;
