/**
 * BHOO-MITRA AI — AI Harmonization Recommendation Card
 *
 * Major prominent recommendation card featuring:
 * - Recommended Candidate title & source
 * - Confidence indicator (91% High)
 * - Status badge (AI SUGGESTION — HUMAN VERIFICATION REQUIRED)
 * - Supporting evidence badges (clickable)
 * - Unresolved items disclosure
 * - Action controls (Accept, Modify, Reject, Defer)
 */

import React, { useState } from "react";
import {
  type RecommendationCandidate,
  type RecommendationStatus,
} from "@/lib/api/recommendations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Edit3,
  XCircle,
  Clock,
  ExternalLink,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface RecommendationCardProps {
  candidate: RecommendationCandidate;
  onAccept: () => void;
  onModify: (notes: string) => void;
  onReject: (reason: string) => void;
  onDefer: () => void;
  onSelectEvidence: (evidenceId: string) => void;
  onViewOnMap?: () => void;
  className?: string;
}

export function RecommendationCard({
  candidate,
  onAccept,
  onModify,
  onReject,
  onDefer,
  onSelectEvidence,
  onViewOnMap,
  className,
}: RecommendationCardProps) {
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [modifyNotes, setModifyNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-primary/60 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300",
        className
      )}
    >
      {/* Top Background Glow Accent */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-cyan/10 blur-3xl pointer-events-none" />

      {/* Header Badge Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary shadow-sm ring-1 ring-primary/40">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
              AI Decision Support
            </span>
            <h3 className="font-display text-base font-bold text-ivory">
              HARMONIZATION RECOMMENDATION
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Confidence Badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-bold text-ivory shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Confidence: {candidate.confidence}% (High)</span>
          </div>

          {/* Governance Notice Badge */}
          <span className="rounded-full border border-saffron/40 bg-saffron/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-saffron">
            Human Verification Required
          </span>
        </div>
      </div>

      {/* Main Recommendation Content */}
      <div className="mt-4 space-y-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Recommended Candidate Representation
          </span>
          <p className="mt-0.5 text-lg font-bold text-cyan">
            {candidate.representationSource}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-ivory">
          {candidate.description}
        </p>

        {/* Proposed Geometry Metrics */}
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-border/50 bg-slate-950/60 p-3 sm:grid-cols-3">
          <div>
            <span className="text-[10px] text-muted-foreground">Proposed Area</span>
            <p className="font-mono text-sm font-bold text-ivory">
              {candidate.proposedAreaM2.toLocaleString()} m²
            </p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground">Perimeter</span>
            <p className="font-mono text-sm font-bold text-ivory">
              {candidate.proposedPerimeterM} m
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-end">
            {onViewOnMap && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewOnMap}
                className="h-7 border-cyan/40 bg-cyan/10 text-cyan hover:bg-cyan/20 text-xs font-semibold"
              >
                <Layers className="mr-1 h-3.5 w-3.5" /> View on Map
              </Button>
            )}
          </div>
        </div>

        {/* Supporting Evidence Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-muted-foreground font-medium">
            Supporting Evidence:
          </span>
          {candidate.supportingEvidenceIds.map((evId) => (
            <button
              key={evId}
              onClick={() => onSelectEvidence(evId)}
              className="inline-flex items-center gap-1 rounded-md border border-cyan/40 bg-cyan/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-cyan hover:bg-cyan/20 transition-colors"
            >
              <span>{evId.replace("EVIDENCE-DEMO-", "EVID-")}</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </button>
          ))}
        </div>

        {/* Unresolved Items Notice */}
        <div className="flex items-start gap-2 rounded-lg border border-saffron/30 bg-saffron/5 p-2.5 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 shrink-0 text-saffron mt-0.5" />
          <div>
            <strong className="text-saffron font-bold">Unresolved Item: </strong>
            <span>{candidate.unresolvedItems}</span>
          </div>
        </div>

        {/* Expandable Advantages & Conflicts */}
        <div>
          <button
            onClick={() => setDetailsExpanded(!detailsExpanded)}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <span>{detailsExpanded ? "Hide Candidate Tradeoffs" : "Show Candidate Tradeoffs & Advantages"}</span>
            {detailsExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {detailsExpanded && (
            <div className="mt-2 grid gap-2 sm:grid-cols-2 text-xs pt-1">
              <div className="rounded-lg border border-verified/30 bg-verified/5 p-2.5">
                <span className="font-bold text-verified uppercase text-[10px]">
                  ✓ Key Advantages
                </span>
                <ul className="mt-1 space-y-1 text-muted-foreground list-disc list-inside">
                  {candidate.advantages.map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-conflict/30 bg-conflict/5 p-2.5">
                <span className="font-bold text-conflict uppercase text-[10px]">
                  ⚠ Tradeoffs / Differences
                </span>
                <ul className="mt-1 space-y-1 text-muted-foreground list-disc list-inside">
                  {candidate.conflicts.map((cnf, idx) => (
                    <li key={idx}>{cnf}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Controls Toolbar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onAccept}
            className="bg-verified hover:bg-verified/90 text-slate-950 font-bold text-xs shadow-lg shadow-verified/20"
          >
            <FileCheck className="mr-1.5 h-4 w-4" />
            Accept Recommendation
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setModifyModalOpen(true)}
            className="border-primary/40 bg-slate-900 hover:bg-slate-800 text-ivory text-xs font-medium"
          >
            <Edit3 className="mr-1.5 h-3.5 w-3.5 text-primary" />
            Modify Draft
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRejectModalOpen(true)}
            className="border-conflict/40 bg-slate-900 hover:bg-conflict/10 text-conflict text-xs font-medium"
          >
            <XCircle className="mr-1.5 h-3.5 w-3.5" />
            Reject
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDefer}
            className="text-muted-foreground hover:text-ivory text-xs"
          >
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            Defer
          </Button>
        </div>
      </div>

      {/* Modify Modal */}
      {modifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-slate-900 p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-ivory">Modify Recommendation Draft</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Propose modifications to the candidate geometry or specify review notes.
            </p>
            <textarea
              value={modifyNotes}
              onChange={(e) => setModifyNotes(e.target.value)}
              placeholder="Enter modification notes or specify custom boundary conditions…"
              className="mt-3 h-28 w-full rounded-lg border border-border/60 bg-slate-950 p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setModifyModalOpen(false)}
                className="text-xs text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onModify(modifyNotes);
                  setModifyModalOpen(false);
                }}
                className="bg-primary text-ivory text-xs font-bold"
              >
                Save Modified Draft
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-conflict/40 bg-slate-900 p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-conflict">Reject Recommendation</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Please specify the audit reason for rejecting this candidate.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g., Requires physical site joint inspection before survey boundary can be adopted…"
              className="mt-3 h-28 w-full rounded-lg border border-border/60 bg-slate-950 p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-conflict focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectModalOpen(false)}
                className="text-xs text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onReject(rejectReason);
                  setRejectModalOpen(false);
                }}
                className="bg-conflict text-ivory text-xs font-bold"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
