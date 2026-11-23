import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveApplicationChanges } from "#/server/applications";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "#/components/ui/alert-dialog";
import { getErrorMessage } from "./constants";
import type { DraftInterviewRound } from "./add-round-dialog";
import type { ApplicationStatus } from "./status-select";

interface SaveApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: number;
  company: string;
  nextStatus: ApplicationStatus;
  draftInterviews: DraftInterviewRound[];
  deletedInterviewIds: number[];
  onSaved: () => void;
}

export function SaveApplicationDialog({ open, onOpenChange, applicationId, company, nextStatus, draftInterviews, deletedInterviewIds, onSaved }: SaveApplicationDialogProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    setSaving(true);
    try {
      await saveApplicationChanges({
        data: {
          id: applicationId,
          status: nextStatus,
          interviews: draftInterviews.map(({ tempId: _, ...rest }) => rest),
          deletedInterviewIds,
        },
      });
      onOpenChange(false);
      onSaved();
      await router.invalidate();
      toast.success(`Saved changes to ${company}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save changes"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold text-zinc-950">Save changes?</AlertDialogTitle>
          <AlertDialogDescription className="text-xs leading-relaxed text-zinc-500">
            Commit all pending updates for <span className="font-medium text-zinc-900">{company}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={saving} className="h-8 text-xs">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={saving}
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            className="h-8 bg-zinc-950 text-xs text-white hover:bg-zinc-800"
          >
            {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {saving ? "Saving..." : "Confirm & Save"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
