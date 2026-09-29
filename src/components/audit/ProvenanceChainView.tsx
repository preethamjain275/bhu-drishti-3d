/**
 * BHOO-MITRA AI — Evidence Provenance Chain Component
 *
 * Visually displays the complete end-to-end lineage of a land record:
 * SOURCE → OBSERVATION → ENTITY → CONFLICT → EVIDENCE → RECOMMENDATION → HUMAN VERIFICATION → VERSION
 * All nodes are clickable to provide complete spatial traceability.
 */

import React, { useState, useEffect } from "react";
import { type ProvenanceNode, getAuditProvenance } from "@/lib/api/audit";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  Database,
  Eye,
  Layers,
  AlertTriangle,
  FileCheck,
  Zap,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const NODE_ICONS: Record<ProvenanceNode["type"], typeof Database> = {
  SOURCE: Database,
  OBSERVATION: Eye,
  ENTITY: Layers,
  CONFLICT: AlertTriangle,
  EVIDENCE: FileCheck,
  RECOMMENDATION: Zap,
  "HUMAN VERIFICATION": CheckCircle,
  VERSION: ShieldCheck,
};

const NODE_COLORS: Record<ProvenanceNode["type"], string> = {
  SOURCE: "border-cyan/40 bg-cyan/10 text-cyan",
  OBSERVATION: "border-primary/40 bg-primary/10 text-primary",
  ENTITY: "border-ivory/40 bg-ivory/10 text-ivory",
  CONFLICT: "border-conflict/40 bg-conflict/10 text-conflict",
  EVIDENCE: "border-saffron/40 bg-saffron/10 text-saffron",
  RECOMMENDATION: "border-purple-400/40 bg-purple-500/10 text-purple-300",
  "HUMAN VERIFICATION": "border-verified/40 bg-verified/10 text-verified",
  VERSION: "border-verified/60 bg-verified/15 text-verified",
};

export function ProvenanceChainView() {
  const [nodes, setNodes] = useState<ProvenanceNode[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const data = await getAuditProvenance("PARCEL-DEMO-014");
      setNodes(data);
    }
    load();
  }, []);

  return (
    <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-bold text-ivory">EVIDENCE PROVENANCE CHAIN</h3>
          <p className="text-xs text-muted-foreground">
            Complete end-to-end traceability graph for Canonical Entity PARCEL-DEMO-014.
          </p>
        </div>
        <span className="rounded bg-verified/15 px-2 py-0.5 font-mono text-[10px] font-bold text-verified border border-verified/30">
          TRACEABILITY VERIFIED
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-slim py-2">
        {nodes.map((node, idx) => {
          const Icon = NODE_ICONS[node.type];
          const style = NODE_COLORS[node.type];

          return (
            <React.Fragment key={node.id}>
              <button
                type="button"
                onClick={() => node.routePath && navigate({ to: node.routePath })}
                className={cn(
                  "group flex flex-col rounded-xl border p-3 text-left transition-all min-w-[150px] shrink-0 hover:scale-102 hover:shadow-lg",
                  style
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="label-technical text-[9px] opacity-80">{node.type}</span>
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                </div>
                <p className="mt-1 font-mono text-xs font-bold text-ivory line-clamp-1">{node.title}</p>
                {node.subtitle && <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">{node.subtitle}</p>}
                <div className="mt-2 flex items-center justify-between text-[9px] font-mono opacity-80 pt-1.5 border-t border-white/10">
                  <span>{node.status}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">🔗</span>
                </div>
              </button>
              {idx < nodes.length - 1 && (
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" aria-hidden />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
