import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { deleteApplication } from "#/server/applications";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "#/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface DeleteApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: number;
  company: string;
  onDeleted: () => void;
}

export function DeleteApplicationDialog({ open, onOpenChange, applicationId, company, onDeleted }: DeleteApplicationDialogProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    try {
      await deleteApplication({ data: { id: applicationId } });
      onOpenChange(false);
      onDeleted();
      await router.invalidate();
      toast.success(`Deleted ${company} application`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete application"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold text-zinc-950">Delete application?</AlertDialogTitle>
          <AlertDialogDescription className="text-xs leading-relaxed text-zinc-500">
            This will permanently delete <span className="font-medium text-zinc-900">{company}</span> and all its scheduled interview rounds. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting} className="h-8 text-xs">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={deleting}
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            className="h-8 bg-rose-600 text-xs text-white hover:bg-rose-700"
          >
            {deleting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
