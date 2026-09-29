import React, { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { reportRuntimeError } from "../lib/error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth/AuthProvider";

function NotFoundComponent() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/_app/")) {
      const cleanPath = window.location.pathname.replace(/^\/_app/, "") + window.location.search;
      window.location.replace(cleanPath);
    }
  }, []);

  return (
    <div className="spatial-atmosphere flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="label-technical">Coordinate not found</p>
        <h1 className="mt-3 font-display text-7xl font-bold text-ivory">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">This location has no record</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/overview"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            Go to Overview Workspace
          </Link>
          <Link
            to="/intelligence-3d"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-ivory hover:bg-white/10 transition-colors"
          >
            Open 3D Workspace
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Root boundary caught error:", error);
  const router = useRouter();
  useEffect(() => {
    reportRuntimeError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="spatial-atmosphere flex min-h-screen items-center justify-center p-4">
      <div className="max-w-lg rounded-2xl border border-border bg-popover/90 p-6 shadow-2xl backdrop-blur-xl text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-saffron/40 bg-saffron/10 text-saffron">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-ivory">Workspace View Recovery</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            A temporary view issue occurred while loading this tab. You can instantly reload or return to the workspace overview.
          </p>
        </div>

        {error?.message && (
          <div className="rounded-lg border border-border/60 bg-slate-950/60 p-3 text-left">
            <p className="font-mono text-[11px] text-saffron truncate">Error: {error.message}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            Reload Tab
          </button>
          <a
            href="/overview"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-ivory hover:bg-white/10 transition-colors"
          >
            Open Overview Workspace
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider delayDuration={250}>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
