import { Check, Search, Send } from 'lucide-react'
import type { ApplicationSearch } from '#/lib/validators'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { domToBlob } from 'modern-screenshot'

interface FilterToolbarProps {
  search: ApplicationSearch
  counts: Record<'all' | 'applied' | 'interview' | 'offer' | 'rejected', number>
  onUpdateSearch: (patch: Partial<ApplicationSearch>) => void
  shareTargetRef: RefObject<HTMLDivElement | null>
}

// const captureOptions = {
//   pixelRatio: 1.5,
//   cacheBust: false,
//   skipFonts: true,
//   backgroundColor: '#ffffff',
//   filter: (el: Node) =>
//     !(el instanceof HTMLElement && el.dataset.noCapture !== undefined),
// }

type ShareStatus = 'idle' | 'loading' | 'done' | 'error'

const waitForPaint = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  )

export function FilterToolbar({
  search,
  counts,
  onUpdateSearch,
  shareTargetRef,
}: FilterToolbarProps) {
  const tabs = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'applied', label: 'Applied', count: counts.applied },
    { key: 'interview', label: 'Interview', count: counts.interview },
    { key: 'offer', label: 'Offer', count: counts.offer },
    { key: 'rejected', label: 'Rejected', count: counts.rejected },
  ] as const

  const [status, setStatus] = useState<ShareStatus>('idle')
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  const finish = (next: ShareStatus) => {
    setStatus(next)
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setStatus('idle'), 2500)
  }

  const handleCopy = async () => {
    const node = shareTargetRef.current
    if (!node || status === 'loading') return

    setStatus('loading')
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': waitForPaint().then(async () => {
            const blob = await domToBlob(node, {
              scale: 1.5,
              backgroundColor: '#ffffff',
              font: false,
              filter: (el) =>
                !(
                  el instanceof HTMLElement &&
                  el.dataset.noCapture !== undefined
                ),
            })
            if (!blob) throw new Error('Failed to capture screenshot')
            return blob
          }),
        }),
      ])
      finish('done')
      toast.success('Screenshot copied to clipboard')
    } catch (err) {
      console.error(err)
      finish('error')
      toast.error('Failed to copy screenshot')
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-full overflow-x-auto">
        <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
          {tabs.map((tab) => {
            const active = search.status === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => onUpdateSearch({ status: tab.key, page: 1 })}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs transition ${active ? 'bg-white font-medium text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                {tab.label}
                <span className="font-mono text-[11px] text-zinc-400">
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
        <Button
          variant="outline"
          className="h-8 w-full justify-center gap-1.5 text-xs sm:w-auto"
          onClick={handleCopy}
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
          title="Copy screenshot to clipboard"
        >
          {status === 'loading' ? (
            <span className="animate-pulse text-[11px] text-zinc-500">
              Capturing...
            </span>
          ) : status === 'done' ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
        </Button>

        <div className="relative w-full sm:flex-1 lg:w-60 lg:flex-none">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search.q ?? ''}
            onChange={(e) =>
              onUpdateSearch({ q: e.target.value || undefined, page: 1 })
            }
            placeholder="Search company or role..."
            className="h-8 w-full pl-8 text-xs"
          />
        </div>

        <Select
          value={search.sort}
          onValueChange={(val) =>
            onUpdateSearch({ sort: val as ApplicationSearch['sort'], page: 1 })
          }
        >
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
  )
}
