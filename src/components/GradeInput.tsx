import { Input } from '@/components/ui/input';

interface GradeInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder: string;
  label: string;
}

const GradeInput = ({ value, onChange, placeholder, label }: GradeInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange(null);
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 20) {
      onChange(num);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      <Input
        type="number"
        min={0}
        max={20}
        step={0.25}
        value={value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-20 text-center text-sm h-9 focus:ring-2 focus:ring-accent focus:border-accent"
      />
    </div>
  );
};

export default GradeInput;
