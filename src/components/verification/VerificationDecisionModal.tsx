/**
 * BHOO-MITRA AI — Human Verification Decision Modals & Panels
 *
 * Provides workflows for:
 * 1. APPROVE Candidate (Confirmation dialog + decision note + audit confirmation)
 * 2. MODIFY Candidate (Field-by-field candidate override workspace with clear source distinction)
 * 3. REJECT Recommendation (Structured reason requirement + note)
 * 4. DEFER Case (Postpone with follow-up date and reasoning)
 * 5. REQUEST MORE EVIDENCE (Select missing evidence requirements: Survey, Deeds, DGPS, etc.)
 */

import React, { useState } from "react";
import { type VerificationCase, type ReviewerInfo, CURRENT_REVIEWER } from "@/lib/api/verification";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Edit3,
  XCircle,
  Clock,
  HelpCircle,
  ShieldAlert,
  AlertTriangle,
  FileSearch,
  Sparkles,
  Info,
} from "lucide-react";

export type DecisionType = "APPROVE" | "MODIFY" | "REJECT" | "DEFER" | "REQUEST_MORE_EVIDENCE" | null;

interface VerificationDecisionModalProps {
  decisionType: DecisionType;
  caseData: VerificationCase;
  isOpen: boolean;
  onClose: () => void;
  onConfirmApprove: (decisionNote: string) => void;
  onConfirmModify: (modifiedAttributes: Record<string, string>, modifiedGeometrySource: string, decisionNote: string) => void;
  onConfirmReject: (reason: string, decisionNote: string) => void;
  onConfirmDefer: (reason: string, followUpDate: string, decisionNote: string) => void;
  onConfirmRequestEvidence: (evidenceTypes: string[], decisionNote: string) => void;
}

const REJECTION_REASONS = [
  "Insufficient supporting ground evidence",
  "Incorrect AI recommendation model output",
  "Source reliability & provenance concern",
  "Geometry overlap/sliver mismatch unresolved",
  "Temporal inconsistency in deed chronologies",
  "Conflicting statutory title classification",
  "Other statutory administrative ground",
];

const DEFER_REASONS = [
  "Pending physical joint field inspection",
  "Awaiting municipal town planning gazette notification",
  "High Court / Revenue Tribunal stay order active",
  "Sub-registrar certified deed copies under verification",
  "Other administrative postponement",
];

const EVIDENCE_TYPES_OPTIONS = [
  { id: "DGPS_SURVEY", label: "DGPS Ground Survey with RTK Ground-Control Points" },
  { id: "ORIGINAL_DEED", label: "Sub-Registrar Certified Deed Index & Metes-Bounds" },
  { id: "TOWN_PLANNING", label: "Town Planning Master Plan & Road Widening Alignment" },
  { id: "ENCROACHMENT_REP", label: "Field Revenue Inspector Encroachment Demarcation Report" },
  { id: "MUTATION_RECORD", label: "Historical 30-Year Mutation Extract (Jamabandi/RoR)" },
  { id: "HISTORICAL_SATELLITE", label: "Multi-temporal High-Resolution Satellite Orthophoto" },
];

export const VerificationDecisionModal: React.FC<VerificationDecisionModalProps> = ({
  decisionType,
  caseData,
  isOpen,
  onClose,
  onConfirmApprove,
  onConfirmModify,
  onConfirmReject,
  onConfirmDefer,
  onConfirmRequestEvidence,
}) => {
  // Decision Form States
  const [decisionNote, setDecisionNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState(REJECTION_REASONS[0] || "Insufficient supporting ground evidence");
  const [deferReason, setDeferReason] = useState(DEFER_REASONS[0] || "Pending physical joint field inspection");
  const [deferDate, setDeferDate] = useState("2026-04-15");
  const [selectedEvidenceTypes, setSelectedEvidenceTypes] = useState<string[]>([
    EVIDENCE_TYPES_OPTIONS[0]?.id || "DGPS_SURVEY",
  ]);

  // Modification Form States
  const [modifiedGeometrySource, setModifiedGeometrySource] = useState(caseData.recommendedCandidateSource);
  const [attributeEdits, setAttributeEdits] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    caseData.attributeMatrix.forEach((attr) => {
      initial[attr.attributeName] = attr.recommendedCandidate;
    });
    return initial;
  });

  const toggleEvidenceType = (id: string) => {
    if (selectedEvidenceTypes.includes(id)) {
      setSelectedEvidenceTypes(selectedEvidenceTypes.filter((t) => t !== id));
    } else {
      setSelectedEvidenceTypes([...selectedEvidenceTypes, id]);
    }
  };

  const handleAttributeChange = (attrName: string, val: string) => {
    setAttributeEdits((prev) => ({ ...prev, [attrName]: val }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl border border-border text-foreground shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* =================================================================== */}
        {/* 1. APPROVE MODAL                                                    */}
        {/* =================================================================== */}
        {decisionType === "APPROVE" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <DialogTitle className="text-lg font-display text-emerald-400">
                  Approve Candidate Harmonization Result
                </DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground text-xs pt-1">
                You are about to approve this candidate harmonization result. This action will record an official
                human verification decision in the audit trail.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              {/* Summary Card */}
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Entity ID:</span>
                    <p className="font-mono font-semibold text-foreground">{caseData.entityId}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Parcel / Property ID:</span>
                    <p className="font-mono font-semibold text-foreground">{caseData.propertyId}</p>
                  </div>
                </div>

                <div className="border-t border-border/40 pt-2">
                  <span className="text-muted-foreground">Selected Recommendation:</span>
                  <p className="font-medium text-emerald-300">{caseData.aiRecommendationTitle}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-2">
                  <div>
                    <span className="text-muted-foreground">Supporting Evidence IDs:</span>
                    <p className="font-mono text-muted-foreground">{caseData.evidenceIds.join(", ")}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">AI Confidence:</span>
                    <p className="font-semibold text-foreground">{caseData.confidence}% (Evidence: {caseData.evidenceStrength})</p>
                  </div>
                </div>
              </div>

              {/* Unresolved items warning */}
              {caseData.unresolvedCount > 0 && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex gap-2 items-start">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-semibold">Attention: Unresolved Notice</span>
                    <p className="text-[11px] mt-0.5 text-amber-300/90">{caseData.unresolvedItems[0]}</p>
                  </div>
                </div>
              )}

              {/* Decision Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Official Verification & Approval Note <span className="text-emerald-400 font-normal">(Required)</span>
                </label>
                <textarea
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="State statutory basis or confirmation details (e.g., 'Ground verified via 2026 RTK survey and conveyance deed #8829/B')."
                  className="w-full h-20 p-2.5 rounded-lg bg-background/80 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Reviewer Stamp */}
              <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] flex justify-between items-center text-muted-foreground">
                <span>Authorized Reviewer: <strong className="text-foreground">{CURRENT_REVIEWER.name}</strong></span>
                <span className="font-mono">{CURRENT_REVIEWER.badgeNumber}</span>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                onClick={() => onConfirmApprove(decisionNote || "Approved candidate based on high-confidence RTK survey evidence.")}
              >
                Confirm Official Approval
              </Button>
            </DialogFooter>
          </>
        )}

        {/* =================================================================== */}
        {/* 2. MODIFY MODAL                                                     */}
        {/* =================================================================== */}
        {decisionType === "MODIFY" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-blue-400">
                <Edit3 className="w-5 h-5" />
                <DialogTitle className="text-lg font-display text-blue-400">
                  Modify Candidate Values Before Approval
                </DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground text-xs pt-1">
                Customize candidate attribute values or spatial representations. Original source values are immutable and will remain preserved.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              {/* Geometry Source Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Harmonized Spatial Geometry Representation
                </label>
                <select
                  value={modifiedGeometrySource}
                  onChange={(e) => setModifiedGeometrySource(e.target.value)}
                  className="w-full p-2 rounded-lg bg-background/80 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Drone Survey High-Res 2026">Drone Survey High-Res 2026 (Recommended RTK Boundary)</option>
                  <option value="Municipal GIS Vector 1998">Municipal GIS Vector Boundary (Original)</option>
                  <option value="Revenue Property Registry Deed">Revenue Property Registry Deed Boundary</option>
                  <option value="Manual Boundary Compromise Interpolation">Manual Adjusted Median Boundary</option>
                </select>
              </div>

              {/* Attribute Modifications */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Attribute Overrides (Original vs Reviewer Proposed)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {caseData.attributeMatrix.map((attr) => (
                    <div key={attr.attributeName} className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs space-y-1">
                      <div className="flex justify-between font-medium text-foreground">
                        <span>{attr.attributeName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">Evidence: {attr.evidenceId}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-[10px] text-muted-foreground">Original Source Value:</span>
                          <p className="text-[11px] text-muted-foreground truncate">{attr.propertyRegistry || attr.municipalGis}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-blue-300 font-medium">Reviewer Modified Value:</span>
                          <input
                            type="text"
                            value={attributeEdits[attr.attributeName] || ""}
                            onChange={(e) => handleAttributeChange(attr.attributeName, e.target.value)}
                            className="w-full p-1 rounded bg-background border border-blue-500/40 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Modification Rationale & Statutory Note <span className="text-blue-400 font-normal">(Required)</span>
                </label>
                <textarea
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="Explain why adjustments were made to the AI proposal..."
                  className="w-full h-16 p-2.5 rounded-lg bg-background/80 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium"
                onClick={() => onConfirmModify(attributeEdits, modifiedGeometrySource, decisionNote || "Modified attributes to align with field records.")}
              >
                Save & Apply Modification
              </Button>
            </DialogFooter>
          </>
        )}

        {/* =================================================================== */}
        {/* 3. REJECT MODAL                                                     */}
        {/* =================================================================== */}
        {decisionType === "REJECT" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-rose-400">
                <XCircle className="w-5 h-5" />
                <DialogTitle className="text-lg font-display text-rose-400">
                  Reject Candidate Harmonization
                </DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground text-xs pt-1">
                Rejecting this candidate marks the proposal invalid. A structured statutory reason is required for the audit record.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Statutory Rejection Reason</label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2 rounded-lg bg-background/80 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  {REJECTION_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Detailed Rejection Note
                </label>
                <textarea
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="Provide specific findings or legal references explaining the rejection..."
                  className="w-full h-20 p-2.5 rounded-lg bg-background/80 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-rose-600 hover:bg-rose-500 text-white font-medium"
                onClick={() => onConfirmReject(rejectionReason || "Insufficient supporting ground evidence", decisionNote || "Proposal rejected due to insufficient statutory grounding.")}
              >
                Confirm Rejection
              </Button>
            </DialogFooter>
          </>
        )}

        {/* =================================================================== */}
        {/* 4. DEFER MODAL                                                      */}
        {/* =================================================================== */}
        {decisionType === "DEFER" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-amber-400">
                <Clock className="w-5 h-5" />
                <DialogTitle className="text-lg font-display text-amber-400">
                  Defer Verification Case
                </DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground text-xs pt-1">
                Postpone human verification until scheduled event, joint field inspection, or court report submission.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Deferral Ground / Reason</label>
                <select
                  value={deferReason}
                  onChange={(e) => setDeferReason(e.target.value)}
                  className="w-full p-2 rounded-lg bg-background/80 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {DEFER_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Follow-Up Review Date</label>
                <input
                  type="date"
                  value={deferDate}
                  onChange={(e) => setDeferDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-background/80 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Reviewer Note</label>
                <textarea
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="E.g., Waiting for joint survey committee report from Sub-Divisional Officer."
                  className="w-full h-16 p-2.5 rounded-lg bg-background/80 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-500 text-white font-medium"
                onClick={() => onConfirmDefer(deferReason || "Pending physical joint field inspection", deferDate, decisionNote || "Deferred pending field inspection.")}
              >
                Defer Case
              </Button>
            </DialogFooter>
          </>
        )}

        {/* =================================================================== */}
        {/* 5. REQUEST MORE EVIDENCE MODAL                                      */}
        {/* =================================================================== */}
        {decisionType === "REQUEST_MORE_EVIDENCE" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-purple-400">
                <FileSearch className="w-5 h-5" />
                <DialogTitle className="text-lg font-display text-purple-400">
                  Request Additional Evidence
                </DialogTitle>
              </div>
              <DialogDescription className="text-muted-foreground text-xs pt-1">
                Specify what mandatory documents, surveys, or telemetry data are missing before verification can proceed.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Missing Evidence Requirements
                </label>
                <div className="space-y-1.5">
                  {EVIDENCE_TYPES_OPTIONS.map((item) => (
                    <label
                      key={item.id}
                      className={cn(
                        "flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition",
                        selectedEvidenceTypes.includes(item.id)
                          ? "bg-purple-500/10 border-purple-500/50 text-purple-200"
                          : "bg-muted/30 border-border/60 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEvidenceTypes.includes(item.id)}
                        onChange={() => toggleEvidenceType(item.id)}
                        className="rounded border-border text-purple-600 focus:ring-purple-500"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Field Investigation Instructions & Requirements
                </label>
                <textarea
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="Detail exact instructions for the field surveyor or sub-registrar..."
                  className="w-full h-20 p-2.5 rounded-lg bg-background/80 border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-500 text-white font-medium"
                onClick={() => onConfirmRequestEvidence(selectedEvidenceTypes, decisionNote || "Missing DGPS verification and deed extract.")}
              >
                Submit Evidence Request
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
