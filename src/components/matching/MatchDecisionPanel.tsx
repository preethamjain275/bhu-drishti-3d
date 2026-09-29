import React from "react";
import { CheckCircle2, AlertTriangle, HelpCircle, Copy, XCircle, ShieldCheck, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MatchStatus } from "@/lib/api/entityMatching";

interface MatchDecisionPanelProps {
  confidenceScore: number;
  currentStatus: MatchStatus;
  onSubmitDecision: (decision: MatchStatus) => void;
  isSubmitting?: boolean;
}

export const MatchDecisionPanel: React.FC<MatchDecisionPanelProps> = ({
  confidenceScore,
  currentStatus,
  onSubmitDecision,
  isSubmitting,
}) => {
  const getThresholdBanner = () => {
    if (confidenceScore >= 90) {
      return (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            HIGH-CONFIDENCE CANDIDATE ({confidenceScore}%)
          </span>
          <span className="text-[10px] text-emerald-400">Ready for confirmation</span>
        </div>
      );
    } else if (confidenceScore >= 70) {
      return (
        <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300 flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            NEEDS REVIEW ({confidenceScore}%)
          </span>
          <span className="text-[10px] text-amber-400">Officer verification required</span>
        </div>
      );
    }
    return (
      <div className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300 flex items-center justify-between font-mono">
        <span className="flex items-center gap-1.5">
          <XCircle className="h-4 w-4 text-rose-400" />
          UNRESOLVED — HUMAN REVIEW REQUIRED ({confidenceScore}%)
        </span>
        <span className="text-[10px] text-rose-400">Low confidence signal</span>
      </div>
    );
  };

  return (
    <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-4 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-cyan-400" />
          <h3 className="font-display font-semibold text-slate-100 text-sm">
            MATCH DECISION CONTROL PANEL
          </h3>
        </div>
        <Badge variant="outline" className="border-cyan-500/40 text-cyan-300 font-mono text-xs">
          Status: {currentStatus}
        </Badge>
      </div>

      {getThresholdBanner()}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
        <Button
          disabled={isSubmitting}
          onClick={() => onSubmitDecision("MATCHED")}
          className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
        >
          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
          CONFIRM MATCH
        </Button>

        <Button
          disabled={isSubmitting}
          variant="outline"
          onClick={() => onSubmitDecision("NEEDS REVIEW")}
          className="border-amber-500/40 text-amber-300 hover:bg-amber-950/30 text-xs"
        >
          <AlertTriangle className="mr-1 h-3.5 w-3.5" />
          NEEDS REVIEW
        </Button>

        <Button
          disabled={isSubmitting}
          variant="outline"
          onClick={() => onSubmitDecision("UNRESOLVED")}
          className="border-rose-500/40 text-rose-300 hover:bg-rose-950/30 text-xs"
        >
          <HelpCircle className="mr-1 h-3.5 w-3.5" />
          MARK UNRESOLVED
        </Button>

        <Button
          disabled={isSubmitting}
          variant="outline"
          onClick={() => onSubmitDecision("POSSIBLE DUPLICATE")}
          className="border-purple-500/40 text-purple-300 hover:bg-purple-950/30 text-xs"
        >
          <Copy className="mr-1 h-3.5 w-3.5" />
          POSSIBLE DUPLICATE
        </Button>

        <Button
          disabled={isSubmitting}
          variant="outline"
          onClick={() => onSubmitDecision("NO MATCH")}
          className="border-slate-800 text-slate-400 hover:bg-slate-900 text-xs"
        >
          <XCircle className="mr-1 h-3.5 w-3.5" />
          NO MATCH
        </Button>
      </div>
    </div>
  );
};
