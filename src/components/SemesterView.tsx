import { useState } from 'react';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  UnitEnseignement, 
  Grades, 
  calculateSemesterAverage, 
  calculateModuleAverage,
  getTotalCredits, 
  getTotalCoefficients,
  getAllModules 
} from '@/lib/modules';

interface SemesterViewProps {
  title: string;
  units: UnitEnseignement[];
  onBack: () => void;
}

const SemesterView = ({ title, units, onBack }: SemesterViewProps) => {
  const [grades, setGrades] = useState<Grades>({});

  const handleGradeChange = (moduleId: string, field: 'cc' | 'exam', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    if (numValue !== null && (isNaN(numValue) || numValue < 0 || numValue > 20)) return;
    
    setGrades((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [field]: numValue,
      },
    }));
  };

  const handleReset = () => {
    setGrades({});
  };

  const semesterAverage = calculateSemesterAverage(units, grades);
  const isPassing = semesterAverage !== null && semesterAverage >= 10;
  const totalCredits = getTotalCredits(units);
  const totalCoeff = getTotalCoefficients(units);
  const allModules = getAllModules(units);

  // Count filled modules
  const filledModules = allModules.filter(m => {
    const g = grades[m.id];
    if (!g) return false;
    if (m.examWeight > 0) return g.cc !== null && g.exam !== null;
    return g.cc !== null;
  }).length;

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground py-4 md:py-6 px-4 mb-6 md:mb-8">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/10 text-sm md:text-base px-2 md:px-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-primary-foreground hover:bg-primary-foreground/10 text-sm md:text-base px-2 md:px-4"
            >
              <RotateCcw className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </Button>
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{title}</h1>
          <p className="text-primary-foreground/70 mt-1 text-sm md:text-base">
            Master ISII – Ingénierie des Systèmes Informatiques Intelligents
          </p>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-2 md:px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8">
          <Card className="border-0 shadow-card">
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-primary">{allModules.length}</div>
              <div className="text-xs text-muted-foreground">Modules</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-primary">{totalCredits}</div>
              <div className="text-xs text-muted-foreground">Crédits</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-primary">{totalCoeff}</div>
              <div className="text-xs text-muted-foreground">Coefficients</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-accent">{filledModules}/{allModules.length}</div>
              <div className="text-xs text-muted-foreground">Saisis</div>
            </CardContent>
          </Card>
        </div>

        {/* General Average Card with Admis/Ajourné */}
        <Card className={`mb-6 md:mb-8 border-0 shadow-card overflow-hidden ${
          semesterAverage !== null ? (isPassing ? 'ring-2 ring-success' : 'ring-2 ring-destructive') : ''
        }`}>
          <div className={`h-1 ${semesterAverage !== null ? (isPassing ? 'bg-success' : 'bg-destructive') : 'bg-muted'}`} />
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`p-2 md:p-3 rounded-xl ${
                  semesterAverage !== null 
                    ? isPassing ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {semesterAverage !== null && isPassing ? (
                    <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />
                  ) : (
                    <XCircle className="w-6 h-6 md:w-8 md:h-8" />
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-base md:text-lg font-semibold text-foreground">Moyenne Générale</h2>
                  {semesterAverage !== null && (
                    <Badge 
                      variant={isPassing ? "default" : "destructive"} 
                      className={`mt-1 text-sm md:text-base px-3 py-1 ${isPassing ? 'bg-success hover:bg-success/90' : ''}`}
                    >
                      {isPassing ? 'ADMIS' : 'AJOURNÉ'}
                    </Badge>
                  )}
                  {semesterAverage === null && (
                    <p className="text-xs md:text-sm text-muted-foreground">Saisissez toutes les notes</p>
                  )}
                </div>
              </div>
              <div className={`text-3xl md:text-4xl font-bold ${
                semesterAverage !== null 
                  ? isPassing ? 'text-success' : 'text-destructive'
                  : 'text-muted-foreground'
              }`}>
                {semesterAverage !== null ? semesterAverage.toFixed(2) : '--'}
                {semesterAverage !== null && <span className="text-base md:text-lg font-normal">/20</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unified Table - All Modules */}
        <Card className="border-0 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-muted-foreground text-xs md:text-sm">Module</th>
                  <th className="text-center py-3 px-1 md:px-2 font-semibold text-muted-foreground text-xs md:text-sm hidden sm:table-cell">UE</th>
                  <th className="text-center py-3 px-1 md:px-2 font-semibold text-muted-foreground text-xs md:text-sm">Coef</th>
                  <th className="text-center py-3 px-1 md:px-2 font-semibold text-muted-foreground text-xs md:text-sm hidden md:table-cell">Créd</th>
                  <th className="text-center py-3 px-1 md:px-2 font-semibold text-muted-foreground text-xs md:text-sm">CC</th>
                  <th className="text-center py-3 px-1 md:px-2 font-semibold text-muted-foreground text-xs md:text-sm">Exam</th>
                  <th className="text-center py-3 px-2 md:px-4 font-semibold text-muted-foreground text-xs md:text-sm">Moy</th>
                </tr>
              </thead>
              <tbody>
                {allModules.map((module) => {
                  const moduleGrades = grades[module.id] || { cc: null, exam: null };
                  const average = calculateModuleAverage(moduleGrades, module);
                  const isModulePassing = average !== null && average >= 10;
                  const isExamOnly = module.examWeight === 0;

                  return (
                    <tr key={module.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2 md:px-4">
                        <span className="font-medium text-foreground text-xs md:text-sm line-clamp-2">{module.name}</span>
                        <span className="sm:hidden text-xs text-muted-foreground ml-1">({module.unitCode})</span>
                      </td>
                      <td className="py-3 px-1 md:px-2 text-center hidden sm:table-cell">
                        <Badge variant="outline" className="text-xs">{module.unitCode}</Badge>
                      </td>
                      <td className="py-3 px-1 md:px-2 text-center text-xs md:text-sm">{module.coefficient}</td>
                      <td className="py-3 px-1 md:px-2 text-center text-xs md:text-sm hidden md:table-cell">{module.credits}</td>
                      <td className="py-3 px-1 md:px-2">
                        <Input
                          type="number"
                          min={0}
                          max={20}
                          step={0.25}
                          value={moduleGrades.cc ?? ''}
                          onChange={(e) => handleGradeChange(module.id, 'cc', e.target.value)}
                          placeholder="--"
                          className="w-14 md:w-16 text-center text-xs md:text-sm h-8 mx-auto"
                        />
                      </td>
                      <td className="py-3 px-1 md:px-2">
                        {isExamOnly ? (
                          <span className="text-muted-foreground text-xs">N/A</span>
                        ) : (
                          <Input
                            type="number"
                            min={0}
                            max={20}
                            step={0.25}
                            value={moduleGrades.exam ?? ''}
                            onChange={(e) => handleGradeChange(module.id, 'exam', e.target.value)}
                            placeholder="--"
                            className="w-14 md:w-16 text-center text-xs md:text-sm h-8 mx-auto"
                          />
                        )}
                      </td>
                      <td className="py-3 px-2 md:px-4 text-center">
                        {average !== null ? (
                          <span className={`text-sm md:text-base font-bold ${isModulePassing ? 'text-success' : 'text-destructive'}`}>
                            {average.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">--</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default SemesterView;
