/**
 * BHOO-MITRA AI — Audit Report Export Modal
 *
 * Generates and displays a structured compliance export object containing
 * canonical entity records, complete append-only audit trail, version history, and evidence references.
 */

import React, { useState } from "react";
import { type AuditEvent, type EntityVersion } from "@/lib/api/audit";
import { X, Download, Copy, Check, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { download } from "@/lib/export";

interface AuditExportModalProps {
  events: AuditEvent[];
  versions: EntityVersion[];
  onClose: () => void;
}

export function AuditExportModal({ events, versions, onClose }: AuditExportModalProps) {
  const [copied, setCopied] = useState(false);

  const exportPayload = {
    system: "BHOO-MITRA AI — Land Intelligence Platform",
    exportTimestamp: new Date().toISOString(),
    complianceStandard: "ISO/TC 211 Spatial Provenance & Audit Standard",
    entity: {
      canonicalId: "PARCEL-DEMO-014",
      parcelId: "P-10482",
      surveyNumber: "Khasra 482/1",
      jurisdiction: "Delhi Ward 18 Revenue Division",
      status: "VERIFIED_CANONICAL",
    },
    integrityStatus: "INTACT",
    verifiedEventCount: events.length,
    versionCount: versions.length,
    auditEvents: events,
    versionHistory: versions,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    download("bhusetu-audit-report-demo.json", jsonString, "application/json");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-popover shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-mono text-base font-bold text-ivory">EXPORT AUDIT REPORT</h3>
              <p className="text-xs text-muted-foreground">Structured compliance JSON payload ready for external audit archives</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:text-ivory">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-xl border border-border bg-background p-3">
          <pre className="font-mono text-[11px] text-ivory/90 max-h-[360px] overflow-y-auto scrollbar-slim whitespace-pre-wrap">
            {jsonString}
          </pre>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="font-mono text-xs text-muted-foreground">
            {events.length} Events · {versions.length} Versions Sealed
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5 text-xs">
              {copied ? <Check className="h-3.5 w-3.5 text-verified" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied JSON" : "Copy Payload"}
            </Button>
            <Button size="sm" onClick={handleDownload} className="gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />
              Download JSON Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
