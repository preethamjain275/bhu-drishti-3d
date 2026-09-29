/**
 * BHOO-MITRA AI — Evidence Intelligence & Graph Workspace
 * Route: /evidence
 *
 * Prompt 7 — Evidence Intelligence Layer:
 * CONFLICT → OBSERVATIONS → SOURCES → GEOMETRY → ATTRIBUTES → TIMESTAMPS → PROVENANCE → EVIDENCE GRAPH → EXPLAINABLE DECISION SUPPORT
 *
 * ⚠️ SYNTHETIC DEMONSTRATION DATA — NOT REAL GOVERNMENT RECORDS ⚠️
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  Eye,
  FileCheck,
  FileSearch,
  FileStack,
  Filter,
  Fingerprint,
  Focus,
  GitBranch,
  Layers,
  MapPin,
  Play,
  RotateCcw,
  Scale,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { PageHeader, Panel } from "@/components/common/ModulePage";
import { DemoDataNotice } from "@/components/common/TrustBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type ConflictEvidence,
  type EvidenceType,
  SYNTHETIC_EVIDENCE,
  SOURCE_QUALITY_PROFILES,
  buildEvidenceGraph,
} from "@/lib/mock/evidence-data";
import { EvidenceGraph } from "@/components/evidence/EvidenceGraph";
import { EvidenceInspector } from "@/components/evidence/EvidenceInspector";
import { EvidenceTimeline } from "@/components/evidence/EvidenceTimeline";
import { SourceReliabilityPanel } from "@/components/evidence/SourceReliabilityPanel";
import { getEvidence, getEvidenceById } from "@/lib/services/evidence-service";

export const Route = createFileRoute("/_app/evidence")({
  validateSearch: (search: Record<string, unknown>) => search,
  head: () => ({
    meta: [
      { title: "Evidence Intelligence & Graph — Bhu Drishti 3D" },
      {
        name: "description",
        content:
          "Explainable geospatial decision support — inspect provenance chains, multi-source observations, and interactive evidence graphs.",
      },
      { property: "og:title", content: "Evidence Intelligence — Bhu Drishti 3D" },
      {
        property: "og:description",
        content: "Interactive evidence graph and multi-source provenance workspace.",
      },
    ],
  }),
  component: EvidencePage,
});

export function EvidencePage() {
  const navigate = useNavigate();

  // Primary Selection State
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(
    "EVIDENCE-DEMO-001"
  );
  const [selectedConflictId, setSelectedConflictId] = useState<string>(
    "CONFLICT-DEMO-001"
  );
  const [isFocusedOnConflict, setIsFocusedOnConflict] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string | "ALL">("ALL");
  const [selectedType, setSelectedType] = useState<EvidenceType | "ALL">("ALL");
  const [selectedConfidence, setSelectedConfidence] = useState<string>("ALL");

  // Filtered Evidence
  const filteredEvidence = useMemo(() => {
    let minConf: number | undefined;
    if (selectedConfidence === "HIGH") minConf = 90;
    else if (selectedConfidence === "MEDIUM") minConf = 75;

    return getEvidence({
      sourceId: selectedSource,
      evidenceType: selectedType,
      minConfidence: minConf,
      query: searchQuery,
    });
  }, [selectedSource, selectedType, selectedConfidence, searchQuery]);

  // Selected Evidence Record
  const activeEvidence = useMemo(() => {
    return (
      (selectedEvidenceId ? getEvidenceById(selectedEvidenceId) : null) ??
      filteredEvidence[0] ??
      SYNTHETIC_EVIDENCE[0]
    );
  }, [selectedEvidenceId, filteredEvidence]);

  // Build Graph Data
  const graphData = useMemo(() => {
    return buildEvidenceGraph(isFocusedOnConflict ? selectedConflictId : undefined);
  }, [isFocusedOnConflict, selectedConflictId]);

  // KPI Calculations
  const kpiCounts = useMemo(() => {
    return {
      total: SYNTHETIC_EVIDENCE.length,
      sourceRecords: SYNTHETIC_EVIDENCE.filter(
        (e) => e.evidenceType === "SOURCE_RECORD"
      ).length,
      geometry: SYNTHETIC_EVIDENCE.filter(
        (e) =>
          e.evidenceType === "GEOMETRY_OBSERVATION" ||
          e.evidenceType === "SURVEY_OBSERVATION"
      ).length,
      attributes: SYNTHETIC_EVIDENCE.filter(
        (e) => e.evidenceType === "ATTRIBUTE_OBSERVATION"
      ).length,
      temporal: SYNTHETIC_EVIDENCE.filter(
        (e) => e.evidenceType === "TEMPORAL_OBSERVATION"
      ).length,
      verification: SYNTHETIC_EVIDENCE.filter(
        (e) => e.evidenceType === "VERIFICATION_RECORD"
      ).length,
    };
  }, []);

  // Run Scripted Evidence Demo Flow
  const handleRunDemo = () => {
    setSelectedSource("ALL");
    setSelectedType("ALL");
    setSelectedConfidence("ALL");
    setSearchQuery("");
    setSelectedConflictId("CONFLICT-DEMO-001");
    setSelectedEvidenceId("EVIDENCE-DEMO-001");
    setIsFocusedOnConflict(true);
  };

  // Node selection from Graph
  const handleSelectNode = (node: any) => {
    if (node.type === "EVIDENCE" && node.dataRefId) {
      setSelectedEvidenceId(node.dataRefId);
    } else if (node.type === "CONFLICT" && node.dataRefId) {
      setSelectedConflictId(node.dataRefId);
    } else if (node.type === "SOURCE") {
      const srcId = node.id.includes("MUNI")
        ? "municipal"
        : node.id.includes("REG")
        ? "registry"
        : "survey";
      setSelectedSource(srcId);
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 md:px-6 md:py-8 pb-24 md:pb-8">
      {/* Top Header */}
      <PageHeader
        eyebrow="Explainable Decision Support"
        title="Evidence Intelligence & Provenance"
        description="Inspect multi-source observations, verifiable custody trails, and interactive evidence graphs supporting every land record determination."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRunDemo}
              className="border-saffron/50 bg-saffron/10 text-saffron hover:bg-saffron/20 font-bold"
            >
              <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
              Run Evidence Demo
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsFocusedOnConflict(!isFocusedOnConflict)}
              className="bg-primary text-ivory hover:bg-primary/90 font-bold"
            >
              <Focus className="mr-1.5 h-3.5 w-3.5" />
              {isFocusedOnConflict ? "Show Entire Graph" : "Focus on Conflict"}
            </Button>
          </div>
        }
      />

      <DemoDataNotice />

      {/* KPI Cards Row (Interactive Filters) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Evidence */}
        <button
          onClick={() => {
            setSelectedType("ALL");
            setSelectedSource("ALL");
          }}
          className={cn(
            "flex flex-col rounded-xl border p-3 text-left transition-all hover:scale-[1.02]",
            selectedType === "ALL" && selectedSource === "ALL"
              ? "border-primary bg-primary/10 ring-1 ring-primary"
              : "border-border/80 bg-surface/60"
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Total Evidence
          </span>
          <p className="mt-1 font-mono text-2xl font-bold text-ivory">
            {kpiCounts.total}
          </p>
          <span className="text-[10px] text-primary mt-0.5">All observations</span>
        </button>

        {/* Source Records */}
        <button
          onClick={() => {
            setSelectedType(selectedType === "SOURCE_RECORD" ? "ALL" : "SOURCE_RECORD");
          }}
          className={cn(
            "flex flex-col rounded-xl border p-3 text-left transition-all hover:scale-[1.02]",
            selectedType === "SOURCE_RECORD"
              ? "border-cyan bg-cyan/10 ring-1 ring-cyan"
              : "border-border/80 bg-surface/60"
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan">
            Source Records
          </span>
          <p className="mt-1 font-mono text-2xl font-bold text-cyan">
            {kpiCounts.sourceRecords}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Deeds & Gazettes
          </span>
        </button>

        {/* Geometry & Survey */}
        <button
          onClick={() => {
            setSelectedType(
              selectedType === "GEOMETRY_OBSERVATION" ? "ALL" : "GEOMETRY_OBSERVATION"
            );
          }}
          className={cn(
            "flex flex-col rounded-xl border p-3 text-left transition-all hover:scale-[1.02]",
            selectedType === "GEOMETRY_OBSERVATION"
              ? "border-saffron bg-saffron/10 ring-1 ring-saffron"
              : "border-border/80 bg-surface/60"
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
            Geometry Evidence
          </span>
          <p className="mt-1 font-mono text-2xl font-bold text-saffron">
            {kpiCounts.geometry}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Vectors & Orthos
          </span>
        </button>

        {/* Attribute Evidence */}
        <button
          onClick={() => {
            setSelectedType(
              selectedType === "ATTRIBUTE_OBSERVATION" ? "ALL" : "ATTRIBUTE_OBSERVATION"
            );
          }}
          className={cn(
            "flex flex-col rounded-xl border p-3 text-left transition-all hover:scale-[1.02]",
            selectedType === "ATTRIBUTE_OBSERVATION"
              ? "border-primary bg-primary/10 ring-1 ring-primary"
              : "border-border/80 bg-surface/60"
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Attribute Evidence
          </span>
          <p className="mt-1 font-mono text-2xl font-bold text-primary">
            {kpiCounts.attributes}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Land-Use & Tax
          </span>
        </button>

        {/* Temporal Evidence */}
        <button
          onClick={() => {
            setSelectedType(
              selectedType === "TEMPORAL_OBSERVATION" ? "ALL" : "TEMPORAL_OBSERVATION"
            );
          }}
          className={cn(
            "flex flex-col rounded-xl border p-3 text-left transition-all hover:scale-[1.02]",
            selectedType === "TEMPORAL_OBSERVATION"
              ? "border-saffron bg-saffron/10 ring-1 ring-saffron"
              : "border-border/80 bg-surface/60"
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
            Temporal Evidence
          </span>
          <p className="mt-1 font-mono text-2xl font-bold text-saffron">
            {kpiCounts.temporal}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Partitions & Changes
          </span>
        </button>

        {/* Verification Records */}
        <button
          onClick={() => {
            setSelectedType(
              selectedType === "VERIFICATION_RECORD" ? "ALL" : "VERIFICATION_RECORD"
            );
          }}
          className={cn(
            "flex flex-col rounded-xl border p-3 text-left transition-all hover:scale-[1.02]",
            selectedType === "VERIFICATION_RECORD"
              ? "border-emerald-400 bg-emerald-400/10 ring-1 ring-emerald-400"
              : "border-border/80 bg-surface/60"
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Verification Dossiers
          </span>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-400">
            {kpiCounts.verification}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Awards & Demarcations
          </span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-border/80 bg-slate-900/70 p-3 shadow-md backdrop-blur-md">
        <div className="flex flex-1 items-center gap-2 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Evidence ID, Conflict ID, Parcel ID, Source…"
              className="h-9 w-full rounded-lg border border-border/60 bg-slate-950/60 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="h-9 rounded-lg border border-border/60 bg-slate-950/80 px-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Sources</option>
            <option value="municipal">Municipal GIS</option>
            <option value="registry">Property Registry</option>
            <option value="survey">Drone Survey</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="h-9 rounded-lg border border-border/60 bg-slate-950/80 px-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="SOURCE_RECORD">Source Record</option>
            <option value="GEOMETRY_OBSERVATION">Geometry Observation</option>
            <option value="ATTRIBUTE_OBSERVATION">Attribute Observation</option>
            <option value="TEMPORAL_OBSERVATION">Temporal Observation</option>
            <option value="SURVEY_OBSERVATION">Survey Observation</option>
            <option value="VERIFICATION_RECORD">Verification Record</option>
          </select>

          {/* Confidence Filter */}
          <select
            value={selectedConfidence}
            onChange={(e) => setSelectedConfidence(e.target.value)}
            className="h-9 rounded-lg border border-border/60 bg-slate-950/80 px-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Confidence</option>
            <option value="HIGH">High (&gt;90%)</option>
            <option value="MEDIUM">Medium (&gt;75%)</option>
          </select>

          {/* Reset Filters */}
          {(selectedSource !== "ALL" ||
            selectedType !== "ALL" ||
            selectedConfidence !== "ALL" ||
            searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedSource("ALL");
                setSelectedType("ALL");
                setSelectedConfidence("ALL");
                setSearchQuery("");
              }}
              className="h-9 px-2 text-xs text-muted-foreground hover:text-ivory"
            >
              <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
            </Button>
          )}
        </div>
      </div>

      {/* Main Workspace Layout (Evidence List + Evidence Graph + Inspector) */}
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-12 min-h-[560px]">
        {/* 1. Evidence List / Queue */}
        <div className="xl:col-span-3 flex flex-col overflow-hidden rounded-xl glass-panel max-h-[420px] xl:max-h-[720px]">
          <div className="border-b border-border/80 bg-slate-900/70 px-3.5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileStack className="h-4 w-4 text-cyan" />
              <span className="text-xs font-bold uppercase tracking-wider text-ivory">
                Evidence Records
              </span>
            </div>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {filteredEvidence.length} items
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/40 p-1.5 space-y-1">
            {filteredEvidence.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No evidence items match current filters.
              </div>
            ) : (
              filteredEvidence.map((ev) => {
                const isSelected = ev.id === activeEvidence?.id;

                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvidenceId(ev.id)}
                    className={cn(
                      "group relative flex items-start gap-2.5 rounded-lg border p-2.5 text-xs transition-all cursor-pointer",
                      isSelected
                        ? "border-primary/80 bg-primary/10 shadow-sm ring-1 ring-primary/60"
                        : "border-transparent bg-slate-900/30 hover:border-border hover:bg-slate-900/60"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[11px] font-bold text-ivory truncate">
                          {ev.id}
                        </span>
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.2 text-[9px] font-bold uppercase border",
                            ev.sourceId === "municipal"
                              ? "bg-cyan/15 text-cyan border-cyan/40"
                              : ev.sourceId === "registry"
                              ? "bg-saffron/15 text-saffron border-saffron/40"
                              : "bg-emerald-400/15 text-emerald-400 border-emerald-400/40"
                          )}
                        >
                          {ev.sourceName}
                        </span>
                      </div>

                      <p className="mt-1 font-medium text-foreground truncate">
                        {ev.title}
                      </p>

                      <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="font-mono text-cyan truncate">
                          {ev.entityId}
                        </span>
                        <span>{ev.observationDate}</span>
                      </div>
                    </div>

                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform mt-2.5",
                        isSelected
                          ? "text-primary translate-x-0.5"
                          : "text-muted-foreground/30 group-hover:text-muted-foreground"
                      )}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 2. Interactive Evidence Graph */}
        <div className="xl:col-span-5 flex flex-col overflow-hidden min-h-[460px]">
          <EvidenceGraph
            graphData={graphData}
            selectedNodeId={activeEvidence?.id || selectedConflictId}
            onSelectNode={handleSelectNode}
            isFocused={isFocusedOnConflict}
            onToggleFocus={() => setIsFocusedOnConflict(!isFocusedOnConflict)}
          />
        </div>

        {/* 3. Detailed Evidence Inspector */}
        <div className="xl:col-span-4 flex flex-col overflow-hidden min-h-[460px]">
          {activeEvidence ? (
            <EvidenceInspector
              evidence={activeEvidence}
              onSelectRelatedEvidence={(id) => setSelectedEvidenceId(id)}
              onShowOnMap={(ev) => {
                navigate({
                  to: "/harmonization",
                  search: { entity: ev.entityId } as any,
                });
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl border border-border/80 bg-surface/90 p-8 text-center text-xs text-muted-foreground">
              Select an evidence item from the list or graph to inspect provenance.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Panels: Chronological Evidence Timeline + Source Reliability Profiles */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-6">
        <EvidenceTimeline
          evidenceList={filteredEvidence}
          selectedEvidenceId={activeEvidence?.id || null}
          onSelectEvidence={(id) => setSelectedEvidenceId(id)}
        />

        <SourceReliabilityPanel
          profiles={SOURCE_QUALITY_PROFILES}
          selectedSourceId={activeEvidence?.sourceId || null}
          onSelectSource={(srcId) => setSelectedSource(srcId)}
        />
      </div>
    </div>
  );
}
