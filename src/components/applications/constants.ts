import type { Application, Interview } from '#/db/schema'

export type ApplicationWithInterviews = Application & {
  interviews: Interview[]
}

export const STATUS_STYLE = {
  applied: { bg: 'bg-slate-100 text-slate-700', dot: 'bg-slate-500', label: 'Applied' },
  interview: { bg: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500', label: 'Interview' },
  offer: { bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', label: 'Offer' },
  rejected: { bg: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500', label: 'Rejected' },
} as const

export function formatDate(date: Date | string | null) {
  if (!date) return 'Date pending'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getErrorMessage(err: unknown, fallback: string) {
  if (err instanceof Error && err.message) {
    try {
      const parsed = JSON.parse(err.message)
      if (Array.isArray(parsed) && parsed[0]?.message) {
        return parsed[0].message
      }
    } catch {
      return err.message
    }
  }
  return fallback
}

export function formatTime(value: Date | string | null | undefined) {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function formatFullDateTime(value: Date | string | null | undefined) {
  if (!value) return 'Date pending'
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return 'Date pending'
  const datePart = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return `${datePart} · ${formatTime(date)}`
}