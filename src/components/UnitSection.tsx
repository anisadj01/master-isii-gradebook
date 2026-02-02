import { UnitEnseignement, Grades, calculateUnitAverage, GradeInput as GradeInputType } from '@/lib/modules';
import ModuleRow from './ModuleRow';
import { Badge } from '@/components/ui/badge';

interface UnitSectionProps {
  unit: UnitEnseignement;
  grades: Grades;
  onGradeChange: (moduleId: string, field: 'cc' | 'exam', value: number | null) => void;
}

const getUnitColor = (type: 'fundamental' | 'methodology' | 'transversal') => {
  switch (type) {
    case 'fundamental':
      return 'bg-ue-fundamental';
    case 'methodology':
      return 'bg-ue-methodology';
    case 'transversal':
      return 'bg-ue-transversal';
  }
};

const getUnitLabel = (type: 'fundamental' | 'methodology' | 'transversal') => {
  switch (type) {
    case 'fundamental':
      return 'Fondamentale';
    case 'methodology':
      return 'Méthodologie';
    case 'transversal':
      return 'Transversale';
  }
};

const UnitSection = ({ unit, grades, onGradeChange }: UnitSectionProps) => {
  const unitAverage = calculateUnitAverage(unit, grades);
  const isPassing = unitAverage !== null && unitAverage >= 10;
  const totalCredits = unit.modules.reduce((sum, mod) => sum + mod.credits, 0);

  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4 p-4 rounded-lg bg-card border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-12 rounded-full ${getUnitColor(unit.type)}`} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground">{unit.code}</h3>
              <Badge variant="outline" className="text-xs">
                {getUnitLabel(unit.type)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{unit.name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">{totalCredits} crédits</div>
          <div className={`text-lg font-bold ${
            unitAverage !== null 
              ? isPassing ? 'text-success' : 'text-destructive'
              : 'text-muted-foreground'
          }`}>
            {unitAverage !== null ? unitAverage.toFixed(2) : '--'}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Module</th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-muted-foreground">Évaluation</th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-muted-foreground">Note CC</th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-muted-foreground">Note Exam</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Moyenne</th>
            </tr>
          </thead>
          <tbody>
            {unit.modules.map((module) => (
              <ModuleRow
                key={module.id}
                module={module}
                grades={grades[module.id] || { cc: null, exam: null }}
                onGradeChange={onGradeChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnitSection;
