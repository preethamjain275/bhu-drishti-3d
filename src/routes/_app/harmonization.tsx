/**
 * BHOO-MITRA AI — Data Harmonization Center & Multi-Source Comparison Workspace
 * Route: /harmonization
 *
 * Implements:
 * 1. CRS, Metadata & Schema Harmonization Preparation Workspace
 * 2. Multi-Source Parcel & Geometry Comparison
 *
 * ⚠️ SYNTHETIC DEMO DATA — NOT REAL GOVERNMENT RECORDS ⚠️
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import {
  Search,
  RotateCcw,
  Play,
  Layers,
  GitCompare,
  Sliders,
  Eye,
  EyeOff,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  BarChart3,
  Calendar,
  ShieldCheck,
  Zap,
  Info,
  Database,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/common/ModulePage";
import { DemoDataNotice } from "@/components/common/TrustBadge";
import { GlassPanel, StatusBadge } from "@/components/ui/bhumitra";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  SingleSourceMap,
  OverlayMap,
  DifferenceMap,
} from "@/components/maps/ComparisonMapEngine";
import {
  SOURCE_OBSERVATIONS,
  DEMO_PARCEL,
  ENTITY_MATCH_CONFIDENCE,
  GEOMETRY_COMPARISONS,
  ATTRIBUTE_COMPARISONS,
  TEMPORAL_EVENTS,
  CONFLICT_SUMMARY,
  SEARCHABLE_ENTITIES,
  type SourceId,
  type ComparisonMode,
} from "@/lib/mock/comparison-data";

import {
  getHarmonizationDatasets,
  updateDatasetSelection,
  selectAllDatasets,
  getMetadataComparison,
  getCRSProfiles,
  getCRSValidationChecks,
  getTransformationPreview,
  getSchemaMappings,
  suggestSchemaMappings,
  updateSchemaMapping,
  getAttributeStandardizationRules,
  getHarmonizationIssues,
  resolveHarmonizationIssue,
  calculateHarmonizationReadiness,
  runHarmonizationDemo,
  type PipelineStage,
  type HarmonizationDataset,
  type MetadataComparisonItem,
  type CRSProfile,
  type CRSValidationCheck,
  type TransformationPreview,
  type SchemaMapping,
  type AttributeMappingRule,
  type HarmonizationIssue,
  type HarmonizationReadiness,
} from "@/lib/api/harmonization";

import { HarmonizationPipelineNav } from "@/components/harmonization/HarmonizationPipelineNav";
import { DatasetSelectionPanel } from "@/components/harmonization/DatasetSelectionPanel";
import { MetadataHarmonizationPanel } from "@/components/harmonization/MetadataHarmonizationPanel";
import { CRSHarmonizationPanel } from "@/components/harmonization/CRSHarmonizationPanel";
import { SchemaHarmonizationPanel } from "@/components/harmonization/SchemaHarmonizationPanel";
import { HarmonizationQualityPanel } from "@/components/harmonization/HarmonizationQualityPanel";
import { HarmonizationInspectorPanel } from "@/components/harmonization/HarmonizationInspectorPanel";

// ---------------------------------------------------------------------------
// Route Definition
// ---------------------------------------------------------------------------

export const Route = createFileRoute("/_app/harmonization")({
  validateSearch: (search: Record<string, unknown>) => search,
  head: () => ({
    meta: [
      { title: "Data Harmonization Center — Bhu Drishti 3D" },
      {
        name: "description",
        content:
          "Standardize heterogeneous land record metadata, harmonize CRS projections, and map canonical parcel schemas for multi-source alignment.",
      },
      { property: "og:title", content: "Data Harmonization Center — Bhu Drishti 3D" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HarmonizationRootWorkspace,
});

function HarmonizationRootWorkspace() {
  const navigate = useNavigate();
  const [workspaceMode, setWorkspaceMode] = useState<"HARMONIZATION_CENTER" | "PARCEL_COMPARISON">("HARMONIZATION_CENTER");

  // State for Harmonization Preparation Center
  const [currentStage, setCurrentStage] = useState<PipelineStage>("STANDARDIZE");
  const [datasets, setDatasets] = useState<HarmonizationDataset[]>([]);
  const [comparison, setComparison] = useState<MetadataComparisonItem[]>([]);
  const [crsProfiles, setCrsProfiles] = useState<CRSProfile[]>([]);
  const [crsValidation, setCrsValidation] = useState<CRSValidationCheck[]>([]);
  const [transformationPreview, setTransformationPreview] = useState<TransformationPreview | null>(null);
  const [mappings, setMappings] = useState<SchemaMapping[]>([]);
  const [attributeRules, setAttributeRules] = useState<AttributeMappingRule[]>([]);
  const [issues, setIssues] = useState<HarmonizationIssue[]>([]);
  const [readiness, setReadiness] = useState<HarmonizationReadiness | null>(null);
  const [isProcessingDemo, setIsProcessingDemo] = useState(false);

  // State for Parcel Comparison
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [demoLoaded, setDemoLoaded] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("side-by-side");
  const [activeSources, setActiveSources] = useState<Record<SourceId, boolean>>({
    municipal: true, registry: true, survey: true,
  });
  const [opacities, setOpacities] = useState<Record<SourceId, number>>({
    municipal: 100, registry: 70, survey: 50,
  });
  const [showConflictZone, setShowConflictZone] = useState(true);
  const [detailTab, setDetailTab] = useState<"geometry" | "attributes" | "temporal" | "conflicts" | "entity-match" | "reliability">("geometry");
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    loadHarmonizationData();
  }, []);

  const loadHarmonizationData = async () => {
    const ds = await getHarmonizationDatasets();
    setDatasets(ds);
    const metaComp = await getMetadataComparison();
    setComparison(metaComp);
    const crsProf = await getCRSProfiles();
    setCrsProfiles(crsProf);
    const crsVal = await getCRSValidationChecks();
    setCrsValidation(crsVal);
    const transPrev = await getTransformationPreview();
    setTransformationPreview(transPrev);
    const maps = await getSchemaMappings();
    setMappings(maps);
    const attrRules = await getAttributeStandardizationRules();
    setAttributeRules(attrRules);
    const iss = await getHarmonizationIssues();
    setIssues(iss);
    const read = await calculateHarmonizationReadiness();
    setReadiness(read);
  };

  const handleToggleSelect = async (id: string) => {
    const d = datasets.find((x) => x.id === id);
    if (!d) return;
    const updated = await updateDatasetSelection(id, !d.selected);
    setDatasets(updated);
  };

  const handleSelectAll = async (selected: boolean) => {
    const updated = await selectAllDatasets(selected);
    setDatasets(updated);
  };

  const handleSuggestMappings = async () => {
    const updated = await suggestSchemaMappings();
    setMappings(updated);
  };

  const handleUpdateMapping = async (id: string, canonicalField: string) => {
    const updated = await updateSchemaMapping(id, { canonicalField, status: "Mapped" });
    setMappings(updated);
  };

  const handleResolveIssue = async (id: string) => {
    const updated = await resolveHarmonizationIssue(id);
    setIssues(updated);
  };

  const handleRunHarmonizationDemo = async () => {
    setIsProcessingDemo(true);
    const selectedIds = datasets.filter((d) => d.selected).map((d) => d.id);
    const res = await runHarmonizationDemo({
      selectedDatasetIds: selectedIds,
      onProgress: (stage, _percent) => {
        setCurrentStage(stage);
      },
    });
    setReadiness(res.readiness);
    setIssues(res.issues);
    setIsProcessingDemo(false);
  };

  const handleContinueToEntityMatching = () => {
    const selectedIds = datasets.filter((d) => d.selected).map((d) => d.id);
    navigate({ to: "/entity-matching", search: { sources: selectedIds.join(",") } });
  };

  // Load demo scenario for Parcel Comparison
  const loadDemoParcel = useCallback(() => {
    setSelectedEntityId("PARCEL-DEMO-014");
    setDemoLoaded(true);
    setActiveSources({ municipal: true, registry: true, survey: true });
    setOpacities({ municipal: 100, registry: 70, survey: 50 });
    setComparisonMode("side-by-side");
    setShowConflictZone(true);
    setShowProfile(true);
    setDetailTab("conflicts");
    setWorkspaceMode("PARCEL_COMPARISON");
  }, []);

  const handleResetParcel = useCallback(() => {
    setSelectedEntityId(null);
    setDemoLoaded(false);
    setComparisonMode("side-by-side");
    setActiveSources({ municipal: true, registry: true, survey: true });
    setOpacities({ municipal: 100, registry: 70, survey: 50 });
    setShowConflictZone(true);
    setShowProfile(false);
    setDetailTab("geometry");
  }, []);

  const handleToggleSource = (sid: SourceId) => {
    setActiveSources((prev) => ({ ...prev, [sid]: !prev[sid] }));
  };

  const handleOpacity = (sid: SourceId, v: number) => {
    setOpacities((prev) => ({ ...prev, [sid]: v }));
  };

  const isEntityLoaded = !!selectedEntityId;
  const sources: SourceId[] = ["municipal", "registry", "survey"];

  return (
    <div className="relative w-full space-y-6 px-4 py-6 md:px-6 md:py-8 pb-24 md:pb-8">
      {/* Aurora background */}
      <div className="dash-aurora pointer-events-none absolute inset-0 -z-10" aria-hidden />

      {/* Page Header */}
      <PageHeader
        eyebrow="CRS, METADATA & SCHEMA HARMONIZATION"
        title="Data Harmonization Center"
        description="Standardize heterogeneous spatial references, harmonize coordinate projections, and map canonical land schemas."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-1 text-xs font-mono">
              <button
                onClick={() => setWorkspaceMode("HARMONIZATION_CENTER")}
                className={cn(
                  "px-3 py-1.5 rounded-md font-bold transition-all",
                  workspaceMode === "HARMONIZATION_CENTER"
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                HARMONIZATION CENTER
              </button>
              <button
                onClick={() => setWorkspaceMode("PARCEL_COMPARISON")}
                className={cn(
                  "px-3 py-1.5 rounded-md font-bold transition-all",
                  workspaceMode === "PARCEL_COMPARISON"
                    ? "bg-purple-950 text-purple-300 border border-purple-500/40 shadow"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                PARCEL COMPARISON
              </button>
            </div>

            <Button
              onClick={handleRunHarmonizationDemo}
              disabled={isProcessingDemo}
              className="bg-indigo-950 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-900 font-bold text-xs"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-indigo-400" />
              RUN HARMONIZATION DEMO
            </Button>
          </div>
        }
      />

      <DemoDataNotice />

      {workspaceMode === "HARMONIZATION_CENTER" ? (
        /* ==================== HARMONIZATION CENTER WORKSPACE ==================== */
        <div className="space-y-4">
          {/* Interactive Stepper Pipeline Nav */}
          <HarmonizationPipelineNav currentStage={currentStage} onSelectStage={setCurrentStage} />

          {/* 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: Dataset Selection Panel */}
            <div className="lg:col-span-3">
              <DatasetSelectionPanel
                datasets={datasets}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onStartHarmonization={() => setCurrentStage("CRS HARMONIZE")}
                isProcessing={isProcessingDemo}
              />
            </div>

            {/* CENTER: Harmonization Stage Detail Panels */}
            <div className="lg:col-span-6 space-y-5">
              {(currentStage === "INGEST" || currentStage === "INSPECT" || currentStage === "STANDARDIZE") && (
                <MetadataHarmonizationPanel
                  comparison={comparison}
                  onNormalizeMetadata={() => setCurrentStage("CRS HARMONIZE")}
                />
              )}

              {currentStage === "CRS HARMONIZE" && transformationPreview && (
                <CRSHarmonizationPanel
                  profiles={crsProfiles}
                  validationChecks={crsValidation}
                  transformationPreview={transformationPreview}
                />
              )}

              {currentStage === "SCHEMA MAP" && (
                <SchemaHarmonizationPanel
                  mappings={mappings}
                  attributeRules={attributeRules}
                  onSuggestMappings={handleSuggestMappings}
                  onUpdateMapping={handleUpdateMapping}
                />
              )}

              {(currentStage === "QUALITY CHECK" || currentStage === "READY FOR ENTITY MATCHING") && readiness && (
                <HarmonizationQualityPanel readiness={readiness} />
              )}
            </div>

            {/* RIGHT: Inspector & Action Results Panel */}
            <div className="lg:col-span-3">
              {readiness && (
                <HarmonizationInspectorPanel
                  currentStage={currentStage}
                  issues={issues}
                  readiness={readiness}
                  isProcessing={isProcessingDemo}
                  onRunDemo={handleRunHarmonizationDemo}
                  onContinueToEntityMatching={handleContinueToEntityMatching}
                  onResolveIssue={handleResolveIssue}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ==================== MULTI-SOURCE PARCEL COMPARISON ==================== */
        <div className="space-y-4">
          <GlassPanel title="Compare Entity">
            <EntitySearch onSelect={(id) => { setSelectedEntityId(id); setShowProfile(true); }} selectedId={selectedEntityId} />
            {isEntityLoaded && (
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="font-mono font-semibold text-slate-100">{selectedEntityId}</span>
                <span>—</span>
                <span>Canonical entity</span>
                <span className="label-technical text-emerald-400">3 observations available</span>
              </div>
            )}
          </GlassPanel>

          {isEntityLoaded && (
            <GlassPanel title="Available Observations">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {sources.map((sid) => (
                  <SourceCard
                    key={sid}
                    sourceId={sid}
                    active={activeSources[sid]}
                    onClick={() => handleToggleSource(sid)}
                  />
                ))}
              </div>
            </GlassPanel>
          )}

          {isEntityLoaded ? (
            <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                <ModeTabBar active={comparisonMode} onChange={setComparisonMode} />
                <div className="min-h-[380px]">
                  {comparisonMode === "side-by-side" && (
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(sources.filter((s) => activeSources[s]).length || 1, 2)}, 1fr)` }}>
                      {sources.filter((s) => activeSources[s]).map((sid) => (
                        <SingleSourceMap key={sid} sourceId={sid} className="h-[340px]" />
                      ))}
                    </div>
                  )}
                  {comparisonMode === "overlay" && (
                    <OverlayMap className="h-[380px]" activeSources={activeSources} opacities={opacities} showConflictZone={showConflictZone} />
                  )}
                  {comparisonMode === "difference" && <DifferenceMap className="h-[380px]" />}
                </div>

                <GlassPanel>
                  <div className="scrollbar-slim -mx-1 flex gap-0.5 overflow-x-auto pb-1 border-b border-border mb-4">
                    {[
                      { id: "geometry", label: "Geometry", icon: MapPin },
                      { id: "attributes", label: "Attributes", icon: BarChart3 },
                      { id: "temporal", label: "Timeline", icon: Calendar },
                      { id: "conflicts", label: "Conflicts", icon: AlertTriangle },
                      { id: "entity-match", label: "Entity Match", icon: ShieldCheck },
                      { id: "reliability", label: "Reliability", icon: Zap },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setDetailTab(id as any)}
                        className={cn(
                          "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap",
                          detailTab === id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        )}
                      >
                        <Icon className="size-3" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {detailTab === "geometry" && <GeometryPanel />}
                  {detailTab === "attributes" && <AttributeTable />}
                  {detailTab === "temporal" && <TemporalTimeline />}
                  {detailTab === "conflicts" && <ConflictPanel />}
                  {detailTab === "entity-match" && <EntityMatchPanel />}
                  {detailTab === "reliability" && <ReliabilityPanel />}
                </GlassPanel>
              </div>

              <div className="space-y-4">
                {showProfile && (
                  <GlassPanel title="Property Profile">
                    <PropertyProfile parcelId={selectedEntityId!} onInvestigate={() => navigate({ to: "/conflicts" })} />
                  </GlassPanel>
                )}
              </div>
            </div>
          ) : (
            <GlassPanel>
              <div className="spatial-grid flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border text-center p-8">
                <GitCompare className="size-8 text-cyan-400" />
                <div>
                  <p className="font-display text-lg font-bold text-slate-100">Multi-Source Comparison Workspace</p>
                  <p className="mt-1 text-xs text-slate-400">Search for a property or load the demo scenario to begin comparing cadastral sources.</p>
                </div>
                <Button onClick={loadDemoParcel} className="gap-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs">
                  <Play className="size-4" /> Load Demo Property
                </Button>
              </div>
            </GlassPanel>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search & Helper Sub-components
// ---------------------------------------------------------------------------

function EntitySearch({ onSelect, selectedId }: { onSelect: (id: string) => void; selectedId: string | null }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = SEARCHABLE_ENTITIES.filter(
    (e) =>
      !query ||
      e.parcelId.toLowerCase().includes(query.toLowerCase()) ||
      e.surveyRef.toLowerCase().includes(query.toLowerCase()) ||
      e.entityId.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 focus-within:border-cyan-500/60 transition-all">
        <Search className="size-4 shrink-0 text-slate-400" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search Parcel ID, Survey Reference, Entity ID…"
          className="h-8 w-full bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500"
        />
        {selectedId && (
          <span className="shrink-0 rounded-full bg-cyan-950 px-2 py-0.5 font-mono text-[10px] text-cyan-300 border border-cyan-500/40">
            {selectedId}
          </span>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-xl font-mono text-xs">
          {filtered.map((e) => (
            <button
              key={e.id}
              onMouseDown={() => { onSelect(e.id); setQuery(""); setOpen(false); }}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-900 transition-colors"
            >
              <MapPin className="size-3.5 shrink-0 text-cyan-400" />
              <div>
                <p className="font-bold text-slate-100">{e.parcelId}</p>
                <p className="text-[10px] text-slate-400">{e.surveyRef} · {e.entityId}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SourceCard({ sourceId, active, onClick }: { sourceId: SourceId; active: boolean; onClick: () => void }) {
  const src = SOURCE_OBSERVATIONS[sourceId];
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col rounded-xl border p-3 text-left transition-all",
        active ? "border-cyan-500/60 bg-cyan-950/30 shadow-md" : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="h-2.5 w-2.5 mt-0.5 shrink-0 rounded-full" style={{ backgroundColor: src.color }} />
        <StatusBadge label={src.status} variant={src.status === "ACTIVE" ? "verified" : "muted"} />
      </div>
      <p className="mt-2 font-mono text-[11px] font-bold text-slate-100 uppercase">{src.label}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{src.sourceType}</p>
    </button>
  );
}

function ModeTabBar({ active, onChange }: { active: ComparisonMode; onChange: (m: ComparisonMode) => void }) {
  return (
    <div className="flex gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 font-mono text-xs">
      {[
        { id: "side-by-side" as const, label: "Side-by-Side" },
        { id: "overlay" as const, label: "Overlay" },
        { id: "difference" as const, label: "Difference" },
      ].map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex-1 py-1.5 px-3 rounded-lg font-bold transition-all",
            active === id ? "bg-cyan-600 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function GeometryPanel() {
  const sources: SourceId[] = ["municipal", "registry", "survey"];
  return (
    <div className="overflow-x-auto text-xs font-mono">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 uppercase">
            <th className="p-2">Attribute</th>
            {sources.map((sid) => (
              <th key={sid} className="p-2 text-right" style={{ color: SOURCE_OBSERVATIONS[sid].color }}>
                {SOURCE_OBSERVATIONS[sid].shortLabel}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          <tr className="hover:bg-slate-900/40"><td className="p-2">Area</td><td className="p-2 text-right">2,430 m²</td><td className="p-2 text-right text-amber-300">2,510 m²</td><td className="p-2 text-right text-emerald-300">2,465 m²</td></tr>
          <tr className="hover:bg-slate-900/40"><td className="p-2">Perimeter</td><td className="p-2 text-right">198.4 m</td><td className="p-2 text-right">202.1 m</td><td className="p-2 text-right">200.5 m</td></tr>
          <tr className="hover:bg-slate-900/40"><td className="p-2">Vertices</td><td className="p-2 text-right">8</td><td className="p-2 text-right">6</td><td className="p-2 text-right">14</td></tr>
        </tbody>
      </table>
    </div>
  );
}

function AttributeTable() {
  return (
    <div className="overflow-x-auto text-xs font-mono">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 uppercase">
            <th className="p-2">Attribute</th>
            <th className="p-2 text-right text-cyan-300">MUNI</th>
            <th className="p-2 text-right text-purple-300">REG</th>
            <th className="p-2 text-right text-amber-300">SURV</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300">
          <tr className="hover:bg-slate-900/40"><td className="p-2">Parcel ID</td><td className="p-2 text-right">P-10482</td><td className="p-2 text-right text-amber-300">REG-98102</td><td className="p-2 text-right text-emerald-300">SP-2291-P14</td></tr>
          <tr className="hover:bg-slate-900/40"><td className="p-2">Land Use</td><td className="p-2 text-right">Residential</td><td className="p-2 text-right">Residential</td><td className="p-2 text-right">Mixed Commercial</td></tr>
        </tbody>
      </table>
    </div>
  );
}

function TemporalTimeline() {
  return (
    <div className="space-y-2 text-xs font-mono text-slate-300">
      {TEMPORAL_EVENTS.map((ev, i) => (
        <div key={i} className="p-2 rounded bg-slate-900/60 border border-slate-800 flex justify-between">
          <span>{ev.date} — {ev.change}</span>
          <span className="text-cyan-300">{ev.confidence}%</span>
        </div>
      ))}
    </div>
  );
}

function ConflictPanel() {
  return (
    <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 text-amber-300 text-xs font-mono space-y-1">
      <div className="font-bold flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-amber-400" /> 3 BOUNDARY & ATTRIBUTE DISCREPANCIES DETECTED</div>
      <p className="text-slate-300">Municipal area (2,430 m²) vs Sub-Registrar title deed area (2,510 m²). Offset: 80 m².</p>
    </div>
  );
}

function EntityMatchPanel() {
  return (
    <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 text-xs font-mono space-y-1">
      <div className="font-bold">OVERALL MATCH CONFIDENCE: 94.8%</div>
      <p className="text-slate-300">High spatial topological overlap across Ward 18 municipal grid and Sub-Registrar IX record index.</p>
    </div>
  );
}

function ReliabilityPanel() {
  return (
    <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-300 space-y-1">
      <div>Municipal GIS Reliability: <strong className="text-emerald-400">92/100</strong></div>
      <div>Property Registry Reliability: <strong className="text-emerald-400">95/100</strong></div>
      <div>Field Survey Reliability: <strong className="text-emerald-400">98/100</strong></div>
    </div>
  );
}

function PropertyProfile({ parcelId, onInvestigate }: { parcelId: string; onInvestigate: () => void }) {
  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 space-y-1">
        <div className="font-bold text-cyan-300">{parcelId}</div>
        <div className="text-slate-400">Entity: Urban Tax Parcel</div>
        <div className="text-emerald-400">Status: Active Harmonized</div>
      </div>
      <Button size="sm" onClick={onInvestigate} className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs">
        <AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> Investigate Conflicts
      </Button>
    </div>
  );
}
