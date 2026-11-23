import { Select, SelectContent, SelectItem, SelectTrigger } from "#/components/ui/select";
import { STATUS_STYLE } from "./constants";

export type ApplicationStatus = keyof typeof STATUS_STYLE;

interface StatusSelectProps {
  value: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
  disabled?: boolean;
}

const STATUS_OPTIONS: ApplicationStatus[] = ["applied", "interview", "offer", "rejected"];

export function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
  const current = STATUS_STYLE[value];

  return (
    <Select value={value} disabled={disabled} onValueChange={(val) => onChange(val as ApplicationStatus)}>
      <SelectTrigger className={`h-6 w-auto cursor-pointer gap-1.5 rounded-full border-0 px-2.5 py-0 text-[11px] font-medium shadow-none focus:ring-1 focus:ring-zinc-300 ${current.bg}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
        <span>{current.label}</span>
      </SelectTrigger>

      <SelectContent align="start" position="popper" className="z-[100] min-w-32">
        {STATUS_OPTIONS.map((key) => {
          const item = STATUS_STYLE[key];
          return (
            <SelectItem key={key} value={key} className="cursor-pointer text-xs">
              <span className="inline-flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                {item.label}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
