import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { createApplication } from '#/server/applications'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Loader2, Plus } from 'lucide-react'

export function NewApplicationDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const company = String(fd.get('company') ?? '').trim()
    const role = String(fd.get('role') ?? '').trim()

    const isValid = company.trim().length > 0 && role.trim().length > 0

    if (!isValid) return

    try {
      await createApplication({
        data: {
          company: String(fd.get('company') ?? ''),
          role: String(fd.get('role') ?? ''),
          status: 'applied',
          salaryRange: String(fd.get('salaryRange') ?? ''),
          location: String(fd.get('location') ?? ''),
          jobUrl: String(fd.get('jobUrl') ?? ''),
          notes: String(fd.get('notes') ?? ''),
        },
      })
      setOpen(false)
      await router.invalidate()
      toast.success(`Added ${company} to pipeline`)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to add application'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-zinc-950 text-white hover:bg-zinc-800">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          New application
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="company">
                Company <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="company"
                name="company"
                placeholder="Stripe"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">
                Role <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="role"
                name="role"
                placeholder="Backend Engineer"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="salaryRange">Salary range</Label>
              <Input
                id="salaryRange"
                name="salaryRange"
                placeholder="$180k – $210k"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Jakarta · Hybrid"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input
              id="jobUrl"
              name="jobUrl"
              type="url"
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Referral, tech stack, etc."
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-zinc-950 text-white"
            >
              {submitting && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              {submitting ? 'Saving...' : 'Save application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
