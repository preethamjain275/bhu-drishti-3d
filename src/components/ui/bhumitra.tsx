/**
 * BHOO-MITRA AI — Reusable UI Components
 *
 * KpiCard, GlassPanel, MapContainer, EmptyState, LoadingState, StatusBadge, PageWrapper
 * These are the primitives from which all module pages are assembled.
 */

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Loader2, Inbox } from "lucide-react";

// ---------------------------------------------------------------------------
// KpiCard — metric display with optional trend and icon
// ---------------------------------------------------------------------------

interface KpiCardProps {
  label: string;
  value: string | number;
  context?: string;
  note?: string;
  icon?: LucideIcon;
  tone?: "primary" | "verified" | "conflict" | "saffron" | "cyan" | "muted";
  trend?: number[];
  className?: string;
}

const TONE_CLASS = {
  primary: "text-primary",
  verified: "text-verified",
  conflict: "text-conflict",
  saffron: "text-saffron",
  cyan: "text-cyan",
  muted: "text-muted-foreground",
} as const;

function MiniSparkline({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * 60},${18 - ((v - min) / (max - min || 1)) * 16}`,
    )
    .join(" ");
  return (
    <svg viewBox="0 0 60 20" className={cn("h-5 w-16 shrink-0", className)} aria-hidden>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  context,
  note,
  icon: Icon,
  tone = "primary",
  trend,
  className,
}: KpiCardProps) {
  const toneClass = TONE_CLASS[tone];
  return (
    <div
      className={cn(
        "liquid-glass elevate-hover flex flex-col gap-1 rounded-2xl p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {Icon && <Icon className={cn("h-4 w-4 shrink-0", toneClass)} aria-hidden />}
        {trend && <MiniSparkline data={trend} className={toneClass} />}
      </div>
      <p className={cn("mt-2 font-display text-2xl font-bold text-ivory")}>{value}</p>
      <p className="text-xs font-semibold text-foreground">{label}</p>
      {context && <p className={cn("text-xs", toneClass)}>{context}</p>}
      {note && <p className="text-[11px] text-muted-foreground">{note}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GlassPanel — generic glass-morphism container
// ---------------------------------------------------------------------------

interface GlassPanelProps {
  title?: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function GlassPanel({ title, meta, children, className, id }: GlassPanelProps) {
  return (
    <section
      id={id}
      className={cn(
        "panel-surface rounded-xl p-4",
        className,
      )}
    >
      {(title || meta) && (
        <header className="mb-3 flex items-center justify-between gap-2">
          {title && (
            <h2 className="font-display text-sm font-semibold text-ivory">{title}</h2>
          )}
          {meta && <div className="shrink-0">{meta}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// StatusBadge — consistent color-coded status pill
// ---------------------------------------------------------------------------

type StatusVariant =
  | "verified"
  | "conflict"
  | "warning"
  | "processing"
  | "ready"
  | "draft"
  | "muted"
  | "info";

const STATUS_STYLE: Record<StatusVariant, string> = {
  verified: "bg-verified/15 text-verified border-verified/40",
  conflict: "bg-conflict/15 text-conflict border-conflict/40",
  warning: "bg-saffron/15 text-saffron border-saffron/40",
  processing: "bg-primary/15 text-primary border-primary/40",
  ready: "bg-verified/10 text-verified border-verified/30",
  draft: "bg-muted/30 text-muted-foreground border-border",
  muted: "text-muted-foreground border-border",
  info: "bg-cyan/10 text-cyan border-cyan/30",
};

export function StatusBadge({
  label,
  variant = "muted",
  pulse = false,
  className,
}: {
  label: string;
  variant?: StatusVariant;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        STATUS_STYLE[variant],
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-current",
          pulse && "badge-pulse",
        )}
        aria-hidden
      />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// MapContainer — placeholder for MapLibre GL integration
// ---------------------------------------------------------------------------

interface MapContainerProps {
  /** Slot for injecting the real MapLibre GL component in Phase 2 */
  children?: ReactNode;
  className?: string;
  /** Show a placeholder overlay when no map is mounted */
  placeholder?: boolean;
  placeholderLabel?: string;
}

export function MapContainer({
  children,
  className,
  placeholder = false,
  placeholderLabel = "Geospatial Workspace",
}: MapContainerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border",
        "bg-[#0a0f18] spatial-grid",
        className,
      )}
      role="region"
      aria-label={placeholderLabel}
    >
      {/* Subtle scan sweep for visual interest on the placeholder */}
      {placeholder && (
        <>
          <div className="scan-sweep pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan/70 to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-cyan/5" aria-hidden />

          {/* Fake Parcel Outlines */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" aria-hidden>
             <path d="M100,100 L200,120 L180,250 L80,220 Z" fill="none" stroke="currentColor" className="text-primary" strokeWidth="1" strokeDasharray="4 4" />
             <path d="M220,130 L350,110 L380,200 L240,240 Z" fill="none" stroke="currentColor" className="text-cyan" strokeWidth="1" />
          </svg>

          {/* Grid crosshairs */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
            <div className="h-px w-16 bg-primary/20" />
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
            <div className="h-16 w-px bg-primary/20" />
          </div>

          <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center relative z-10">
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-primary/30 bg-primary/10 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </div>
            <p className="label-technical text-primary drop-shadow-md">{placeholderLabel}</p>
            <p className="max-w-xs text-xs text-muted-foreground drop-shadow-md">
              MapLibre GL JS spatial workspace will be mounted here in Phase 2.
            </p>
            <div className="mt-1 flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron badge-pulse" aria-hidden />
              <span className="label-technical text-saffron drop-shadow-sm">SYNTHETIC DEMO DATA</span>
            </div>
          </div>

          {/* GIS Controls Placeholders */}
          <div className="absolute right-4 top-4 flex flex-col gap-2">
             <div className="flex flex-col overflow-hidden rounded-md border border-border bg-background/60 backdrop-blur-md shadow-sm">
                <button className="p-2 text-muted-foreground hover:text-ivory hover:bg-white/5 transition-colors" aria-label="Zoom in"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg></button>
                <div className="h-px bg-border w-full" />
                <button className="p-2 text-muted-foreground hover:text-ivory hover:bg-white/5 transition-colors" aria-label="Zoom out"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg></button>
             </div>
             <button className="rounded-md border border-border bg-background/60 p-2 text-muted-foreground backdrop-blur-md shadow-sm hover:text-ivory hover:bg-white/5 transition-colors" aria-label="North indicator">
                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 2 4 10-4-2-4 2 4-10z"/><path d="m12 22v-8"/></svg>
             </button>
          </div>
          
          <div className="absolute left-4 top-4">
             <button className="rounded-md border border-border bg-background/60 p-2 text-muted-foreground backdrop-blur-md shadow-sm hover:text-ivory hover:bg-white/5 transition-colors flex items-center gap-2" aria-label="Layers">
                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
                 <span className="text-xs font-semibold">Layers</span>
             </button>
          </div>
        </>
      )}

      {/* Real map content slot */}
      {!placeholder && children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmptyState — consistent empty state with icon, title, and action
// ---------------------------------------------------------------------------

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "spatial-grid flex flex-col items-center rounded-xl border border-dashed border-border p-12 text-center",
        className,
      )}
    >
      <div className="grid h-12 w-12 place-items-center rounded-xl border border-primary/25 bg-primary/10">
        <Icon className="h-5 w-5 text-primary" aria-hidden />
      </div>
      <p className="mt-4 font-display text-base font-bold text-ivory">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ErrorState
// ---------------------------------------------------------------------------

export function ErrorState({
  title = "An error occurred",
  description = "The requested data could not be loaded.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border border-conflict/30 bg-conflict/5 rounded-xl", className)}>
      <div className="grid h-10 w-10 place-items-center rounded-full bg-conflict/20 text-conflict mb-3">
         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <p className="font-semibold text-ivory">{title}</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">{description}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LoadingState — consistent loading skeleton
// ---------------------------------------------------------------------------

export function LoadingState({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-sm text-muted-foreground",
        className,
      )}
      aria-live="polite"
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
      <p>{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ConfidenceIndicator
// ---------------------------------------------------------------------------

export function ConfidenceIndicator({ score, className }: { score: number; className?: string }) {
  const percent = Math.round(score * 100);
  const isHigh = percent >= 80;
  const isMed = percent >= 50 && percent < 80;
  const tone = isHigh ? "text-verified" : isMed ? "text-saffron" : "text-conflict";
  const label = isHigh ? "HIGH CONFIDENCE" : isMed ? "MEDIUM CONFIDENCE" : "LOW CONFIDENCE";
  
  return (
    <div className={cn("flex flex-col gap-1", className)}>
       <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold text-ivory">{percent}%</span>
          <span className={cn("label-technical text-[10px]", tone)}>{label}</span>
       </div>
       <div className="h-1.5 w-32 rounded bg-muted overflow-hidden flex">
          <div className={cn("h-full", isHigh ? "bg-verified" : isMed ? "bg-saffron" : "bg-conflict")} style={{ width: `${percent}%` }} />
       </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// QualityIndicator
// ---------------------------------------------------------------------------

export function QualityIndicator({ score, className }: { score: number; className?: string }) {
   return (
      <div className={cn("flex items-center gap-3", className)}>
         <div className="relative grid h-12 w-12 place-items-center">
            <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90">
               <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted" strokeWidth="3" />
               <circle cx="18" cy="18" r="16" fill="none" className={score >= 80 ? "stroke-verified" : "stroke-saffron"} strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - score} strokeLinecap="round" />
            </svg>
            <span className="font-mono text-sm font-bold text-ivory">{score}</span>
         </div>
         <div>
            <p className="label-technical text-muted-foreground">SOURCE QUALITY</p>
            <p className="text-xs text-muted-foreground">Based on geometry & attributes</p>
         </div>
      </div>
   );
}

// ---------------------------------------------------------------------------
// PageWrapper — consistent page container with BHOO-MITRA header
// ---------------------------------------------------------------------------

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn("relative space-y-6", className)}>
      <div className="dash-aurora pointer-events-none absolute inset-0 -z-10" aria-hidden />
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DataTable — Reusable data table with empty/loading states
// ---------------------------------------------------------------------------

interface DataTableProps {
  columns: ReactNode[];
  data: ReactNode[][];
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyState?: ReactNode;
}

export function DataTable({ columns, data, isLoading, isEmpty, emptyState }: DataTableProps) {
  if (isLoading) {
    return <LoadingState label="Loading records..." className="py-24" />;
  }

  if (isEmpty || data.length === 0) {
    return (
      <div className="py-12">
        {emptyState || <EmptyState title="No records found" description="No data matches your current filters." />}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-surface/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background/50">
            {columns.map((col, i) => (
              <th key={i} className="h-10 px-4 text-left font-semibold text-muted-foreground align-middle">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border/50 transition-colors hover:bg-white/5">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="p-4 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-background/50">
         <p className="text-xs text-muted-foreground">Showing 1 to {data.length} entries</p>
         <div className="flex gap-1">
            <button className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-white/10 disabled:opacity-50" disabled>Prev</button>
            <button className="rounded bg-primary/20 text-primary px-2 py-1 text-xs font-semibold">1</button>
            <button className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-white/10">Next</button>
         </div>
      </div>
    </div>
  );
}
