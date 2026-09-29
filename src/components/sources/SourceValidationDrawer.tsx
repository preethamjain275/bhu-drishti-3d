import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, XCircle, ShieldAlert, FileText, Flag } from "lucide-react";
import type { DataSource, ValidationResult } from "@/lib/api/sources";
import { recordAuditEvent } from "@/lib/api/audit";

interface SourceValidationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: DataSource | null;
  onMarkedForReview?: () => void;
}

export const SourceValidationDrawer: React.FC<SourceValidationDrawerProps> = ({
  open,
  onOpenChange,
  source,
  onMarkedForReview,
}) => {
  if (!source) return null;

  const { validation } = source;

  const handleMarkForReview = async () => {
    await recordAuditEvent({
      actorId: "USR-OFFICER-01",
      actorName: "Rajesh Kumar",
      actorRole: "Senior Revenue Officer",
      action: "SOURCE_MARKED_FOR_REVIEW",
      module: "Sources",
      sourceId: source.id,
      reason: `Flagged source ${source.name} for quality and schema review by GIS lead.`,
      metadata: { warningsCount: validation.warnings.length, errorsCount: validation.errors.length },
    });

    if (onMarkedForReview) onMarkedForReview();
    onOpenChange(false);
  };

  const getStatusBadge = (status: "PASS" | "FAIL" | "WARNING") => {
    if (status === "PASS") {
      return (
        <Badge variant="outline" className="border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-mono text-[10px]">
          <CheckCircle2 className="mr-1 h-3 w-3" /> PASS
        </Badge>
      );
    } else if (status === "WARNING") {
      return (
        <Badge variant="outline" className="border-amber-500/40 bg-amber-950/30 text-amber-300 font-mono text-[10px]">
          <AlertTriangle className="mr-1 h-3 w-3" /> WARNING
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-rose-500/40 bg-rose-950/30 text-rose-300 font-mono text-[10px]">
        <XCircle className="mr-1 h-3 w-3" /> FAIL
      </Badge>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[480px] sm:w-[540px] border-amber-500/30 bg-slate-950 text-slate-100 backdrop-blur-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-950/80 text-amber-400 border border-amber-500/40">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="font-display text-lg text-slate-100">
                VALIDATION & ERROR INSPECTOR
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-400">
                Automated geometric, CRS, and attribute validation diagnostics for {source.name}.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="my-4 space-y-4">
          <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-xs text-amber-300 flex items-center justify-between">
            <span className="font-mono">DEMO VALIDATION DIAGNOSTICS</span>
            <span className="font-mono font-bold">{source.id}</span>
          </div>

          {/* Validation Summary */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider">
              VALIDATION SUMMARY MATRIX
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Geometry Validity:</span>
                {getStatusBadge(validation.summary.geometry)}
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">CRS Detection:</span>
                {getStatusBadge(validation.summary.crs)}
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Schema Conformance:</span>
                {getStatusBadge(validation.summary.schema)}
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Duplicate Check:</span>
                {getStatusBadge(validation.summary.duplicates)}
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Required Fields:</span>
                {getStatusBadge(validation.summary.requiredFields)}
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400">Missing Attributes:</span>
                {getStatusBadge(validation.summary.missingAttributes)}
              </div>
            </div>
          </div>

          {/* Detected Issues List */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider">
              DETAILED DIAGNOSTIC MESSAGES
            </h4>

            {validation.warnings.map((w, i) => (
              <div
                key={i}
                className="rounded-lg border border-amber-500/30 bg-amber-950/30 p-3 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between font-mono text-amber-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    {w.code}
                  </span>
                  <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[9px]">
                    SEVERITY: {w.severity}
                  </Badge>
                </div>
                <p className="text-slate-300">{w.message}</p>
              </div>
            ))}

            {/* Standard Demo Errors if any */}
            {source.status === "WARNING" || source.status === "ERROR" ? (
              <div className="space-y-2">
                <div className="rounded-lg border border-rose-500/30 bg-rose-950/30 p-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono text-rose-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <XCircle className="h-4 w-4 text-rose-400" />
                      GEOM_SELF_INTERSECT
                    </span>
                    <Badge variant="outline" className="border-rose-500/40 text-rose-300 text-[9px]">
                      HIGH
                    </Badge>
                  </div>
                  <p className="text-slate-300">
                    7 geometries require spatial cleaning (self-intersecting vertex loops).
                  </p>
                </div>

                <div className="rounded-lg border border-amber-500/30 bg-amber-950/30 p-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono text-amber-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      ATTR_MISSING_REQ_ID
                    </span>
                    <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[9px]">
                      MEDIUM
                    </Badge>
                  </div>
                  <p className="text-slate-300">
                    14 potential duplicate features detected during index scan.
                  </p>
                </div>
              </div>
            ) : (
              validation.warnings.length === 0 && (
                <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs text-center font-mono">
                  ✓ No severe validation errors detected. Data source is clean and aligned.
                </div>
              )
            )}
          </div>
        </div>

        <SheetFooter className="border-t border-slate-800 pt-3 flex items-center justify-between sm:justify-between">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="border-slate-800 text-slate-400">
            Close Inspector
          </Button>

          <Button
            size="sm"
            onClick={handleMarkForReview}
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs shadow-md"
          >
            <Flag className="mr-1.5 h-3.5 w-3.5" />
            MARK FOR REVIEW
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
