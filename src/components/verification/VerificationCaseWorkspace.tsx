/**
 * BHOO-MITRA AI — Human Verification Case Workspace
 *
 * Full tripartite investigation screen:
 * LEFT: Case summary, AI confidence, step workflow, and audit timeline
 * CENTER: Interactive GIS MapLibre engine & candidate source boundary comparisons
 * RIGHT: Source Attribute Comparison Matrix, Evidence Review & Decision Action Panel
 */

import React, { useState } from "react";
import {
  type VerificationCase,
  type ReviewerInfo,
  CURRENT_REVIEWER,
  approveRecommendation,
  modifyCandidate,
  rejectRecommendation,
  deferCase,
  requestMoreEvidence,
} from "@/lib/api/verification";
import { VerificationMapEngine } from "@/components/verification/VerificationMapEngine";
import {
  VerificationDecisionModal,
  type DecisionType,
} from "@/components/verification/VerificationDecisionModal";
import { useNotifications } from "@/components/notifications/NotificationProvider";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Layers,
  FileText,
  Clock,
  CheckCircle2,
  Edit3,
  XCircle,
  HelpCircle,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  UserCheck,
  FileSearch,
  History,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationCaseWorkspaceProps {
  caseData: VerificationCase;
  onBackToQueue: () => void;
  onNextCase?: () => void;
  onSelectEvidence?: (evidenceId: string) => void;
  onViewHarmonization?: () => void;
  onViewEvidenceGraph?: (evidenceId?: string) => void;
}

const WORKFLOW_STEPS = [
  { step: 1, title: "Review Case" },
  { step: 2, title: "Inspect Evidence" },
  { step: 3, title: "Compare Sources" },
  { step: 4, title: "AI Recommendation" },
  { step: 5, title: "Human Decision" },
  { step: 6, title: "Audit Event" },
];

export const VerificationCaseWorkspace: React.FC<VerificationCaseWorkspaceProps> = ({
  caseData: initialCase,
  onBackToQueue,
  onNextCase,
  onViewHarmonization,
  onViewEvidenceGraph,
}) => {
  const [caseData, setCaseData] = useState<VerificationCase>(initialCase);
  const [activeStep, setActiveStep] = useState<number>(3);
  const [activeModal, setActiveModal] = useState<DecisionType>(null);
  const [activeTab, setActiveTab] = useState<"COMPARISON" | "EVIDENCE" | "HISTORY">("COMPARISON");
  const { push } = useNotifications();

  // Workflow Handlers
  const handleApprove = (note: string) => {
    const updated = approveRecommendation(caseData.id, note, CURRENT_REVIEWER);
    if (updated) {
      setCaseData(updated);
      setActiveStep(6);
      setActiveModal(null);
      push({
        title: "Harmonization Candidate Approved",
        body: `Verification case ${caseData.id} officially approved by authorized reviewer.`,
        category: "verification",
        priority: "normal",
      });
    }
  };

  const handleModify = (attributes: Record<string, string>, geomSource: string, note: string) => {
    const updated = modifyCandidate(caseData.id, attributes, geomSource, note, CURRENT_REVIEWER);
    if (updated) {
      setCaseData(updated);
      setActiveStep(6);
      setActiveModal(null);
      push({
        title: "Candidate Attributes Modified",
        body: `Harmonization overrides recorded for case ${caseData.id}.`,
        category: "verification",
        priority: "normal",
      });
    }
  };

  const handleReject = (reason: string, note: string) => {
    const updated = rejectRecommendation(caseData.id, reason, note, CURRENT_REVIEWER);
    if (updated) {
      setCaseData(updated);
      setActiveStep(6);
      setActiveModal(null);
      push({
        title: "Recommendation Rejected",
        body: `Case ${caseData.id} marked as rejected in audit log.`,
        category: "verification",
        priority: "normal",
      });
    }
  };

  const handleDefer = (reason: string, date: string, note: string) => {
    const updated = deferCase(caseData.id, reason, date, note, CURRENT_REVIEWER);
    if (updated) {
      setCaseData(updated);
      setActiveStep(6);
      setActiveModal(null);
      push({
        title: "Case Review Deferred",
        body: `Case ${caseData.id} postponed until ${date || "further review"}.`,
        category: "verification",
        priority: "normal",
      });
    }
  };

  const handleRequestEvidence = (types: string[], note: string) => {
    const updated = requestMoreEvidence(caseData.id, types, note, CURRENT_REVIEWER);
    if (updated) {
      setCaseData(updated);
      setActiveStep(6);
      setActiveModal(null);
      push({
        title: "Additional Evidence Requested",
        body: `Returned ${caseData.id} to Field/Registry queue for evidence collection.`,
        category: "verification",
        priority: "normal",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-card/90 backdrop-blur-md border border-border/80">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToQueue}
            className="flex items-center gap-1 text-xs border-border/80 text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Queue
          </Button>

          <div className="h-4 w-px bg-border" />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold text-foreground tracking-tight">
                Case {caseData.id}
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                {caseData.entityId}
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-[11px] font-mono font-semibold border",
                  caseData.status === "APPROVED"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : caseData.status === "MODIFIED"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                    : caseData.status === "REJECTED"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                    : caseData.status === "NEEDS_MORE_EVIDENCE"
                    ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                    : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                )}
              >
                {caseData.status}
              </span>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2">
          {onNextCase && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNextCase}
              className="text-xs border-border text-foreground hover:bg-muted"
            >
              Next Pending Case
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="px-3.5 py-2 rounded-lg bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>HUMAN-IN-THE-LOOP MANDATE:</strong> AI provides assistive candidate synthesis. All statutory property modifications require explicit authorized human verification. Original source records remain unmutated.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px] text-cyan-300/80">
          <Lock className="w-3 h-3 text-emerald-400" />
          Immutable Audit Active
        </div>
      </div>

      {/* Workflow Steps Progress Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 p-2 rounded-xl bg-card/60 border border-border/70">
        {WORKFLOW_STEPS.map((s) => {
          const isDone = activeStep > s.step;
          const isCurrent = activeStep === s.step;
          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-all border",
                isCurrent
                  ? "bg-primary/10 border-primary text-primary font-semibold shadow-sm"
                  : isDone
                  ? "bg-muted/40 border-border/50 text-foreground"
                  : "bg-muted/20 border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono",
                  isCurrent
                    ? "bg-primary text-primary-foreground font-bold"
                    : isDone
                    ? "bg-emerald-500/20 text-emerald-300 font-bold"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? "✓" : s.step}
              </div>
              <span className="truncate">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Tripartite Investigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* =================================================================== */}
        {/* LEFT COLUMN: Case Summary + AI Recommendation Card (3 Cols)        */}
        {/* =================================================================== */}
        <div className="lg:col-span-3 space-y-4">
          {/* Summary Panel */}
          <div className="p-4 rounded-xl bg-card border border-border/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Case Summary
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">{caseData.propertyId}</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-muted-foreground">Identified Conflict:</span>
                <p className="font-semibold text-rose-300 mt-0.5">{caseData.conflictType}</p>
              </div>

              <div>
                <span className="text-muted-foreground">Selected Candidate Representation:</span>
                <p className="font-medium text-emerald-300 mt-0.5">{caseData.aiRecommendationTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                <div>
                  <span className="text-muted-foreground text-[11px]">AI Confidence</span>
                  <p className="font-mono text-base font-bold text-foreground">{caseData.confidence}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px]">Evidence Strength</span>
                  <p className="font-mono text-base font-bold text-emerald-400">{caseData.evidenceStrength}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40 text-[11px]">
                <div>
                  <span className="text-muted-foreground">Sources Analyzed</span>
                  <p className="font-semibold text-foreground">{caseData.sourceCount} Repositories</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Unresolved Items</span>
                  <p className={cn("font-semibold", caseData.unresolvedCount > 0 ? "text-amber-300" : "text-emerald-400")}>
                    {caseData.unresolvedCount} Issue
                  </p>
                </div>
              </div>
            </div>

            {/* AI Warning Box */}
            <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-200 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-purple-300">
                <Sparkles className="w-3.5 h-3.5" />
                AI Suggestion Engine
              </div>
              <p className="text-purple-300/80 leading-relaxed">
                Deterministic synthesis grounded on Drone RTK survey & registered conveyance deed #8829/B.
              </p>
              {onViewHarmonization && (
                <button
                  onClick={onViewHarmonization}
                  className="pt-1 flex items-center gap-1 text-[11px] font-medium text-purple-400 hover:text-purple-300 underline"
                >
                  Inspect Full Reasoning Chain <ExternalLink className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            {/* Reviewer Badge */}
            <div className="pt-2 border-t border-border/60">
              <div className="flex items-center gap-2 text-xs">
                <UserCheck className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-[11px] text-muted-foreground">Authorized Reviewer</p>
                  <p className="font-semibold text-foreground text-xs">{caseData.assignedReviewer.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chronological Audit Timeline */}
          <div className="p-4 rounded-xl bg-card border border-border/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                Verification Timeline
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">v{caseData.history.length} Events</span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {caseData.history.map((ev, idx) => (
                <div key={ev.id || idx} className="relative pl-4 text-xs space-y-0.5">
                  <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground text-[11px]">{ev.stage}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">{ev.timestamp.split(" ")[1] || ev.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* CENTER COLUMN: Interactive GIS Map & Candidate Comparison (5 Cols)  */}
        {/* =================================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="h-[520px] rounded-xl overflow-hidden border border-border/80 bg-card">
            <VerificationMapEngine
              currentCase={caseData}
              onSelectEvidence={(evId) => {
                if (onViewEvidenceGraph) onViewEvidenceGraph(evId);
              }}
            />
          </div>

          {/* Quick GIS Guidance Legend */}
          <div className="p-3 rounded-xl bg-card border border-border/80 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-cyan-400/80 border border-cyan-400" />
              <span className="text-muted-foreground">Municipal Cadastre (1998)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-amber-400/80 border border-amber-400" />
              <span className="text-muted-foreground">Revenue Deed Bounds</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-emerald-400/80 border border-emerald-400" />
              <span className="text-muted-foreground">RTK Survey 2026 (Candidate)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-rose-500/80 border border-rose-500" />
              <span className="text-muted-foreground">Overlap / Sliver Anomaly</span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: Attribute Matrix & Decision Action Command (4 Cols)   */}
        {/* =================================================================== */}
        <div className="lg:col-span-4 space-y-4">
          {/* Decision Command Header Panel */}
          <div className="p-4 rounded-xl bg-card border border-primary/40 shadow-lg space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-sm text-foreground">
                  Human Verification Decision
                </h3>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">Arbitration Panel</span>
            </div>

            {/* Decision Status Breakdown */}
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Recommendation Confidence:</span>
                <span className="font-mono font-bold text-emerald-400">{caseData.confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Human Verification Status:</span>
                <span className="font-mono font-bold text-primary">
                  {caseData.status === "APPROVED"
                    ? "APPROVED BY AUTHORIZED REVIEWER"
                    : caseData.status === "MODIFIED"
                    ? "MODIFIED BY HUMAN REVIEWER"
                    : caseData.status === "REJECTED"
                    ? "REJECTED"
                    : "PENDING AUTHORIZED ACTION"}
                </span>
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => setActiveModal("APPROVE")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs h-9 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </Button>

              <Button
                onClick={() => setActiveModal("MODIFY")}
                variant="outline"
                className="border-blue-500/50 hover:bg-blue-500/10 text-blue-300 font-medium text-xs h-9 flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" />
                Modify
              </Button>

              <Button
                onClick={() => setActiveModal("REJECT")}
                variant="outline"
                className="border-rose-500/50 hover:bg-rose-500/10 text-rose-300 font-medium text-xs h-9 flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>

              <Button
                onClick={() => setActiveModal("DEFER")}
                variant="outline"
                className="border-amber-500/50 hover:bg-amber-500/10 text-amber-300 font-medium text-xs h-9 flex items-center justify-center gap-1.5"
              >
                <Clock className="w-4 h-4" />
                Defer
              </Button>
            </div>

            <Button
              onClick={() => setActiveModal("REQUEST_MORE_EVIDENCE")}
              variant="outline"
              className="w-full border-purple-500/50 hover:bg-purple-500/10 text-purple-300 font-medium text-xs h-8 flex items-center justify-center gap-1.5"
            >
              <FileSearch className="w-3.5 h-3.5" />
              Request Additional Evidence
            </Button>
          </div>

          {/* Tabs: Comparison Matrix / Supporting Evidence */}
          <div className="p-4 rounded-xl bg-card border border-border/80 space-y-3">
            <div className="flex items-center gap-2 border-b border-border/60 pb-2">
              <button
                onClick={() => setActiveTab("COMPARISON")}
                className={cn(
                  "text-xs font-semibold pb-1 transition-all border-b-2",
                  activeTab === "COMPARISON"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Source Comparison
              </button>
              <button
                onClick={() => setActiveTab("EVIDENCE")}
                className={cn(
                  "text-xs font-semibold pb-1 transition-all border-b-2",
                  activeTab === "EVIDENCE"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                Evidence ({caseData.evidenceIds.length})
              </button>
            </div>

            {/* Content: Attribute Comparison Matrix */}
            {activeTab === "COMPARISON" && (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {caseData.attributeMatrix.map((row) => (
                  <div key={row.attributeName} className="p-2.5 rounded-lg bg-muted/30 border border-border/60 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">{row.attributeName}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{row.evidenceId}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-[11px] pt-1">
                      <div className="p-1 rounded bg-muted/40 border border-border/40">
                        <span className="text-[9px] text-muted-foreground block">Municipal GIS</span>
                        <span className="text-foreground truncate block">{row.municipalGis}</span>
                      </div>
                      <div className="p-1 rounded bg-muted/40 border border-border/40">
                        <span className="text-[9px] text-muted-foreground block">Property Registry</span>
                        <span className="text-foreground truncate block">{row.propertyRegistry}</span>
                      </div>
                      <div className="p-1 rounded bg-emerald-500/10 border border-emerald-500/30">
                        <span className="text-[9px] text-emerald-400 block">Candidate (Survey)</span>
                        <span className="text-emerald-300 font-medium truncate block">
                          {row.isModified ? row.reviewerValue : row.recommendedCandidate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Content: Supporting Evidence List */}
            {activeTab === "EVIDENCE" && (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {caseData.evidenceIds.map((evId) => (
                  <div key={evId} className="p-2.5 rounded-lg bg-muted/30 border border-border/60 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-semibold text-purple-300">{evId}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300">
                        SURVEY OBSERVATION
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      UAV RTK Photogrammetric capture with ±2.4 cm ground horizontal accuracy.
                    </p>
                    <div className="pt-1 flex justify-between items-center text-[10px]">
                      <span className="text-muted-foreground">Provenance: Ingestion SHA-256 Validated</span>
                      {onViewEvidenceGraph && (
                        <button
                          onClick={() => onViewEvidenceGraph(evId)}
                          className="text-primary hover:underline flex items-center gap-0.5"
                        >
                          Open in Graph <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decision Modal Container */}
      {activeModal && (
        <VerificationDecisionModal
          decisionType={activeModal}
          caseData={caseData}
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          onConfirmApprove={handleApprove}
          onConfirmModify={handleModify}
          onConfirmReject={handleReject}
          onConfirmDefer={handleDefer}
          onConfirmRequestEvidence={handleRequestEvidence}
        />
      )}
    </div>
  );
};
