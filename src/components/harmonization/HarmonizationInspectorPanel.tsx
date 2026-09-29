import React from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Play,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PipelineStage, HarmonizationIssue, HarmonizationReadiness } from "@/lib/api/harmonization";

interface HarmonizationInspectorPanelProps {
  currentStage: PipelineStage;
  issues: HarmonizationIssue[];
  readiness: HarmonizationReadiness;
  isProcessing?: boolean;
  onRunDemo: () => void;
  onContinueToEntityMatching: () => void;
  onResolveIssue: (id: string) => void;
}

export const HarmonizationInspectorPanel: React.FC<HarmonizationInspectorPanelProps> = ({
  currentStage,
  issues,
  readiness,
  isProcessing,
  onRunDemo,
  onContinueToEntityMatching,
  onResolveIssue,
}) => {
  const openIssuesCount = issues.filter((i) => i.status === "OPEN").length;

  return (
    <div className="panel-surface flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4 shadow-lg backdrop-blur space-y-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            <h3 className="font-display font-semibold text-slate-100 text-sm">
              INSPECTOR & DIAGNOSTICS
            </h3>
          </div>
          <Badge variant="outline" className="border-cyan-500/40 bg-cyan-950/50 text-cyan-300 font-mono text-[10px]">
            {currentStage} STAGE
          </Badge>
        </div>

        {/* Readiness Index Card */}
        <div className="rounded-lg border border-cyan-500/30 bg-slate-900/60 p-3 flex items-center justify-between font-mono">
          <div>
            <div className="text-[10px] text-slate-400">HARMONIZATION READINESS</div>
            <div className="text-xs font-bold text-emerald-400">{readiness.status}</div>
          </div>
          <span className="font-display font-bold text-xl text-cyan-300">{readiness.overallScore}%</span>
        </div>

        {/* Harmonization Issues List */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300">
            <span className="font-bold uppercase tracking-wider text-slate-200">
              HARMONIZATION ISSUES ({issues.length})
            </span>
            <Badge variant="outline" className={openIssuesCount > 0 ? "border-amber-500/40 text-amber-300 text-[9px]" : "border-emerald-500/40 text-emerald-300 text-[9px]"}>
              {openIssuesCount} OPEN
            </Badge>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className={cn(
                  "rounded-lg border p-3 text-xs space-y-1.5 transition-colors",
                  issue.status === "RESOLVED"
                    ? "border-slate-800/80 bg-slate-950/40 opacity-60"
                    : issue.severity === "HIGH"
                    ? "border-amber-500/40 bg-amber-950/20 text-slate-200"
                    : "border-slate-800 bg-slate-900/60 text-slate-300"
                )}
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="font-bold text-slate-100 flex items-center gap-1">
                    <AlertTriangle className={cn("h-3.5 w-3.5", issue.severity === "HIGH" ? "text-amber-400" : "text-cyan-400")} />
                    {issue.title}
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      issue.status === "RESOLVED"
                        ? "border-emerald-500/40 text-emerald-300 text-[9px]"
                        : "border-amber-500/40 text-amber-300 text-[9px]"
                    }
                  >
                    {issue.status}
                  </Badge>
                </div>

                <p className="text-[11px] text-slate-400 leading-tight">{issue.description}</p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>Target: {issue.field}</span>
                  {issue.status === "OPEN" && (
                    <button
                      onClick={() => onResolveIssue(issue.id)}
                      className="text-cyan-400 hover:underline font-bold"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="space-y-2 pt-3 border-t border-slate-800">
        <Button
          disabled={isProcessing}
          onClick={onRunDemo}
          className="w-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-900 font-bold text-xs shadow-md h-9"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin text-indigo-400" />
              RUNNING HARMONIZATION DEMO…
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
              RUN HARMONIZATION DEMO
            </>
          )}
        </Button>

        <Button
          onClick={onContinueToEntityMatching}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md h-10"
        >
          CONTINUE TO ENTITY MATCHING
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
