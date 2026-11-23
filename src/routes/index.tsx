import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { applicationSearchSchema, type ApplicationSearch } from "#/lib/validators";
import { getApplications } from "#/server/applications";
import { NewApplicationDialog } from "#/components/applications/new-application-dialog";
import { SummaryStrip } from "#/components/applications/summary-strip";
import { FilterToolbar } from "#/components/applications/filter-toolbar";
import { ApplicationsTable } from "#/components/applications/applications-table";
import { ApplicationDetailSheet } from "#/components/applications/application-detail-sheet";
import { EmptyState } from "#/components/applications/empty-state";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  validateSearch: applicationSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => getApplications({ data: deps }),
  component: PipelinePage,
});

function PipelinePage() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const isFetching = useRouterState({
    select: (s) => s.status === "pending" || s.isLoading,
  });

  const selectedApp = data.items.find((item) => item.id === search.selected);

  const updateSearch = (patch: Partial<ApplicationSearch>) => {
    navigate({
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <header className="h-14 border-b border-zinc-200">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Pipeline" className="h-7 w-7 rounded-md" />
            <span className="text-sm font-semibold tracking-tight text-zinc-950">Pipeline</span>
            <span className="hidden h-4 w-px bg-zinc-200 sm:block" />
            <span className="hidden text-xs text-zinc-500 sm:inline">Job application tracker</span>
          </div>

          <NewApplicationDialog />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">Applications</h1>
            {isFetching && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {data.metrics.totalApplied} applications across {data.metrics.uniqueCompanies} companies
          </p>
        </div>

        <SummaryStrip metrics={data.metrics} />

        <FilterToolbar search={search} counts={data.counts} onUpdateSearch={updateSearch} />

        <div className={isFetching ? "pointer-events-none opacity-60 transition-opacity" : "transition-opacity"}>
          {data.items.length === 0 ? (
            <EmptyState status={search.status} hasSearch={Boolean(search.q?.trim())} />
          ) : (
            <ApplicationsTable items={data.items} pagination={data.pagination} onSelect={(id) => updateSearch({ selected: id })} onPageChange={(page) => updateSearch({ page })} />
          )}
        </div>
      </main>

      <ApplicationDetailSheet application={selectedApp} onClose={() => updateSearch({ selected: undefined })} />
    </div>
  );
}
