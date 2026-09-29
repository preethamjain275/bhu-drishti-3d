import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DemoDataNotice } from "./TrustBadge";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="label-technical">{eyebrow}</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ivory md:text-[1.75rem]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  meta,
  children,
  className,
}: {
  title?: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel-surface rounded-xl", className)}>
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h3 className="font-display text-sm font-bold text-ivory">{title}</h3>
          {meta}
        </header>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  );
}

/**
 * Phase 1 module placeholder: establishes the layout, empty state and trust
 * language each geospatial module will inherit in later phases.
 */
export function ModulePlaceholder({
  eyebrow,
  title,
  description,
  icon: Icon,
  capabilities,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  capabilities: string[];
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="spatial-grid-fine relative flex min-h-[300px] flex-col items-center justify-center gap-4 overflow-hidden rounded-lg border border-dashed border-border/80 px-6 py-12 text-center">
            <div className="scan-sweep pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--cyan)_12%,transparent),transparent)]" />
            <span className="grid h-12 w-12 place-items-center rounded-xl border border-primary/25 bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </span>
            <div className="max-w-md">
              <p className="font-display text-base font-bold text-ivory">
                Module foundation ready
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                The interface shell, layout and trust model for {title.toLowerCase()} are in place.
                Spatial processing arrives in a later phase.
              </p>
            </div>
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel title="Planned capabilities">
            <ul className="space-y-2.5">
              {capabilities.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {c}
                </li>
              ))}
            </ul>
          </Panel>
          <DemoDataNotice />
        </div>
      </div>
    </div>
  );
}
