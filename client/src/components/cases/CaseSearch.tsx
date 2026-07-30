import { Search } from 'lucide-react';
import { Input } from '../ui/Input';

interface CaseSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const CaseSearch = ({ value, onChange }: CaseSearchProps) => {
  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <Input
          label="Search"
          placeholder="Search by case title, case ID, or client"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
};
