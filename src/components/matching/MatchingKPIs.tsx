import React from "react";
import { Database, GitMerge, CheckCircle2, AlertTriangle, HelpCircle, Copy, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MatchingKPIsProps {
  stats: {
    totalObservations: number;
    matchedEntities: number;
    highConfidenceMatches: number;
    mediumConfidenceMatches: number;
    unresolvedMatches: number;
    potentialDuplicates: number;
  };
}

export const MatchingKPIs: React.FC<MatchingKPIsProps> = ({ stats }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-cyan-300">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
          <strong>SYNTHETIC DEMO STATISTICS:</strong> Multi-source spatial entity resolution metrics.
        </span>
        <span className="text-slate-500">BhuSetu Candidate Matching Engine</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-3 shadow-md backdrop-blur">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-[10px] uppercase">Observations</span>
            <Database className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-1 font-display text-xl font-bold text-slate-100">{stats.totalObservations}</div>
          <div className="text-[10px] text-slate-500 font-mono">Incoming vectors</div>
        </div>

        <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-3 shadow-md backdrop-blur">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-[10px] uppercase">Matched Entities</span>
            <GitMerge className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-1 font-display text-xl font-bold text-emerald-300">{stats.matchedEntities}</div>
          <div className="text-[10px] text-emerald-400/80 font-mono">72.6% resolution rate</div>
        </div>

        <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-3 shadow-md backdrop-blur">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-[10px] uppercase">High Confidence</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-1 font-display text-xl font-bold text-emerald-400">{stats.highConfidenceMatches}</div>
          <div className="text-[10px] text-slate-500 font-mono">90%+ similarity signal</div>
        </div>

        <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-3 shadow-md backdrop-blur">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-[10px] uppercase">Medium Confidence</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-1 font-display text-xl font-bold text-amber-300">{stats.mediumConfidenceMatches}</div>
          <div className="text-[10px] text-slate-500 font-mono">70%–89% (Needs Review)</div>
        </div>

        <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-3 shadow-md backdrop-blur">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-[10px] uppercase">Unresolved</span>
            <HelpCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-1 font-display text-xl font-bold text-rose-400">{stats.unresolvedMatches}</div>
          <div className="text-[10px] text-slate-500 font-mono">&lt;70% (Human Review)</div>
        </div>

        <div className="panel-surface rounded-xl border border-slate-800 bg-slate-950/70 p-3 shadow-md backdrop-blur">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-mono text-[10px] uppercase">Duplicates</span>
            <Copy className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-1 font-display text-xl font-bold text-purple-300">{stats.potentialDuplicates}</div>
          <div className="text-[10px] text-slate-500 font-mono">Flagged candidates</div>
        </div>
      </div>
    </div>
  );
};
