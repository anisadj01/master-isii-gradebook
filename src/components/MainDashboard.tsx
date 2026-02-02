import { GraduationCap, BookOpen, Award, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MainDashboardProps {
  onNavigateToSemester: (semester: 1 | 2) => void;
}

const MainDashboard = ({ onNavigateToSemester }: MainDashboardProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="gradient-hero text-primary-foreground py-8 md:py-12 lg:py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="mb-4 md:mb-6 animate-fade-in-scale">
            <div className="inline-flex p-3 md:p-4 rounded-2xl gradient-accent shadow-glow">
              <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-3 md:mb-4 animate-fade-in-up">
            Calcul de Moyenne
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Master ISII – Université d'Alger 1
          </p>
        </div>
      </header>

      {/* Features */}
      <section className="py-6 md:py-8 px-4 -mt-6 md:-mt-8">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-12">
            {[
              { icon: BookOpen, label: 'Saisie intuitive', desc: 'Notes CC et Exam' },
              { icon: Award, label: 'Calcul auto', desc: 'Moyennes pondérées' },
              { icon: GraduationCap, label: 'Suivi complet', desc: 'Par module et UE' },
            ].map((feature, index) => (
              <div
                key={feature.label}
                className="bg-card rounded-xl p-3 md:p-4 shadow-card text-center animate-fade-in-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="inline-flex p-1.5 md:p-2 rounded-lg bg-primary/10 text-primary mb-1 md:mb-2">
                  <feature.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="text-xs md:text-sm font-medium text-foreground">{feature.label}</div>
                <div className="text-xs text-muted-foreground hidden sm:block">{feature.desc}</div>
              </div>
            ))}
          </div>

          {/* Specialty Info */}
          <div className="animate-fade-in-up mb-6 md:mb-8" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4 text-center">
              Spécialité ISII
            </h2>
            <Card className="border-0 shadow-card">
              <CardContent className="p-4 md:p-6 text-center">
                <h3 className="font-bold text-foreground text-sm md:text-base mb-2">
                  Ingénierie des Systèmes Informatiques Intelligents
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Architecture, IA, Data Mining, Réseaux, Sécurité & plus
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Semester Selection */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4 text-center">
              Choisissez un semestre
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card 
                className="border-0 shadow-card hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => onNavigateToSemester(1)}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 md:p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-sm md:text-base">Semestre 1</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">9 modules • 30 crédits</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4 text-sm" variant="outline">
                    Accéder au S1
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="border-0 shadow-card hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => onNavigateToSemester(2)}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 md:p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-sm md:text-base">Semestre 2</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">9 modules • 30 crédits</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4 text-sm" variant="outline">
                    Accéder au S2
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 text-center text-xs md:text-sm text-muted-foreground">
        <p>© 2026 – Développé par Adjir Anis | Master ISII – Université d’Alger 1</p>
      </footer>
    </div>
  );
};

export default MainDashboard;
