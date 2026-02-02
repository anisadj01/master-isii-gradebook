import { GraduationCap, BookOpen, Award } from 'lucide-react';
import SpecialtyCard from './SpecialtyCard';

interface MainDashboardProps {
  onNavigateToSemester: () => void;
}

const MainDashboard = ({ onNavigateToSemester }: MainDashboardProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="gradient-hero text-primary-foreground py-12 md:py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="mb-6 animate-fade-in-scale">
            <div className="inline-flex p-4 rounded-2xl gradient-accent shadow-glow">
              <GraduationCap className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up">
            Calcul de Moyenne
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Master ISII – Université d'Alger 1
          </p>
        </div>
      </header>

      {/* Features */}
      <section className="py-8 px-4 -mt-8">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { icon: BookOpen, label: 'Saisie intuitive', desc: 'Notes CC et Exam' },
              { icon: Award, label: 'Calcul auto', desc: 'Moyennes pondérées' },
              { icon: GraduationCap, label: 'Suivi complet', desc: 'Par module et UE' },
            ].map((feature, index) => (
              <div
                key={feature.label}
                className="bg-card rounded-xl p-4 shadow-card text-center animate-fade-in-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="inline-flex p-2 rounded-lg bg-primary/10 text-primary mb-2">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium text-foreground">{feature.label}</div>
                <div className="text-xs text-muted-foreground">{feature.desc}</div>
              </div>
            ))}
          </div>

          {/* Specialty Card */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
              Votre spécialité
            </h2>
            <SpecialtyCard onNavigate={onNavigateToSemester} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>© 2024 – Application de calcul de moyenne Master ISII</p>
      </footer>
    </div>
  );
};

export default MainDashboard;
