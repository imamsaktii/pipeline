import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { ArrowUpRight, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "#/components/ui/sheet";
import { STATUS_STYLE, formatDate, getErrorMessage, type ApplicationWithInterviews } from "./constants";
import { AddRoundDialog } from "./add-round-dialog";
import { DeleteApplicationDialog } from "./delete-application-dialog";
import { StatusSelect, type ApplicationStatus } from "./status-select";
import { SaveApplicationDialog } from "./save-application-dialog";
import { InterviewRoundItem } from "./interview-round-item";

interface ApplicationDetailSheetProps {
  application: ApplicationWithInterviews | undefined;
  onClose: () => void;
}

export function ApplicationDetailSheet({ application, onClose }: ApplicationDetailSheetProps) {
  const router = useRouter();
  const [openAddRound, setOpenAddRound] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [draftStatus, setDraftStatus] = useState<ApplicationStatus>("applied");
  const [saving, setSaving] = useState(false);
  const [openSaveConfirm, setOpenSaveConfirm] = useState(false);
  const [draftInterviews, setDraftInterviews] = useState<DraftInterviewRound[]>([]);
  const [deletedInterviewIds, setDeletedInterviewIds] = useState<number[]>([]);
  const [roundsDirty, setRoundsDirty] = useState(false);
  const [editingRound, setEditingRound] = useState<DraftInterviewRound | null>(null);

  useEffect(() => {
    if (application) {
      setDraftStatus(application.status);
    }
  }, [application?.id, application?.status]);

  useEffect(() => {
    if (application) {
      setDraftStatus(application.status);
      setDraftInterviews(
        application.interviews.map((r) => ({
          id: r.id,
          tempId: String(r.id),
          round: r.round,
          status: r.status,
          scheduledAt: r.scheduledAt ? new Date(r.scheduledAt).toISOString() : "",
          durationMinutes: r.durationMinutes ?? 45,
          interviewer: r.interviewer ?? "",
          notes: r.notes ?? "",
        })),
      );
      setDeletedInterviewIds([]);
      setRoundsDirty(false);
    }
  }, [application]);

  const hasChanges = Boolean(application && (draftStatus !== application.status || roundsDirty));

  function handleUpsertRound(round: DraftInterviewRound) {
    setDraftInterviews((prev) => {
      const exists = prev.some((r) => r.tempId === round.tempId);
      return exists ? prev.map((r) => (r.tempId === round.tempId ? round : r)) : [...prev, round];
    });
    setRoundsDirty(true);
    setEditingRound(null);
  }

  function handleDeleteRound(round: DraftInterviewRound) {
    setDraftInterviews((prev) => prev.filter((r) => r.tempId !== round.tempId));
    if (round.id) {
      setDeletedInterviewIds((prev) => [...prev, round.id!]);
    }
    setRoundsDirty(true);
  }

  async function handleSave() {
    if (!application || !hasChanges) return;
    setSaving(true);
    try {
      await updateApplicationStatus({
        data: { id: application.id, status: draftStatus },
      });
      await router.invalidate();
      toast.success(`Saved ${application.company} (${STATUS_STYLE[draftStatus].label})`);
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save changes"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Sheet open={Boolean(application)} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-[440px]">
          {application && (
            <>
              {/* Header */}
              <SheetHeader className="border-b border-zinc-200 px-6 py-5 text-left">
                <div className="flex items-start gap-3 pr-8">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-700">{application.company.charAt(0).toUpperCase()}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <SheetTitle className="truncate text-base font-semibold tracking-tight text-zinc-950">{application.company}</SheetTitle>
                      {application.jobUrl && (
                        <a href={application.jobUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-700">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="truncate text-xs text-zinc-500">{application.role}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2.5 text-xs text-zinc-500">
                  <StatusSelect value={draftStatus} onChange={setDraftStatus} disabled={saving} />
                  <span className="font-mono text-[11px] text-zinc-500">Applied {formatDate(application.appliedAt)}</span>
                </div>
              </SheetHeader>

              {/* Body */}
              <div className="flex-1 divide-y divide-zinc-100 overflow-y-auto text-xs">
                <div className="grid grid-cols-2 px-6 py-4">
                  <div className="pr-4">
                    <div className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">Salary range</div>
                    <div className="mt-1 font-mono text-xs font-medium text-zinc-900 tabular-nums">{application.salaryRange || "—"}</div>
                  </div>
                  <div className="border-l border-zinc-200 pl-4">
                    <div className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">Location</div>
                    <div className="mt-1 text-xs font-medium text-zinc-900">{application.location || "—"}</div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">Notes</div>
                  <p className="mt-1.5 leading-relaxed text-zinc-600">{application.notes || "—"}</p>
                </div>

                {application.contactName && (
                  <div className="px-6 py-4">
                    <div className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">Contact</div>
                    <div className="mt-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-[11px] font-medium text-zinc-600">{application.contactName.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="font-medium text-zinc-900">{application.contactName}</div>
                          <div className="text-[11px] text-zinc-500">{application.contactRole}</div>
                        </div>
                      </div>
                      <span className="truncate font-mono text-[11px] text-zinc-500">{application.contactEmail}</span>
                    </div>
                  </div>
                )}

                <div className="px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">Interview rounds</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 px-2.5 text-[11px] font-medium text-zinc-700"
                      onClick={() => {
                        setEditingRound(null);
                        setOpenAddRound(true);
                      }}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add round
                    </Button>
                  </div>

                  {draftInterviews.length === 0 ? (
                    <p className="text-zinc-400">No interview rounds scheduled yet.</p>
                  ) : (
                    <div className="ml-1 space-y-3 border-l border-zinc-200 pl-4">
                      {draftInterviews.map((round) => (
                        <InterviewRoundItem
                          key={round.tempId}
                          round={round}
                          onEdit={() => {
                            setEditingRound(round);
                            setOpenAddRound(true);
                          }}
                          onDelete={() => handleDeleteRound(round)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3.5">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" disabled={saving} className="h-8 px-2 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-rose-600" onClick={() => setOpenDelete(true)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                  </Button>
                  <Button type="button" size="sm" variant="outline" disabled={!hasChanges} onClick={() => setOpenSaveConfirm(true)} className="h-8 px-3 text-xs font-medium">
                    Save
                  </Button>
                </div>

                {application.jobUrl && (
                  <Button asChild size="sm" className="h-8 bg-zinc-950 px-3 text-xs text-white hover:bg-zinc-800">
                    <a href={application.jobUrl} target="_blank" rel="noreferrer">
                      Open posting
                      <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {application && <AddRoundDialog open={openAddRound} onOpenChange={setOpenAddRound} applicationId={application.id} company={application.company} role={application.role} />}

      {application && <DeleteApplicationDialog open={openDelete} onOpenChange={setOpenDelete} applicationId={application.id} company={application.company} onDeleted={onClose} />}

      {application && (
        <SaveApplicationDialog open={openSaveConfirm} onOpenChange={setOpenSaveConfirm} applicationId={application.id} company={application.company} currentStatus={application.status} nextStatus={draftStatus} onSaved={onClose} />
      )}

      {application && (
        <AddRoundDialog
          open={openAddRound}
          onOpenChange={(open) => {
            setOpenAddRound(open);
            if (!open) setEditingRound(null);
          }}
          company={application.company}
          role={application.role}
          initialRound={editingRound}
          onSubmit={handleUpsertRound}
        />
      )}

      {application && (
        <SaveApplicationDialog
          open={openSaveConfirm}
          onOpenChange={setOpenSaveConfirm}
          applicationId={application.id}
          company={application.company}
          nextStatus={draftStatus}
          draftInterviews={draftInterviews}
          deletedInterviewIds={deletedInterviewIds}
          onSaved={onClose}
        />
      )}
    </>
  );
}
