import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  GitMerge,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
} from "lucide-react";
import type { EntityObservation, MatchCandidate, MatchStatus } from "@/lib/api/entityMatching";
import { useNavigate } from "@tanstack/react-router";

interface EntityMatchInspectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  observation: EntityObservation | null;
  candidate: MatchCandidate | null;
  onSubmitDecision: (decision: MatchStatus) => void;
}

export const EntityMatchInspector: React.FC<EntityMatchInspectorProps> = ({
  open,
  onOpenChange,
  observation,
  candidate,
  onSubmitDecision,
}) => {
  const navigate = useNavigate();

  if (!observation || !candidate) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[480px] sm:w-[540px] border-cyan-500/30 bg-slate-950 text-slate-100 backdrop-blur-xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
              <GitMerge className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="font-display text-lg text-slate-100">
                ENTITY MATCH INSPECTOR
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-400">
                Detailed evidence, topology signals, and linking controls for {observation.id}.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="my-4 space-y-4 font-mono text-xs">
          {/* Status Header Banner */}
          <div className="rounded-lg border border-cyan-500/30 bg-slate-900/80 p-3 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-slate-400">OBSERVATION ID</div>
              <div className="font-bold text-cyan-300 text-sm">{observation.id}</div>
            </div>
            <Badge variant="outline" className="border-emerald-500/40 bg-emerald-950/40 text-emerald-300">
              STATUS: {observation.status}
            </Badge>
          </div>

          {/* Source vs Candidate Section */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px]">SOURCE OBSERVATION</span>
              <div className="font-bold text-slate-100">{observation.sourceName}</div>
              <div className="text-slate-400 text-[11px]">{observation.sourceEntityId}</div>
              <div className="text-slate-500 text-[10px] pt-1">Date: {observation.observationDate}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-purple-500/30 space-y-1">
              <span className="text-purple-400 text-[10px]">CANONICAL ENTITY</span>
              <div className="font-bold text-purple-300">{candidate.candidateEntityId}</div>
              <div className="text-slate-400 text-[11px]">{candidate.parcelId}</div>
              <div className="text-emerald-400 font-bold text-[10px] pt-1">Confidence: {candidate.overallSignalScore}%</div>
            </div>
          </div>

          {/* Spatial & Attribute Signals */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider">
              SPATIAL TOPOLOGY SIGNALS
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px]">IoU Overlap:</span>
                <div className="font-bold text-emerald-400">{candidate.metrics.iouPercentage}%</div>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px]">Centroid Offset:</span>
                <div className="font-bold text-cyan-300">{candidate.metrics.centroidDistanceMeters}m</div>
              </div>
            </div>
          </div>

          {/* Supporting Evidence Integration */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-display font-semibold text-xs text-slate-200 uppercase tracking-wider">
                SUPPORTING EVIDENCE
              </h4>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-300 text-[10px]">
                {candidate.supportingEvidenceIds.length} Linked Records
              </Badge>
            </div>
            <div className="space-y-1.5">
              {candidate.supportingEvidenceIds.map((evId) => (
                <div key={evId} className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-emerald-300">{evId}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      onOpenChange(false);
                      navigate({ to: "/evidence" });
                    }}
                    className="h-6 text-[10px] text-cyan-400 hover:text-cyan-200"
                  >
                    View Evidence Graph <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Related Conflicts Integration */}
          {candidate.relatedConflictIds.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-slate-900/60 p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-display font-semibold text-xs text-amber-300 uppercase tracking-wider">
                  RELATED CONFLICTS
                </h4>
                <Badge variant="outline" className="border-amber-500/40 text-amber-300 text-[10px]">
                  {candidate.relatedConflictIds.length} Conflicts
                </Badge>
              </div>
              <div className="space-y-1.5">
                {candidate.relatedConflictIds.map((cfId) => (
                  <div key={cfId} className="p-2 rounded bg-slate-950 border border-amber-500/20 flex justify-between items-center">
                    <span className="font-bold text-amber-300">{cfId}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        onOpenChange(false);
                        navigate({ to: "/conflicts" });
                      }}
                      className="h-6 text-[10px] text-amber-400 hover:text-amber-200"
                    >
                      Open Conflict Explorer <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
