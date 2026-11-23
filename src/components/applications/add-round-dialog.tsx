import { useEffect, useState } from "react";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { DateTimePicker } from "./date-time-picker";

export interface DraftInterviewRound {
  id?: number;
  tempId: string;
  round: string;
  status: "to_schedule" | "scheduled" | "completed" | "cancelled";
  scheduledAt: string;
  durationMinutes: number;
  interviewer: string;
  notes: string;
}

interface AddRoundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: string;
  role: string;
  initialRound?: DraftInterviewRound | null;
  onSubmit: (round: DraftInterviewRound) => void;
}

const PRESETS = ["HR Screen", "Technical", "System Design", "Final Panel"];
const DURATIONS = [30, 45, 60, 90];
const STATUSES: { value: DraftInterviewRound["status"]; label: string }[] = [
  { value: "to_schedule", label: "To schedule" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function AddRoundDialog({ open, onOpenChange, company, role, initialRound, onSubmit }: AddRoundDialogProps) {
  const isEdit = Boolean(initialRound);
  const [round, setRound] = useState("HR Screen");
  const [status, setStatus] = useState<DraftInterviewRound["status"]>("scheduled");
  const [scheduledAt, setScheduledAt] = useState(() => new Date().toISOString());
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [interviewer, setInterviewer] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initialRound) {
      setRound(initialRound.round);
      setStatus(initialRound.status);
      setScheduledAt(initialRound.scheduledAt || new Date().toISOString());
      setDurationMinutes(initialRound.durationMinutes || 45);
      setInterviewer(initialRound.interviewer || "");
      setNotes(initialRound.notes || "");
    } else {
      setRound("HR Screen");
      setStatus("scheduled");
      setScheduledAt(new Date().toISOString());
      setDurationMinutes(45);
      setInterviewer("");
      setNotes("");
    }
  }, [open, initialRound]);

  const isValid = round.trim().length > 0 && scheduledAt.length > 0 && interviewer.trim().length > 0;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) return;

    onSubmit({
      id: initialRound?.id,
      tempId: initialRound?.tempId ?? crypto.randomUUID(),
      round: round.trim(),
      status,
      scheduledAt,
      durationMinutes,
      interviewer: interviewer.trim(),
      notes: notes.trim(),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-zinc-950">{isEdit ? "Edit interview round" : "Add interview round"}</DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            {company} · {role}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="round-name" className="text-xs font-medium text-zinc-700">
              Round name <span className="text-rose-500">*</span>
            </Label>
            <Input id="round-name" required value={round} onChange={(e) => setRound(e.target.value)} placeholder="e.g. Technical Interview" className="h-9 text-xs" />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRound(preset)}
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] transition ${round === preset ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-700">
              Status <span className="text-rose-500">*</span>
            </Label>
            <div className="grid grid-cols-4 rounded-lg bg-zinc-100 p-1">
              {STATUSES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setStatus(item.value)}
                  className={`rounded-md py-1.5 text-[11px] font-medium transition ${status === item.value ? "bg-white text-zinc-950 shadow-xs" : "text-zinc-500 hover:text-zinc-800"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-7 space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">
                Date & time <span className="text-rose-500">*</span>
              </Label>
              <DateTimePicker value={scheduledAt} onChange={setScheduledAt} required />
            </div>

            <div className="col-span-5 space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700">
                Duration <span className="text-rose-500">*</span>
              </Label>
              <div className="grid grid-cols-4 rounded-lg border border-zinc-200 p-0.5">
                {DURATIONS.map((min) => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => setDurationMinutes(min)}
                    className={`rounded py-1.5 font-mono text-[11px] transition ${durationMinutes === min ? "bg-zinc-100 font-semibold text-zinc-950" : "text-zinc-500 hover:text-zinc-800"}`}
                  >
                    {min}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="interviewer" className="text-xs font-medium text-zinc-700">
              Interviewer <span className="text-rose-500">*</span>
            </Label>
            <Input id="interviewer" required value={interviewer} onChange={(e) => setInterviewer(e.target.value)} placeholder="e.g. Ana Ruiz, Engineering Panel" className="h-9 text-xs" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="round-notes" className="text-xs font-medium text-zinc-700">
              Notes <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <Textarea id="round-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Meeting link, prep topics, or focus areas..." className="resize-none text-xs" />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} className="h-8 text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!isValid} className="h-8 bg-zinc-950 px-3.5 text-xs text-white hover:bg-zinc-800">
              {isEdit ? "Apply changes" : "Add round"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
