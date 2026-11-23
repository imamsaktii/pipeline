import { Search } from "lucide-react";
import type { ApplicationSearch } from "#/lib/validators";
import { Input } from "#/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";

interface FilterToolbarProps {
  search: ApplicationSearch;
  counts: Record<"all" | "applied" | "interview" | "offer" | "rejected", number>;
  onUpdateSearch: (patch: Partial<ApplicationSearch>) => void;
}

export function FilterToolbar({ search, counts, onUpdateSearch }: FilterToolbarProps) {
  const tabs = [
    { key: "all", label: "All", count: counts.all },
    { key: "applied", label: "Applied", count: counts.applied },
    { key: "interview", label: "Interview", count: counts.interview },
    { key: "offer", label: "Offer", count: counts.offer },
    { key: "rejected", label: "Rejected", count: counts.rejected },
  ] as const;

  return (
    <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-full overflow-x-auto">
        <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
          {tabs.map((tab) => {
            const active = search.status === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onUpdateSearch({ status: tab.key, page: 1 })}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs transition ${active ? "bg-white font-medium text-zinc-950 shadow-xs" : "text-zinc-500 hover:text-zinc-900"}`}
              >
                {tab.label}
                <span className="font-mono text-[11px] text-zinc-400">{tab.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
        <div className="relative w-full sm:flex-1 lg:w-60 lg:flex-none">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <Input value={search.q ?? ""} onChange={(e) => onUpdateSearch({ q: e.target.value || undefined, page: 1 })} placeholder="Search company or role..." className="h-8 w-full pl-8 text-xs" />
        </div>

        <Select value={search.sort} onValueChange={(val) => onUpdateSearch({ sort: val as ApplicationSearch["sort"], page: 1 })}>
          <SelectTrigger className="h-8 w-full text-xs sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Sort: Recent</SelectItem>
            <SelectItem value="oldest">Sort: Oldest</SelectItem>
            <SelectItem value="company">Sort: Company</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
