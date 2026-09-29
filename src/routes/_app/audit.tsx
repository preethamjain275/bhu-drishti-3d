/**
 * BHOO-MITRA AI — LAND RECORD AUDIT & VERSION INTELLIGENCE CENTER
 * Route: /audit
 *
 * Government-grade provenance, compliance, append-only version history,
 * side-by-side version comparison, and evidence audit trail system.
 *
 * ⚠️ SYNTHETIC DEMONSTRATION DATA — NOT REAL GOVERNMENT RECORDS ⚠️
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Download,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  ShieldCheck,
  Activity,
  Layers,
  FileText,
  AlertTriangle,
  Lock,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Database,
  Eye,
  CheckCircle,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/common/ModulePage";
import { DemoDataNotice } from "@/components/common/TrustBadge";
import { KpiCard, GlassPanel, StatusBadge } from "@/components/ui/bhumitra";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  type AuditEvent,
  type EntityVersion,
  type AuditKpis,
  getAuditEvents,
  getEntityVersions,
  getAuditKpis,
} from "@/lib/api/audit";

import { GovernancePanel } from "@/components/audit/GovernancePanel";
import { AuditCharts } from "@/components/audit/AuditCharts";
import { ProvenanceChainView } from "@/components/audit/ProvenanceChainView";
import { VersionComparisonView } from "@/components/audit/VersionComparisonView";
import { AuditInspectorDrawer } from "@/components/audit/AuditInspectorDrawer";
import { CorrectiveEventModal } from "@/components/audit/CorrectiveEventModal";
import { AuditExportModal } from "@/components/audit/AuditExportModal";

// ---------------------------------------------------------------------------
// Route Definition
// ---------------------------------------------------------------------------

export const Route = createFileRoute("/_app/audit")({
  validateSearch: (search: Record<string, unknown>) => search,
  head: () => ({
    meta: [
      { title: "Land Record Audit & Version Intelligence Center — Bhu Drishti 3D" },
      {
        name: "description",
        content:
          "Government-grade append-only provenance, version history comparison, and audit trail system for land administration.",
      },
      { property: "og:title", content: "Land Record Audit & Version Intelligence Center — Bhu Drishti 3D" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuditPage,
});

// ---------------------------------------------------------------------------
// Event Action Badge Configuration
// ---------------------------------------------------------------------------

const ACTION_BADGE_STYLE: Record<string, { label: string; variant: "verified" | "conflict" | "warning" | "processing" | "info" | "muted" }> = {
  VERIFICATION_APPROVED: { label: "VERIFICATION APPROVED", variant: "verified" },
  VERIFICATION_STARTED: { label: "VERIFICATION STARTED", variant: "processing" },
  RECOMMENDATION_GENERATED: { label: "RECOMMENDATION GENERATED", variant: "info" },
  EVIDENCE_ATTACHED: { label: "EVIDENCE ATTACHED", variant: "warning" },
  CONFLICT_DETECTED: { label: "CONFLICT DETECTED", variant: "conflict" },
  ENTITY_MATCHED: { label: "ENTITY MATCHED", variant: "verified" },
  SOURCE_IMPORTED: { label: "SOURCE IMPORTED", variant: "info" },
  SOURCE_UPDATED: { label: "SOURCE UPDATED", variant: "muted" },
  ENTITY_CREATED: { label: "ENTITY CREATED", variant: "info" },
  USER_LOGIN: { label: "USER LOGIN", variant: "muted" },
  CORRECTIVE_EVENT_CREATED: { label: "CORRECTIVE EVENT CREATED", variant: "warning" },
};

function EventActionBadge({ action }: { action: string }) {
  const cfg = ACTION_BADGE_STYLE[action] ?? { label: action, variant: "muted" };
  return <StatusBadge label={cfg.label} variant={cfg.variant} />;
}

// ---------------------------------------------------------------------------
// Main Audit Center Page
// ---------------------------------------------------------------------------

function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [versions, setVersions] = useState<EntityVersion[]>([]);
  const [kpis, setKpis] = useState<AuditKpis | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [selectedActorRole, setSelectedActorRole] = useState<string>("ALL");
  const [selectedActionType, setSelectedActionType] = useState<string>("ALL");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("all");

  // Selection / Modals State
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [correctiveTarget, setCorrectiveTarget] = useState<AuditEvent | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Fetch audit dataset
  const fetchAuditData = async () => {
    setLoading(true);
    const [evtData, verData, kpiData] = await Promise.all([
      getAuditEvents({
        query: searchQuery,
        module: selectedModule,
        actorRole: selectedActorRole,
        actionType: selectedActionType,
        timeRange: selectedTimeRange,
      }),
      getEntityVersions("PARCEL-DEMO-014"),
      getAuditKpis(),
    ]);
    setEvents(evtData);
    setVersions(verData);
    setKpis(kpiData);
    setLoading(false);
  };

  useEffect(() => {
    fetchAuditData();
  }, [searchQuery, selectedModule, selectedActorRole, selectedActionType, selectedTimeRange]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedModule("ALL");
    setSelectedActorRole("ALL");
    setSelectedActionType("ALL");
    setSelectedTimeRange("all");
  };

  const handleCorrectiveCreated = (newEvent: AuditEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    setSelectedEvent(newEvent);
  };

  return (
    <div className="relative w-full space-y-6 px-4 py-6 md:px-6 md:py-8">
      {/* Background Aurora */}
      <div className="dash-aurora pointer-events-none absolute inset-0 -z-10" aria-hidden />

      {/* Page Header */}
      <PageHeader
        eyebrow="Compliance & Provenance Engine"
        title="Land Record Audit & Version Intelligence Center"
        description="Government-grade append-only provenance store, version history comparison, and audit trail system. Every candidate modification, evidence attachment, and verification decision is sealed into immutable history."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setShowExportModal(true)}
              className="gap-2 bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 text-xs font-semibold"
            >
              <Download className="h-4 w-4" />
              EXPORT AUDIT REPORT
            </Button>
          </div>
        }
      />

      <DemoDataNotice />

      {/* Governance & Audit Integrity Panel */}
      <GovernancePanel />

      {/* Audit KPIs */}
      {kpis && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-left"
          >
            <KpiCard
              label="Total Audit Events"
              value={kpis.totalEvents}
              context="Immutable Logs"
              tone="cyan"
            />
          </button>

          <button
            type="button"
            onClick={() => setSelectedTimeRange("today")}
            className="text-left"
          >
            <KpiCard
              label="Changes Today"
              value={kpis.changesToday}
              context="Last 24 Hours"
              tone="primary"
            />
          </button>

          <button
            type="button"
            onClick={() => setSelectedActionType("VERIFICATION_APPROVED")}
            className="text-left"
          >
            <KpiCard
              label="Verification Decisions"
              value={kpis.verificationDecisions}
              context="Human Signed"
              tone="verified"
            />
          </button>

          <button
            type="button"
            onClick={() => setSelectedModule("Recommendations")}
            className="text-left"
          >
            <KpiCard
              label="Recommendations"
              value={kpis.recommendationsGenerated}
              context="AI Generated"
              tone="primary"
            />
          </button>

          <button
            type="button"
            onClick={() => setSelectedModule("Sources")}
            className="text-left"
          >
            <KpiCard
              label="Source Updates"
              value={kpis.sourceUpdates}
              context="GIS & Registry"
              tone="saffron"
            />
          </button>

          <button
            type="button"
            onClick={() => setSelectedModule("Conflicts")}
            className="text-left"
          >
            <KpiCard
              label="Active Cases"
              value={kpis.activeCases}
              context="Open Discrepancies"
              tone="conflict"
            />
          </button>
        </div>
      )}

      {/* Visualizations Dashboard */}
      <AuditCharts events={events} />

      {/* Evidence Provenance Chain */}
      <ProvenanceChainView />

      {/* Entity Version History & Side-by-Side Comparison */}
      <VersionComparisonView />

      {/* Global Audit Timeline & Filters Section */}
      <GlassPanel
        title="GLOBAL AUDIT TIMELINE"
        meta={
          <div className="flex items-center gap-2">
            <span className="label-technical text-primary">{events.length} Events Filtered</span>
            <Button size="sm" variant="ghost" onClick={fetchAuditData} className="h-7 px-2">
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </div>
        }
      >
        {/* Filters and Search Bar */}
        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Event ID, Entity, Parcel ID, Conflict ID, Actor, Action…"
                className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-xs text-ivory outline-none focus:border-primary/60"
              />
            </div>

            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 text-xs text-ivory outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 text-xs text-ivory outline-none"
            >
              <option value="ALL">All Modules</option>
              <option value="Sources">Sources</option>
              <option value="Harmonization">Harmonization</option>
              <option value="Conflicts">Conflicts</option>
              <option value="Evidence">Evidence</option>
              <option value="Recommendations">Recommendations</option>
              <option value="Verification">Verification</option>
              <option value="System">System</option>
            </select>

            <select
              value={selectedActorRole}
              onChange={(e) => setSelectedActorRole(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 text-xs text-ivory outline-none"
            >
              <option value="ALL">All Actor Roles</option>
              <option value="Senior Revenue Officer">Senior Revenue Officer</option>
              <option value="GIS Specialist">GIS Specialist</option>
              <option value="Cadastral Surveyor">Cadastral Surveyor</option>
              <option value="BHOO-MITRA AI">BHOO-MITRA AI</option>
              <option value="System Administrator">System Administrator</option>
            </select>

            <select
              value={selectedActionType}
              onChange={(e) => setSelectedActionType(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 text-xs text-ivory outline-none"
            >
              <option value="ALL">All Event Types</option>
              <option value="VERIFICATION_APPROVED">VERIFICATION_APPROVED</option>
              <option value="VERIFICATION_STARTED">VERIFICATION_STARTED</option>
              <option value="RECOMMENDATION_GENERATED">RECOMMENDATION_GENERATED</option>
              <option value="EVIDENCE_ATTACHED">EVIDENCE_ATTACHED</option>
              <option value="CONFLICT_DETECTED">CONFLICT_DETECTED</option>
              <option value="ENTITY_MATCHED">ENTITY_MATCHED</option>
              <option value="SOURCE_IMPORTED">SOURCE_IMPORTED</option>
              <option value="CORRECTIVE_EVENT_CREATED">CORRECTIVE_EVENT_CREATED</option>
            </select>

            {(searchQuery ||
              selectedModule !== "ALL" ||
              selectedActorRole !== "ALL" ||
              selectedActionType !== "ALL" ||
              selectedTimeRange !== "all") && (
              <Button size="sm" variant="ghost" onClick={handleClearFilters} className="h-9 text-xs text-saffron">
                CLEAR ALL FILTERS
              </Button>
            )}
          </div>
        </div>

        {/* Chronological Timeline List */}
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-muted-foreground">
            <div className="h-5 w-5 animate-spin mx-auto mb-2 rounded-full border-2 border-primary border-t-transparent" />
            Filtering Audit Timeline…
          </div>
        ) : events.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No audit records match the selected filters.
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((evt) => {
              const evtTime = new Date(evt.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
              const evtDate = new Date(evt.timestamp).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/80 bg-background/60 p-4 transition-all hover:border-primary/40 hover:bg-white/4 cursor-pointer"
                >
                  {/* Left Column: Timestamp & Action Badge */}
                  <div className="flex items-start gap-3 min-w-[280px]">
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-xs font-bold text-ivory">{evtTime}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{evtDate}</span>
                    </div>
                    <div className="h-8 w-px bg-border/60 hidden sm:block" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <EventActionBadge action={evt.action} />
                        <span className="font-mono text-[11px] font-bold text-ivory">{evt.id}</span>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {evt.entityId ?? evt.parcelId ?? evt.module}
                      </p>
                    </div>
                  </div>

                  {/* Middle Column: Actor & Details */}
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono font-semibold text-ivory">{evt.actorName}</span>
                      <span className="text-[10px] text-muted-foreground">({evt.actorRole})</span>
                    </div>
                    {evt.reason && (
                      <p className="text-muted-foreground line-clamp-1">{evt.reason}</p>
                    )}
                  </div>

                  {/* Right Column: Key References & Inspector Arrow */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right font-mono text-[11px] text-muted-foreground hidden md:block">
                      {evt.conflictId && <span className="block text-conflict">{evt.conflictId}</span>}
                      {evt.recommendationId && <span className="block text-primary">{evt.recommendationId}</span>}
                      {evt.verificationId && <span className="block text-verified">{evt.verificationId}</span>}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassPanel>

      {/* Right Drawer Inspector */}
      <AuditInspectorDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onCreateCorrective={(ev) => setCorrectiveTarget(ev)}
      />

      {/* Corrective Event Modal */}
      <CorrectiveEventModal
        targetEvent={correctiveTarget}
        onClose={() => setCorrectiveTarget(null)}
        onCreated={handleCorrectiveCreated}
      />

      {/* Export Report Modal */}
      {showExportModal && (
        <AuditExportModal
          events={events}
          versions={versions}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
