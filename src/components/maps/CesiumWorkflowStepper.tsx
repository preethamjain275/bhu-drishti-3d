import React from "react";
import {
  Building2,
  MapPin,
  Layers,
  Scale,
  ShieldAlert,
  FileText,
  Brain,
  Lightbulb,
  UserCheck,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type WorkflowStage =
  | "BUILDING"
  | "PARCEL"
  | "SOURCES"
  | "COMPARE"
  | "CONFLICT"
  | "EVIDENCE"
  | "EXPLAIN"
  | "RECOMMEND"
  | "VERIFY"
  | "AUDIT";

interface CesiumWorkflowStepperProps {
  currentStage: WorkflowStage;
  onSelectStage: (stage: WorkflowStage) => void;
}

const STAGES: { id: WorkflowStage; number: number; label: string; icon: typeof Building2; isAlert?: boolean }[] = [
  { id: "BUILDING", number: 1, label: "Building Selected", icon: Building2 },
  { id: "PARCEL", number: 2, label: "Parcel Identified", icon: MapPin },
  { id: "SOURCES", number: 3, label: "Sources Loaded", icon: Layers },
  { id: "COMPARE", number: 4, label: "Compare", icon: Scale },
  { id: "CONFLICT", number: 5, label: "Conflict Detected", icon: ShieldAlert, isAlert: true },
  { id: "EVIDENCE", number: 6, label: "Evidence", icon: FileText },
  { id: "EXPLAIN", number: 7, label: "Explain", icon: Brain },
  { id: "RECOMMEND", number: 8, label: "Recommend", icon: Lightbulb },
  { id: "VERIFY", number: 9, label: "Verify", icon: UserCheck },
  { id: "AUDIT", number: 10, label: "Audit", icon: History },
];

export function CesiumWorkflowStepper({
  currentStage,
  onSelectStage,
}: CesiumWorkflowStepperProps) {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className="w-full bg-slate-950/90 border-t border-slate-800/90 backdrop-blur-xl px-4 py-2.5 flex items-center justify-between overflow-x-auto select-none no-scrollbar font-sans">
      <div className="flex items-center gap-1 min-w-max mx-auto">
        {STAGES.map((step, idx) => {
          const isActive = step.id === currentStage;
          const isPassed = idx < currentIndex;
          const StepIcon = step.icon;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => onSelectStage(step.id)}
                className={cn(
                  "flex flex-col items-center justify-center px-3 py-1.5 rounded-xl transition-all duration-300 group cursor-pointer",
                  isActive
                    ? step.isAlert
                      ? "bg-red-950/60 border border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.3)] text-red-300"
                      : "bg-teal-500/20 border border-teal-400/60 shadow-[0_0_15px_rgba(20,184,166,0.35)] text-teal-300"
                    : isPassed
                    ? "text-slate-300 hover:text-white hover:bg-slate-900/60"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/40"
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300",
                    isActive
                      ? step.isAlert
                        ? "bg-red-500/30 text-red-400 border border-red-400"
                        : "bg-teal-500 text-slate-950 shadow-md"
                      : isPassed
                      ? "bg-slate-800 text-teal-400 border border-teal-500/30"
                      : "bg-slate-900 border border-slate-800 text-slate-500 group-hover:border-slate-700"
                  )}
                >
                  <StepIcon className="h-4 w-4" />
                </div>
                <span className="mt-1 font-mono text-[9px] font-bold tracking-tight text-center whitespace-nowrap">
                  {step.number}. {step.label}
                </span>
              </button>

              {idx < STAGES.length - 1 && (
                <div className="h-[1px] w-4 bg-slate-800 flex items-center justify-center">
                  <span className="text-[8px] text-slate-600">›</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
