/**
 * BHOO-MITRA AI — Source Agreement Matrix
 *
 * Comparative matrix evaluating multi-source alignment across:
 * - Spatial Boundary
 * - Reported Area
 * - Land Use
 * - Owner Reference
 * - Observation Date
 * - Data Quality Score
 */

import React from "react";
import { type SourceAgreementRow } from "@/lib/api/recommendations";
import { cn } from "@/lib/utils";
import { ExternalLink, Table } from "lucide-react";

interface SourceAgreementMatrixProps {
  rows: SourceAgreementRow[];
  onSelectEvidence?: (evidenceId: string) => void;
  className?: string;
}

export function SourceAgreementMatrix({
  rows,
  onSelectEvidence,
  className,
}: SourceAgreementMatrixProps) {
  const getStatusBadge = (
    status: string,
    evidenceId?: string
  ) => {
    if (status === "AGREES") {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-verified/15 px-1.5 py-0.5 text-[9px] font-bold text-verified border border-verified/30">
          ✓ AGREES
        </span>
      );
    }
    if (status === "DIFFERS") {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-conflict/15 px-1.5 py-0.5 text-[9px] font-bold text-conflict border border-conflict/30">
          ⚠ DIFFERS
        </span>
      );
    }
    if (status === "LOW_CONFIDENCE") {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-saffron/15 px-1.5 py-0.5 text-[9px] font-bold text-saffron border border-saffron/30">
          ⏱ STALE
        </span>
      );
    }
    return (
      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-muted-foreground">
        {status}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-surface/90 shadow-xl backdrop-blur-md overflow-hidden",
        className
      )}
    >
      <div className="border-b border-border/60 bg-slate-900/70 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Table className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-ivory">
            SOURCE AGREEMENT & DISCREPANCY MATRIX
          </h4>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">
          3 Authoritative Providers
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border/60 bg-slate-950/80 text-[10px] font-bold uppercase text-muted-foreground">
            <tr>
              <th className="px-3.5 py-2.5">Attribute / Aspect</th>
              <th className="px-3.5 py-2.5 text-cyan">Municipal GIS</th>
              <th className="px-3.5 py-2.5 text-saffron">Property Registry</th>
              <th className="px-3.5 py-2.5 text-emerald-400">Drone Survey</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                <td className="px-3.5 py-3 font-medium text-ivory">
                  {row.aspect}
                </td>

                {/* Municipal */}
                <td className="px-3.5 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[11px] text-foreground">
                      {row.municipal.value}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(row.municipal.status)}
                      {row.municipal.evidenceId && onSelectEvidence && (
                        <button
                          onClick={() => onSelectEvidence(row.municipal.evidenceId!)}
                          className="font-mono text-[9px] text-cyan hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>{row.municipal.evidenceId.replace("EVIDENCE-DEMO-", "EVID-")}</span>
                          <ExternalLink className="h-2 w-2" />
                        </button>
                      )}
                    </div>
                  </div>
                </td>

                {/* Registry */}
                <td className="px-3.5 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[11px] text-foreground">
                      {row.registry.value}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(row.registry.status)}
                      {row.registry.evidenceId && onSelectEvidence && (
                        <button
                          onClick={() => onSelectEvidence(row.registry.evidenceId!)}
                          className="font-mono text-[9px] text-saffron hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>{row.registry.evidenceId.replace("EVIDENCE-DEMO-", "EVID-")}</span>
                          <ExternalLink className="h-2 w-2" />
                        </button>
                      )}
                    </div>
                  </div>
                </td>

                {/* Survey */}
                <td className="px-3.5 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[11px] text-foreground">
                      {row.survey.value}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(row.survey.status)}
                      {row.survey.evidenceId && onSelectEvidence && (
                        <button
                          onClick={() => onSelectEvidence(row.survey.evidenceId!)}
                          className="font-mono text-[9px] text-emerald-400 hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>{row.survey.evidenceId.replace("EVIDENCE-DEMO-", "EVID-")}</span>
                          <ExternalLink className="h-2 w-2" />
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
