import { useState } from 'react';
import { ArrowLeft, Calculator, RotateCcw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { semester1Units, Grades, calculateSemesterAverage, getTotalCredits, getTotalCoefficients } from '@/lib/modules';
import UnitSection from './UnitSection';

interface SemesterViewProps {
  onBack: () => void;
}

const SemesterView = ({ onBack }: SemesterViewProps) => {
  const [grades, setGrades] = useState<Grades>({});

  const handleGradeChange = (moduleId: string, field: 'cc' | 'exam', value: number | null) => {
    setGrades((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [field]: value,
      },
    }));
  };

  const handleReset = () => {
    setGrades({});
  };

  const semesterAverage = calculateSemesterAverage(semester1Units, grades);
  const isPassing = semesterAverage !== null && semesterAverage >= 10;
  const totalCredits = getTotalCredits(semester1Units);
  const totalCoeff = getTotalCoefficients(semester1Units);

  // Count filled modules
  const totalModules = semester1Units.reduce((sum, u) => sum + u.modules.length, 0);
  const filledModules = Object.values(grades).filter(g => g.cc !== null && g.exam !== null).length;

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground py-6 px-4 mb-8">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Semestre 1</h1>
          <p className="text-primary-foreground/70 mt-1">
            Master ISII – Ingénierie des Systèmes Informatiques Intelligents
          </p>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{totalModules}</div>
              <div className="text-xs text-muted-foreground">Modules</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{totalCredits}</div>
              <div className="text-xs text-muted-foreground">Crédits ECTS</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{totalCoeff}</div>
              <div className="text-xs text-muted-foreground">Coefficients</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">{filledModules}/{totalModules}</div>
              <div className="text-xs text-muted-foreground">Saisis</div>
            </CardContent>
          </Card>
        </div>

        {/* General Average Card */}
        <Card className={`mb-8 border-0 shadow-card overflow-hidden ${
          semesterAverage !== null ? (isPassing ? 'ring-2 ring-success' : 'ring-2 ring-destructive') : ''
        }`}>
          <div className={`h-1 ${semesterAverage !== null ? (isPassing ? 'bg-success' : 'bg-destructive') : 'bg-muted'}`} />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  semesterAverage !== null 
                    ? isPassing ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {semesterAverage !== null && isPassing ? (
                    <TrendingUp className="w-8 h-8" />
                  ) : (
                    <Calculator className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Moyenne Générale</h2>
                  <p className="text-sm text-muted-foreground">
                    {semesterAverage !== null 
                      ? isPassing ? 'Semestre validé !' : 'Semestre non validé'
                      : 'Saisissez toutes les notes'}
                  </p>
                </div>
              </div>
              <div className={`text-4xl font-bold ${
                semesterAverage !== null 
                  ? isPassing ? 'text-success' : 'text-destructive'
                  : 'text-muted-foreground'
              }`}>
                {semesterAverage !== null ? semesterAverage.toFixed(2) : '--'}
                {semesterAverage !== null && <span className="text-lg font-normal">/20</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unit Sections */}
        {semester1Units.map((unit, index) => (
          <div key={unit.id} style={{ animationDelay: `${index * 0.1}s` }}>
            <UnitSection
              unit={unit}
              grades={grades}
              onGradeChange={handleGradeChange}
            />
          </div>
        ))}
      </main>
    </div>
  );
};

export default SemesterView;
