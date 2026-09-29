/**
 * BHOO-MITRA AI — Governance & Audit Integrity Panel
 *
 * Displays audit integrity verification status, append-only immutability details,
 * and standard compliance traceability checklists.
 */

import React from "react";
import { ShieldCheck, Info, CheckCircle2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function GovernancePanel() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Audit Integrity Banner */}
      <div className="rounded-xl border border-verified/40 bg-verified/5 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-verified" />
            <div>
              <span className="label-technical text-verified">SYSTEM INTEGRITY</span>
              <h3 className="font-mono text-base font-bold text-ivory">AUDIT INTEGRITY: INTACT</h3>
            </div>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-ivory" aria-label="Audit Integrity Information">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs bg-slate-900 border border-border text-ivory p-2 rounded shadow-xl">
                All displayed demo audit events are represented as append-only records in the application model.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2 border-t border-verified/20">
          <div>
            <span className="text-muted-foreground text-[10px] block">Events Verified</span>
            <span className="text-ivory font-bold">1,248 / 1,248</span>
          </div>
          <div>
            <span className="text-muted-foreground text-[10px] block">Integrity Status</span>
            <span className="text-verified font-bold">INTACT (DEMO VERIFIED)</span>
          </div>
        </div>
      </div>

      {/* Traceability Status Checklist */}
      <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-ivory">TRACEABILITY STATUS</h3>
          <span className="label-technical text-cyan">COMPLIANCE COMPONENT</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          {[
            "Source Provenance",
            "Evidence References",
            "Recommendation History",
            "Human Verification",
            "Version History",
            "Audit Events",
          ].map((item) => (
            <div key={item} className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">{item}</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-verified" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
