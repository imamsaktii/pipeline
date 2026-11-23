import { useState } from "react";
import { Calendar as CalendarIcon, Clock, X } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Calendar } from "#/components/ui/calendar";
import { Input } from "#/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";

interface DateTimePickerProps {
  value: string;
  onChange: (isoString: string) => void;
}

function formatDisplay(date: Date) {
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${datePart} · ${timePart}`;
}

function getTimeString(date: Date | undefined) {
  const target = date ?? new Date();
  const h = String(target.getHours()).padStart(2, "0");
  const m = String(target.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = value ? new Date(value) : undefined;
  const timeStr = getTimeString(selectedDate);

  function handleDateSelect(day: Date | undefined) {
    if (!day) {
      if (!required) onChange("");
      return;
    }
    const [hours, minutes] = timeStr.split(":").map(Number);
    const next = new Date(day);
    next.setHours(hours, minutes, 0, 0);
    onChange(next.toISOString());
  }

  function handleTimeChange(newTime: string) {
    if (!newTime) return;
    const [hours, minutes] = newTime.split(":").map(Number);
    const base = selectedDate ? new Date(selectedDate) : new Date();
    base.setHours(hours, minutes, 0, 0);
    onChange(base.toISOString());
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className={`h-9 w-full justify-start px-2.5 font-mono text-[11px] font-normal tabular-nums ${selectedDate ? "text-zinc-900" : "text-zinc-400"}`}>
          <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <span className="truncate">{selectedDate ? formatDisplay(selectedDate) : "Pick date & time"}</span>
          {selectedDate && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange("");
                }
              }}
              className="ml-auto rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
            >
              <X className="h-3 w-3" />
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
        <div className="flex items-center justify-between gap-2 border-t border-zinc-200 px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            <span>Time</span>
          </div>
          <Input type="time" value={timeStr} onChange={(e) => handleTimeChange(e.target.value)} className="h-7 w-24 px-2 font-mono text-xs tabular-nums" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
