/**
 * BHOO-MITRA AI — Create Corrective Audit Event Modal
 *
 * Implements append-only compliance logic: historical events are immutable,
 * so officers submit corrective events referencing original event IDs.
 */

import React, { useState } from "react";
import { type AuditEvent, createCorrectiveEvent } from "@/lib/api/audit";
import { X, PlusCircle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CorrectiveEventModalProps {
  targetEvent: AuditEvent | null;
  onClose: () => void;
  onCreated: (newEvent: AuditEvent) => void;
}

export function CorrectiveEventModal({ targetEvent, onClose, onCreated }: CorrectiveEventModalProps) {
  if (!targetEvent) return null;

  const [reason, setReason] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [reviewerNote, setReviewerNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !correctiveAction) return;

    setSubmitting(true);
    const newEv = await createCorrectiveEvent({
      targetEventId: targetEvent.id,
      reason,
      correctiveAction,
      reviewerNote,
    });
    setSubmitting(false);
    onCreated(newEv);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-popover shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-saffron" />
            <div>
              <h3 className="font-mono text-base font-bold text-ivory">CREATE CORRECTIVE EVENT</h3>
              <p className="text-xs text-muted-foreground">
                Append-only correction for {targetEvent.id} ({targetEvent.action})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:text-ivory">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="rounded-lg border border-saffron/30 bg-saffron/5 p-3 text-muted-foreground flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-saffron shrink-0 mt-0.5" />
            <p>
              Historical event <strong className="font-mono text-ivory">{targetEvent.id}</strong> will remain unchanged in the immutable store. This action creates a linked corrective event <strong className="font-mono text-saffron">CORRECTIVE_EVENT_CREATED</strong>.
            </p>
          </div>

          <div>
            <label className="label-technical block mb-1">Target Event Reference</label>
            <input
              disabled
              value={`${targetEvent.id} · ${targetEvent.action} · ${targetEvent.actorName}`}
              className="w-full rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-muted-foreground"
            />
          </div>

          <div>
            <label className="label-technical block mb-1 text-ivory">Reason for Correction *</label>
            <input
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Boundary vertex precision refined following secondary survey review…"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-ivory outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="label-technical block mb-1 text-ivory">Corrective Action Taken *</label>
            <input
              required
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
              placeholder="e.g., Updated vertex V-04 coordinates to GNSS SP-2291 reference…"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-ivory outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="label-technical block mb-1 text-muted-foreground">Officer Compliance Note (Optional)</label>
            <textarea
              rows={2}
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              placeholder="Official notes for compliance auditors…"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-ivory outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !reason || !correctiveAction}
              size="sm"
              className="bg-saffron text-background font-bold hover:bg-saffron/90"
            >
              {submitting ? "Appending Event…" : "Submit Corrective Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
