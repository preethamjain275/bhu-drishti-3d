import React from "react";
import { Activity, CheckCircle2, Clock, AlertTriangle, RefreshCw, Layers } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { IngestionJob } from "@/lib/api/sources";

interface IngestionStatusCenterProps {
  jobs: IngestionJob[];
  onRefresh?: () => void;
}

export const IngestionStatusCenter: React.FC<IngestionStatusCenterProps> = ({ jobs, onRefresh }) => {
  return (
    <div className="panel-surface rounded-xl border border-cyan-500/20 bg-slate-950/60 p-4 backdrop-blur shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
          <h3 className="font-display font-semibold text-slate-100 text-sm tracking-wide">
            INGESTION ACTIVITY CENTER
          </h3>
          <Badge variant="outline" className="border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-[11px] font-mono">
            {jobs.length} Active Pipelines
          </Badge>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Sync Status</span>
          </button>
        )}
      </div>

      <div className="mt-3 space-y-3">
        {jobs.map((job) => {
          const isComplete = job.stage === "READY" || job.progressPercent === 100;
          const isFailed = job.stage === "FAILED";

          return (
            <div
              key={job.id}
              className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3 transition-colors hover:border-cyan-500/30"
            >
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <div className="flex items-center gap-2">
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : isFailed ? (
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-400 animate-spin shrink-0" />
                  )}
                  <span className="font-semibold text-slate-200 truncate">{job.sourceName}</span>
                  <span className="font-mono text-[10px] text-slate-500">({job.filename})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase tracking-wider font-mono ${
                      isComplete
                        ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                        : isFailed
                        ? "border-rose-500/40 bg-rose-950/30 text-rose-300"
                        : "border-amber-500/40 bg-amber-950/30 text-amber-300"
                    }`}
                  >
                    {job.stage}
                  </Badge>
                  <span className="font-mono text-xs font-bold text-cyan-400 min-w-[36px] text-right">
                    {job.progressPercent}%
                  </span>
                </div>
              </div>

              <Progress value={job.progressPercent} className="h-2 bg-slate-800" />

              <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{job.statusText}</span>
                <span className="text-slate-500">{job.format}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
