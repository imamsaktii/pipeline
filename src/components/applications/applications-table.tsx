import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import { STATUS_STYLE, formatDate, type ApplicationWithInterviews } from "./constants";

interface ApplicationsTableProps {
  items: ApplicationWithInterviews[];
  pagination: { page: number; pageSize: number; total: number };
  onSelect: (id: number) => void;
  onPageChange: (page: number) => void;
}

export function ApplicationsTable({ items, pagination, onSelect, onPageChange }: ApplicationsTableProps) {
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <Table>
        <TableHeader className="bg-zinc-50/60">
          <TableRow className="border-zinc-200 hover:bg-transparent">
            <TableHead className="h-10 pl-5 text-[11px] font-medium text-zinc-400">Company & role</TableHead>
            <TableHead className="h-10 px-4 text-[11px] font-medium text-zinc-400">Status</TableHead>
            <TableHead className="h-10 px-4 text-[11px] font-medium text-zinc-400">Salary range</TableHead>
            <TableHead className="h-10 px-4 text-[11px] font-medium text-zinc-400">Applied</TableHead>
            <TableHead className="h-10 px-4 text-[11px] font-medium text-zinc-400">Next interview</TableHead>
            <TableHead className="h-10 w-12 pr-5" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-xs text-zinc-500">
                Belum ada lamaran. Klik "+ New application" di kanan atas untuk mulai.
              </TableCell>
            </TableRow>
          ) : (
            items.map((app) => {
              const st = STATUS_STYLE[app.status];
              const nextInterview = app.interviews.find((i) => i.status === "scheduled");
              return (
                <TableRow key={app.id} onClick={() => onSelect(app.id)} className="cursor-pointer border-zinc-100 hover:bg-zinc-50/80">
                  <TableCell className="py-3.5 pl-5">
                    <div className="text-[13px] font-medium text-zinc-950">{app.company}</div>
                    <div className="mt-0.5 text-xs text-zinc-500">{app.role}</div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${st.bg}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 font-mono text-xs text-zinc-600 tabular-nums">{app.salaryRange || "—"}</TableCell>
                  <TableCell className="px-4 py-3.5 font-mono text-xs text-zinc-500 tabular-nums">{formatDate(app.appliedAt)}</TableCell>
                  <TableCell className="px-4 py-3.5 text-xs text-zinc-600">{nextInterview ? `${nextInterview.round} · ${formatDate(nextInterview.scheduledAt)}` : "—"}</TableCell>
                  <TableCell className="py-3.5 pr-5 text-right text-zinc-400">
                    <MoreHorizontal className="inline h-4 w-4" />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-3 text-xs text-zinc-500">
        <span>
          Showing {items.length} of {pagination.total} applications
        </span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7 border-zinc-200 text-zinc-500" disabled={pagination.page <= 1} onClick={() => onPageChange(pagination.page - 1)}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="flex h-7 min-w-7 items-center justify-center rounded-md border border-zinc-200 bg-white px-2 font-mono text-xs font-medium text-zinc-900">{pagination.page}</span>
          <Button variant="outline" size="icon" className="h-7 w-7 border-zinc-200 text-zinc-500" disabled={pagination.page * pagination.pageSize >= pagination.total} onClick={() => onPageChange(pagination.page + 1)}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
