/**
 * BHOO-MITRA AI — Audit Event Inspector Drawer
 *
 * Detailed right-side drawer displaying structured audit record attributes,
 * previous state → new state diff, actor metadata, evidence links, and immutable provenance tags.
 */

import React from "react";
import { type AuditEvent } from "@/lib/api/audit";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  X,
  ShieldCheck,
  Clock,
  User,
  Activity,
  Layers,
  FileText,
  AlertTriangle,
  ArrowRight,
  Lock,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditInspectorDrawerProps {
  event: AuditEvent | null;
  onClose: () => void;
  onCreateCorrective: (event: AuditEvent) => void;
}

export function AuditInspectorDrawer({ event, onClose, onCreateCorrective }: AuditInspectorDrawerProps) {
  if (!event) return null;

  const formattedTime = new Date(event.timestamp).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  });

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-border bg-background/95 backdrop-blur-xl shadow-2xl transition-all">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-sm font-bold text-ivory">{event.id}</h2>
              <span className="rounded bg-verified/15 px-2 py-0.5 font-mono text-[10px] font-bold text-verified border border-verified/30">
                READ ONLY
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">Historical Compliance Audit Record</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
          aria-label="Close Inspector"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 space-y-5 overflow-y-auto scrollbar-slim p-5">
        {/* Action & Module Header */}
        <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="label-technical">{event.module} Module</span>
            <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formattedTime}
            </span>
          </div>
          <p className="font-mono text-base font-bold text-ivory">{event.action}</p>
          {event.reason && <p className="text-xs leading-relaxed text-foreground/85">{event.reason}</p>}
        </div>

        {/* Actor Information */}
        <div className="rounded-xl border border-border bg-surface/50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-ivory">
            <User className="h-4 w-4 text-primary" />
            <span>ACTOR / AUTHOR</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/50">
            <div>
              <p className="text-muted-foreground text-[10px]">Actor Name</p>
              <p className="font-mono font-bold text-ivory">{event.actorName}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-[10px]">Official Role</p>
              <p className="font-mono text-primary">{event.actorRole}</p>
            </div>
            {event.actorId && (
              <div className="col-span-2">
                <p className="text-muted-foreground text-[10px]">Actor ID</p>
                <p className="font-mono text-xs text-muted-foreground">{event.actorId}</p>
              </div>
            )}
          </div>
        </div>

        {/* State Transition Diff */}
        {(event.previousState !== undefined || event.newState !== undefined) && (
          <div className="rounded-xl border border-border bg-surface/50 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-ivory">
              <Activity className="h-4 w-4 text-cyan" />
              <span>STATE TRANSITION</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-lg border border-border/60 bg-background/60 p-3 space-y-1">
                <p className="label-technical text-muted-foreground">Previous State</p>
                <pre className="font-mono text-[11px] text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                  {typeof event.previousState === "object"
                    ? JSON.stringify(event.previousState, null, 2)
                    : String(event.previousState ?? "N/A")}
                </pre>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-1">
                <p className="label-technical text-primary">New State</p>
                <pre className="font-mono text-[11px] text-ivory overflow-x-auto whitespace-pre-wrap">
                  {typeof event.newState === "object"
                    ? JSON.stringify(event.newState, null, 2)
                    : String(event.newState ?? "N/A")}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Related Application Entities */}
        <div className="rounded-xl border border-border bg-surface/50 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-ivory">
            <Layers className="h-4 w-4 text-saffron" />
            <span>RELATED OBJECTS & NAVIGATION</span>
          </div>
          <div className="space-y-2 text-xs">
            {event.entityId && (
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 px-3 py-2">
                <div>
                  <span className="text-muted-foreground text-[10px] block">Canonical Entity</span>
                  <span className="font-mono font-bold text-ivory">{event.entityId}</span>
                </div>
                <Button asChild size="sm" variant="ghost" className="h-7 text-[11px] gap-1">
                  <Link to="/entity-matching">
                    View Entity <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}

            {event.parcelId && (
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 px-3 py-2">
                <div>
                  <span className="text-muted-foreground text-[10px] block">Parcel Index</span>
                  <span className="font-mono font-bold text-cyan">{event.parcelId}</span>
                </div>
                <Button asChild size="sm" variant="ghost" className="h-7 text-[11px] gap-1">
                  <Link to="/map">
                    View Map <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}

            {event.conflictId && (
              <div className="flex items-center justify-between rounded-lg border border-conflict/40 bg-conflict/5 px-3 py-2">
                <div>
                  <span className="text-conflict text-[10px] block">Conflict Reference</span>
                  <span className="font-mono font-bold text-conflict">{event.conflictId}</span>
                </div>
                <Button asChild size="sm" variant="ghost" className="h-7 text-[11px] text-conflict gap-1">
                  <Link to="/conflicts">
                    Investigate <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}

            {event.recommendationId && (
              <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
                <div>
                  <span className="text-primary text-[10px] block">AI Recommendation</span>
                  <span className="font-mono font-bold text-ivory">{event.recommendationId}</span>
                </div>
                <Button asChild size="sm" variant="ghost" className="h-7 text-[11px] gap-1">
                  <Link to="/harmonization">
                    Workspace <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}

            {event.verificationId && (
              <div className="flex items-center justify-between rounded-lg border border-verified/30 bg-verified/5 px-3 py-2">
                <div>
                  <span className="text-verified text-[10px] block">Verification Item</span>
                  <span className="font-mono font-bold text-verified">{event.verificationId}</span>
                </div>
                <Button asChild size="sm" variant="ghost" className="h-7 text-[11px] text-verified gap-1">
                  <Link to="/verification">
                    Review <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}

            {event.evidenceIds && event.evidenceIds.length > 0 && (
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 px-3 py-2">
                <div>
                  <span className="text-muted-foreground text-[10px] block">Evidence Files</span>
                  <span className="font-mono text-ivory">{event.evidenceIds.join(", ")}</span>
                </div>
                <Button asChild size="sm" variant="ghost" className="h-7 text-[11px] gap-1">
                  <Link to="/evidence">
                    Evidence Graph <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Structured Event Metadata */}
        {event.metadata && (
          <div className="rounded-xl border border-border bg-surface/50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-ivory">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>METADATA & PROVENANCE TAGS</span>
            </div>
            <pre className="font-mono text-[11px] text-muted-foreground bg-background/80 p-3 rounded-lg border border-border/60 overflow-x-auto">
              {JSON.stringify(event.metadata, null, 2)}
            </pre>
          </div>
        )}

        {/* Immutability Notice & Corrective Event CTA */}
        <div className="rounded-xl border border-saffron/30 bg-saffron/5 p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <Lock className="h-4 w-4 text-saffron shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-mono font-bold text-saffron">IMMUTABLE COMPLIANCE RECORD</p>
              <p className="mt-1 text-muted-foreground leading-relaxed">
                Historical audit events are immutable and append-only. They cannot be edited or deleted. Create a new corrective event to record an official amendment.
              </p>
            </div>
          </div>
          <Button
            onClick={() => onCreateCorrective(event)}
            className="w-full gap-2 bg-saffron/20 border border-saffron/40 text-saffron hover:bg-saffron/30 text-xs"
            size="sm"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Create Corrective Event
          </Button>
        </div>
      </div>
    </div>
  );
}
