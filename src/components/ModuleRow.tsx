import { Module, GradeInput as GradeInputType, calculateModuleAverage } from '@/lib/modules';
import GradeInput from './GradeInput';
import { Badge } from '@/components/ui/badge';

interface ModuleRowProps {
  module: Module;
  grades: GradeInputType;
  onGradeChange: (moduleId: string, field: 'cc' | 'exam', value: number | null) => void;
}

const ModuleRow = ({ module, grades, onGradeChange }: ModuleRowProps) => {
  const average = calculateModuleAverage(grades, module);
  const isPassing = average !== null && average >= 10;

  return (
    <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
      <td className="py-4 px-4">
        <div className="flex flex-col">
          <span className="font-medium text-foreground text-sm">{module.name}</span>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="text-xs px-2 py-0">
              Coeff: {module.coefficient}
            </Badge>
            <Badge variant="secondary" className="text-xs px-2 py-0">
              {module.credits} crédits
            </Badge>
          </div>
        </div>
      </td>
      <td className="py-4 px-2 text-center">
        <span className="text-xs text-muted-foreground">
          {module.ccWeight * 100}% CC / {module.examWeight * 100}% Exam
        </span>
      </td>
      <td className="py-4 px-2">
        <div className="flex justify-center">
          <GradeInput
            value={grades.cc}
            onChange={(val) => onGradeChange(module.id, 'cc', val)}
            placeholder="CC"
            label="CC"
          />
        </div>
      </td>
      <td className="py-4 px-2">
        <div className="flex justify-center">
          <GradeInput
            value={grades.exam}
            onChange={(val) => onGradeChange(module.id, 'exam', val)}
            placeholder="Exam"
            label="Examen"
          />
        </div>
      </td>
      <td className="py-4 px-4 text-center">
        {average !== null ? (
          <span className={`text-lg font-bold ${isPassing ? 'text-success' : 'text-destructive'}`}>
            {average.toFixed(2)}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">--</span>
        )}
      </td>
    </tr>
  );
};

export default ModuleRow;
