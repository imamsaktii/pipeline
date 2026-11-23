import { HeadContent, Outlet, Scripts, createRootRoute, Link } from "@tanstack/react-router";
import { Toaster } from "#/components/ui/sonner";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { title: "Pipeline — Job Application Tracker" }],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/logo.png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootDocument,
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <p className="font-mono text-xs font-medium text-zinc-400">404</p>
      <h1 className="mt-2 text-lg font-semibold tracking-tight text-zinc-950">Page not found</h1>
      <p className="mt-1 max-w-xs text-xs text-zinc-500">The page you are looking for doesn&apos;t exist or has been moved.</p>
      <Link to="/" className="mt-5 inline-flex h-8 items-center rounded-md bg-zinc-950 px-3.5 text-xs font-medium text-white transition hover:bg-zinc-800">
        Back to Pipeline
      </Link>
    </div>
  ),
});

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
  );
}
