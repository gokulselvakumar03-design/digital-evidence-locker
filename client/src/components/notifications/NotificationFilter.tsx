interface NotificationFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export const NotificationFilter = ({ value, onChange, options }: NotificationFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${value === option ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
