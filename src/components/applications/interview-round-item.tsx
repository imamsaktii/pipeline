import { useState } from "react";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "#/components/ui/button";
import { formatDate, formatFullDateTime, formatTime } from "./constants";
import type { DraftInterviewRound } from "./add-round-dialog";

interface InterviewRoundItemProps {
  round: DraftInterviewRound;
  onEdit: () => void;
  onDelete: () => void;
}

export function InterviewRoundItem({ round, onEdit, onDelete }: InterviewRoundItemProps) {
  const [expanded, setExpanded] = useState(false);

  const time = formatTime(round.scheduledAt);
  const dateLabel = round.scheduledAt ? `${formatDate(round.scheduledAt)}${time ? `, ${time}` : ""}` : "Date pending";

  return (
    <div className="relative">
      <span className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 ${round.status === "completed" ? "border-white bg-zinc-950" : "border-zinc-400 bg-white"}`} />

      <button type="button" onClick={() => setExpanded((prev) => !prev)} className="group -mx-2 flex w-[calc(100%+1rem)] items-start justify-between gap-3 rounded-md px-2 py-1 text-left transition hover:bg-zinc-50">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-medium text-zinc-900">
            <span>{round.round}</span>
            {!round.id && <span className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-mono text-[9px] font-medium text-zinc-600 uppercase">New</span>}
          </div>
          <div className="mt-0.5 font-mono text-[11px] text-zinc-500 tabular-nums">
            {dateLabel}
            {round.durationMinutes ? ` · ${round.durationMinutes} min` : ""}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
          <span className="font-mono text-[10px] tracking-wide text-zinc-400 uppercase">{round.status.replace("_", " ")}</span>
          <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-150 ${expanded ? "rotate-180 text-zinc-700" : "group-hover:text-zinc-600"}`} />
        </div>
      </button>

      {expanded && (
        <div className="mt-2 space-y-2.5 rounded-md border border-zinc-200/80 bg-zinc-50/70 p-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">Schedule</div>
              <div className="mt-0.5 font-mono text-[11px] text-zinc-700 tabular-nums">{formatFullDateTime(round.scheduledAt)}</div>
            </div>
            <div>
              <div className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">Interviewer</div>
              <div className="mt-0.5 text-[11px] text-zinc-700">{round.interviewer || "—"}</div>
            </div>
          </div>

          <div className="border-t border-zinc-200/70 pt-2">
            <div className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">Notes</div>
            <p className="mt-0.5 whitespace-pre-wrap leading-relaxed text-[11px] text-zinc-600">{round.notes || "No notes added."}</p>
          </div>

          <div className="flex items-center justify-end gap-1.5 border-t border-zinc-200/70 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={onEdit} className="h-7 px-2 text-[11px] text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-950">
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onDelete} className="h-7 px-2 text-[11px] text-zinc-500 hover:bg-rose-50 hover:text-rose-600">
              <Trash2 className="mr-1 h-3 w-3" />
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
