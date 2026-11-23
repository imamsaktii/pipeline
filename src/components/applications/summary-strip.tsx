interface SummaryStripProps {
  metrics: {
    totalApplied: number;
    activeInterviews: number;
    offers: number;
    responseRate: number;
  };
}

export function SummaryStrip({ metrics }: SummaryStripProps) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 border-y border-zinc-200 py-3.5 text-xs sm:flex sm:flex-wrap sm:items-center sm:gap-6">
      <div className="flex items-center gap-2">
        <span className="text-zinc-500">Total applied</span>
        <span className="font-mono font-semibold text-zinc-950 tabular-nums">{metrics.totalApplied}</span>
      </div>
      <span className="hidden h-3.5 w-px bg-zinc-200 sm:block" />
      <div className="flex items-center gap-2">
        <span className="text-zinc-500">Active interviews</span>
        <span className="font-mono font-semibold text-zinc-950 tabular-nums">{metrics.activeInterviews}</span>
      </div>
      <span className="hidden h-3.5 w-px bg-zinc-200 sm:block" />
      <div className="flex items-center gap-2">
        <span className="text-zinc-500">Offers</span>
        <span className="font-mono font-semibold text-zinc-950 tabular-nums">{metrics.offers}</span>
      </div>
      <span className="hidden h-3.5 w-px bg-zinc-200 sm:block" />
      <div className="flex items-center gap-2">
        <span className="text-zinc-500">Response rate</span>
        <span className="font-mono font-semibold text-zinc-950 tabular-nums">{metrics.responseRate}%</span>
      </div>
    </div>
  );
}
