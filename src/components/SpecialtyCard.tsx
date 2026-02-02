import { BookOpen, ChevronRight, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SpecialtyCardProps {
  onNavigate: () => void;
}

const SpecialtyCard = ({ onNavigate }: SpecialtyCardProps) => {
  return (
    <Card className="max-w-2xl mx-auto shadow-card hover:shadow-card-hover transition-all duration-300 border-0 overflow-hidden group">
      <div className="h-2 gradient-primary" />
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Brain className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl md:text-2xl text-foreground mb-2">
              ISII – Ingénierie des Systèmes Informatiques Intelligents
            </CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Master 1 • Université d'Alger 1
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <BookOpen className="w-4 h-4" />
          <span>9 modules • 5 unités d'enseignement • 30 crédits</span>
        </div>
        <Button 
          onClick={onNavigate}
          size="lg"
          className="w-full gradient-primary hover:opacity-90 text-primary-foreground font-medium group-hover:shadow-glow transition-all duration-300"
        >
          Accéder au Semestre 1
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SpecialtyCard;
