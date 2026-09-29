import { BadgeCheck, Cpu, FileInput, Sparkles, ShieldQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

export type TrustLevel = "source" | "derived" | "ai" | "inferred" | "verified" | "unverified";

const config: Record<
  TrustLevel,
  { label: string; icon: typeof BadgeCheck; className: string }
> = {
  source: {
    label: "Source data",
    icon: FileInput,
    className: "border-border text-muted-foreground bg-surface",
  },
  derived: {
    label: "Derived",
    icon: Cpu,
    className: "border-primary/30 text-primary bg-primary/10",
  },
  ai: {
    label: "AI-assisted",
    icon: Sparkles,
    className: "border-inferred/35 text-inferred bg-inferred/10",
  },
  inferred: {
    label: "Inferred",
    icon: Sparkles,
    className: "border-inferred/35 text-inferred bg-inferred/10",
  },
  verified: {
    label: "Verified by officer",
    icon: BadgeCheck,
    className: "border-verified/35 text-verified bg-verified/10",
  },
  unverified: {
    label: "Awaiting verification",
    icon: ShieldQuestion,
    className: "border-saffron/35 text-saffron bg-saffron/10",
  },
};

/** Communicates the provenance of any value shown in the interface. */
export function TrustBadge({
  level,
  className,
  label,
}: {
  level: TrustLevel;
  className?: string;
  label?: string;
}) {
  const { label: defaultLabel, icon: Icon, className: tone } = config[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[0.625rem] tracking-wide uppercase",
        tone,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {label ?? defaultLabel}
    </span>
  );
}

export function DemoDataNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/[0.04] px-3.5 py-2 text-xs backdrop-blur-md",
        className,
      )}
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse" />
      <p className="text-xs text-foreground/80 font-mono">
        <span className="font-bold text-primary">Harmonized Spatial Intelligence:</span> Cross-referenced across Municipal GIS, Revenue Cadastre & Drone Orthomosaics.
      </p>
    </div>
  );
}
