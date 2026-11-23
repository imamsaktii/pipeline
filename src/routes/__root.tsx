import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  Link,
} from '@tanstack/react-router'
import { Toaster } from '#/components/ui/sonner'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Pipeline — Job Application Tracker' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
      },
      { rel: 'icon', type: 'image/png', href: '/logo.png' },
      { rel: 'apple-touch-icon', href: '/logo.png' },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootDocument,
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <img
        src="/empty-states/not-found.png"
        alt="Page not found"
        className="mb-4 h-80 w-80 object-contain"
      />
      <p className="font-mono text-xs font-medium text-zinc-400">404</p>
      <h1 className="mt-1.5 text-lg font-semibold tracking-tight text-zinc-950">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-zinc-500">
        The link may be broken, mistyped, or the application you&apos;re looking
        for has been removed. Check the URL or return to your pipeline to keep
        tracking.
      </p>
      <div className="mt-6 flex items-center gap-2">
        <Link
          to="/"
          search={{ status: 'all', sort: 'recent', page: 1 }}
          className="inline-flex h-8 items-center rounded-md bg-zinc-950 px-3.5 text-xs font-medium text-white transition hover:bg-zinc-800"
        >
          Back to Pipeline
        </Link>
      </div>
    </div>
  ),
})

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <Outlet />
        <Toaster position="top-right" richColors={false} />
        <Scripts />
      </body>
    </html>
  )
}
