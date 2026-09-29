/**
 * BHOO-MITRA AI — Conflict Intelligence & Investigation Workspace
 * Route: /conflicts
 *
 * Prompt 6 — Conflict Intelligence + Investigation Experience:
 * DETECT → CLASSIFY → PRIORITIZE → INVESTIGATE → EXPLAIN → PREPARE FOR VERIFICATION
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
  Filter,
  Flame,
  Layers,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Scale,
  Search,
  ShieldAlert,
  Sparkles,
  Table,
  Workflow,
  Zap,
} from "lucide-react";
import { PageHeader, Panel } from "@/components/common/ModulePage";
import { DemoDataNotice } from "@/components/common/TrustBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type ConflictCase,
  type ConflictSeverity,
  type ConflictStatus,
  type ConflictType,
  SYNTHETIC_CONFLICTS,
} from "@/lib/mock/conflicts-data";
import {
  ConflictMapEngine,
  type ConflictMapMode,
} from "@/components/maps/ConflictMapEngine";
import { ConflictInspector } from "@/components/conflicts/ConflictInspector";
import { getConflictCases } from "@/lib/services/conflict-service";

export const Route = createFileRoute("/_app/conflicts")({
  validateSearch: (search: Record<string, unknown>) => search,
  head: () => ({
    meta: [
      { title: "Conflict Intelligence & Investigation — Bhu Drishti 3D" },
      {
        name: "description",
        content:
          "Geospatial conflict investigation workstation — detect, classify, prioritize, and investigate land record discrepancies across sources.",
      },
      { property: "og:title", content: "Conflict Intelligence — Bhu Drishti 3D" },
      {
        property: "og:description",
        content:
          "Multi-source spatial and attribute discrepancy investigation workstation.",
      },
    ],
  }),
  component: ConflictsPage,
});

const SEVERITY_STYLE: Record<ConflictSeverity, string> = {
  CRITICAL: "bg-conflict/15 text-conflict border-conflict/40",
  HIGH: "bg-saffron/15 text-saffron border-saffron/40",
  MEDIUM: "bg-cyan/15 text-cyan border-cyan/40",
  LOW: "bg-slate-500/15 text-slate-400 border-slate-500/40",
};

export function ConflictsPage() {
  const navigate = useNavigate();

  // Primary State
  const [conflicts, setConflicts] = useState<ConflictCase[]>(SYNTHETIC_CONFLICTS);
  const [selectedConflictId, setSelectedConflictId] = useState<string | null>(
    "CONFLICT-DEMO-001"
  );
  const [mapMode, setMapMode] = useState<ConflictMapMode>("standard");
  const [isInvestigationMode, setIsInvestigationMode] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ConflictType | "ALL">("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<
    ConflictSeverity | "ALL"
  >("ALL");
  const [selectedStatus, setSelectedStatus] = useState<
    ConflictStatus | "ALL"
  >("ALL");

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionSuccess, setBulkActionSuccess] = useState<string | null>(null);

  // Filtered List
  const filteredConflicts = useMemo(() => {
    return getConflictCases({
      type: selectedType,
      severity: selectedSeverity,
      status: selectedStatus,
      query: searchQuery,
    });
  }, [conflicts, selectedType, selectedSeverity, selectedStatus, searchQuery]);

  // Active selected conflict object
  const activeConflict = useMemo(() => {
    return (
      conflicts.find((c) => c.id === selectedConflictId) ??
      filteredConflicts[0] ??
      null
    );
  }, [conflicts, selectedConflictId, filteredConflicts]);

  // Handle single conflict status change
  const handleStatusChange = (newStatus: ConflictStatus) => {
    if (!activeConflict) return;
    setConflicts((prev) =>
      prev.map((c) =>
        c.id === activeConflict.id ? { ...c, status: newStatus } : c
      )
    );
  };

  // Bulk Triage Actions
  const handleBulkStatusChange = (newStatus: ConflictStatus) => {
    if (selectedIds.length === 0) return;
    setConflicts((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.id) ? { ...c, status: newStatus } : c
      )
    );
    setBulkActionSuccess(
      `Updated ${selectedIds.length} conflicts to ${newStatus.replace("_", " ")}.`
    );
    setSelectedIds([]);
    setTimeout(() => setBulkActionSuccess(null), 4000);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredConflicts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredConflicts.map((c) => c.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Run Scripted Demo Scenario
  const handleRunDemo = () => {
    setSelectedType("ALL");
    setSelectedSeverity("ALL");
    setSelectedStatus("ALL");
    setSearchQuery("");
    setSelectedConflictId("CONFLICT-DEMO-001");
    setMapMode("standard");
    setIsInvestigationMode(true);
  };

  // KPI Calculations
  const kpiCounts = useMemo(() => {
    return {
      active: conflicts.filter(
        (c) => c.status === "OPEN" || c.status === "INVESTIGATING"
      ).length,
      highPriority: conflicts.filter(
        (c) => c.severity === "HIGH" || c.severity === "CRITICAL"
      ).length,
      geometry: conflicts.filter((c) => c.type === "GEOMETRY").length,
      attribute: conflicts.filter((c) => c.type === "ATTRIBUTE").length,
      temporal: conflicts.filter((c) => c.type === "TEMPORAL").length,
      topology: conflicts.filter((c) => c.type === "TOPOLOGY").length,
    };
  }, [conflicts]);

  return (
    <div
      className={cn(
        "space-y-6 px-4 py-6 md:px-6 md:py-8 pb-24 md:pb-8 transition-all duration-300",
        isInvestigationMode && "max-w-none px-2"
      )}
    >
      {/* Top Header */}
      {!isInvestigationMode ? (
        <PageHeader
          eyebrow="Conflict Intelligence & Investigation"
          title="Conflict Explorer"
          description="Detect, classify, prioritize, and investigate spatial & attribute discrepancies between authoritative land data sources."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRunDemo}
                className="border-saffron/50 bg-saffron/10 text-saffron hover:bg-saffron/20 font-bold"
              >
                <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
                Run Conflict Demo
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsInvestigationMode(true)}
                className="bg-primary text-ivory hover:bg-primary/90 font-bold"
              >
                <Maximize2 className="mr-1.5 h-3.5 w-3.5" />
                Enter Investigation Mode
              </Button>
            </div>
          }
        />
      ) : (
        /* Investigation Mode Compact Header */
        <div className="flex items-center justify-between rounded-xl border border-primary/40 bg-slate-900/90 px-4 py-2.5 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-md bg-primary/20 px-2 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              INVESTIGATION WORKSTATION ACTIVE
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Target: {activeConflict?.id} ({activeConflict?.entityId})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRunDemo}
              className="h-7 border-saffron/50 bg-saffron/10 text-saffron hover:bg-saffron/20 text-xs"
            >
              <Play className="mr-1 h-3 w-3 fill-current" /> Replay Demo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInvestigationMode(false)}
              className="h-7 border-border text-xs text-muted-foreground hover:text-ivory"
            >
              <Minimize2 className="mr-1 h-3 w-3" /> Exit Investigation Mode
            </Button>
          </div>
        </div>
      )}

      <DemoDataNotice />

      {/* KPI Cards Row (Interactive Filters) */}
      {!isInvestigationMode && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {/* Active Conflicts */}
          <button
            onClick={() => {
              setSelectedStatus(selectedStatus === "OPEN" ? "ALL" : "OPEN");
              setSelectedType("ALL");
              setSelectedSeverity("ALL");
            }}
            className={cn(
              "flex flex-col rounded-xl border p-3 text-left transition-all hover:scale-[1.02]",
              selectedStatus === "OPEN"
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-border/80 bg-surface/60"
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Active Conflicts
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-ivory">
              {kpiCounts.active}
            </p>
            <span className="text-[10px] text-primary mt-0.5">Click to filter</span>
          </button>

          {/* High / Critical Priority */}
          <button
            onClick={() => {
              setSelectedSeverity(selectedSeverity === "HIGH" ? "ALL" : "HIGH");
              setSelectedType("ALL");
            }}
            className={cn(
              "flex flex-col rounded-xl border p-3 text-left transition-all hover:scale-[1.02]",
              selectedSeverity === "HIGH"
                ? "border-saffron bg-saffron/10 ring-1 ring-saffron"
                : "border-border/80 bg-surface/60"
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
              High / Critical
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-saffron">
              {kpiCounts.highPriority}
            </p>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Priority Triage
            </span>
          </button>

          {/* Geometry Conflicts */}
          <button
            onClick={() => {
              setSelectedType(selectedType === "GEOMETRY" ? "ALL" : "GEOMETRY");
            }}
            className={cn(
              "flex flex-col rounded-xl border p-3 text-left transition-all hover:scale-[1.02]",
              selectedType === "GEOMETRY"
                ? "border-cyan bg-cyan/10 ring-1 ring-cyan"
                : "border-border/80 bg-surface/60"
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan">
              Geometry
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-cyan">
              {kpiCounts.geometry}
            </p>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Boundary & Shape
            </span>
          </button>

          {/* Attribute Conflicts */}
          <button
            onClick={() => {
              setSelectedType(selectedType === "ATTRIBUTE" ? "ALL" : "ATTRIBUTE");
            }}
            className={cn(
              "flex flex-col rounded-xl border p-3 text-left transition-all hover:scale-[1.02]",
              selectedType === "ATTRIBUTE"
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-border/80 bg-surface/60"
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Attribute
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-primary">
              {kpiCounts.attribute}
            </p>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Land-Use & IDs
            </span>
          </button>

          {/* Temporal Conflicts */}
          <button
            onClick={() => {
              setSelectedType(selectedType === "TEMPORAL" ? "ALL" : "TEMPORAL");
            }}
            className={cn(
              "flex flex-col rounded-xl border p-3 text-left transition-all hover:scale-[1.02]",
              selectedType === "TEMPORAL"
                ? "border-saffron bg-saffron/10 ring-1 ring-saffron"
                : "border-border/80 bg-surface/60"
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
              Temporal
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-saffron">
              {kpiCounts.temporal}
            </p>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Staleness & Drift
            </span>
          </button>

          {/* Topology Conflicts */}
          <button
            onClick={() => {
              setSelectedType(selectedType === "TOPOLOGY" ? "ALL" : "TOPOLOGY");
            }}
            className={cn(
              "flex flex-col rounded-xl border p-3 text-left transition-all hover:scale-[1.02]",
              selectedType === "TOPOLOGY"
                ? "border-conflict bg-conflict/10 ring-1 ring-conflict"
                : "border-border/80 bg-surface/60"
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-conflict">
              Topology
            </span>
            <p className="mt-1 font-mono text-2xl font-bold text-conflict">
              {kpiCounts.topology}
            </p>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Overlaps & Gaps
            </span>
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-border/80 bg-slate-900/70 p-3 shadow-md backdrop-blur-md">
        <div className="flex flex-1 items-center gap-2 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Conflict ID, Parcel ID, Ward, Subtype…"
              className="h-9 w-full rounded-lg border border-border/60 bg-slate-950/60 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="h-9 rounded-lg border border-border/60 bg-slate-950/80 px-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="GEOMETRY">Geometry</option>
            <option value="ATTRIBUTE">Attribute</option>
            <option value="TEMPORAL">Temporal</option>
            <option value="TOPOLOGY">Topology</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as any)}
            className="h-9 rounded-lg border border-border/60 bg-slate-950/80 px-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="h-9 rounded-lg border border-border/60 bg-slate-950/80 px-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DEFERRED">Deferred</option>
          </select>

          {/* Reset Filters */}
          {(selectedType !== "ALL" ||
            selectedSeverity !== "ALL" ||
            selectedStatus !== "ALL" ||
            searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedType("ALL");
                setSelectedSeverity("ALL");
                setSelectedStatus("ALL");
                setSearchQuery("");
              }}
              className="h-9 px-2 text-xs text-muted-foreground hover:text-ivory"
            >
              <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Action Notification Bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/50 bg-primary/10 px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2 font-medium text-ivory">
            <span className="font-bold text-primary">{selectedIds.length}</span>{" "}
            conflicts selected for bulk triage:
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusChange("INVESTIGATING")}
              className="h-7 text-xs border-primary/40 bg-slate-900 hover:bg-slate-800 text-ivory"
            >
              Mark Investigating
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusChange("DEFERRED")}
              className="h-7 text-xs border-slate-600 bg-slate-900 hover:bg-slate-800 text-muted-foreground"
            >
              Mark Deferred
            </Button>
            <Button
              size="sm"
              onClick={() => handleBulkStatusChange("PENDING_VERIFICATION")}
              className="h-7 text-xs bg-saffron text-slate-950 font-bold hover:bg-saffron/90"
            >
              Assign for Verification
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}
              className="h-7 text-xs text-muted-foreground hover:text-ivory"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {bulkActionSuccess && (
        <div className="rounded-lg border border-verified/40 bg-verified/10 px-4 py-2 text-xs font-semibold text-verified">
          ✓ {bulkActionSuccess}
        </div>
      )}

      {/* Main Workspace Grid (List + GIS Map + Inspector) */}
      <div
        className={cn(
          "grid gap-4 grid-cols-1 xl:grid-cols-12 min-h-[580px]",
          isInvestigationMode && "xl:h-[calc(100vh-140px)]"
        )}
      >
        {/* 1. Conflict Queue / List */}
        <div className="xl:col-span-3 flex flex-col overflow-hidden rounded-xl border border-border/80 bg-surface/90 shadow-xl backdrop-blur-md max-h-[420px] xl:max-h-none">
          <div className="border-b border-border/80 bg-slate-900/70 px-3.5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  selectedIds.length === filteredConflicts.length &&
                  filteredConflicts.length > 0
                }
                onChange={handleToggleSelectAll}
                className="h-3.5 w-3.5 rounded border-border"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-ivory">
                Conflict Queue
              </span>
            </div>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {filteredConflicts.length} cases
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/40 p-1.5 space-y-1">
            {filteredConflicts.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No conflicts match current filters.
              </div>
            ) : (
              filteredConflicts.map((c) => {
                const isSelected = c.id === selectedConflictId;
                const isChecked = selectedIds.includes(c.id);

                return (
                  <div
                    key={c.id}
                    className={cn(
                      "group relative flex items-start gap-2.5 rounded-lg border p-2.5 text-xs transition-all cursor-pointer",
                      isSelected
                        ? "border-primary/80 bg-primary/10 shadow-sm"
                        : "border-transparent bg-slate-900/30 hover:border-border hover:bg-slate-900/60"
                    )}
                    onClick={() => setSelectedConflictId(c.id)}
                  >
                    {/* Multi-select checkbox */}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleToggleSelectOne(c.id);
                      }}
                      className="mt-1 h-3.5 w-3.5 rounded border-border"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[11px] font-bold text-ivory truncate">
                          {c.id}
                        </span>
                        <span
                          className={cn(
                            "rounded border px-1.5 py-0.2 text-[9px] font-bold uppercase",
                            SEVERITY_STYLE[c.severity]
                          )}
                        >
                          {c.severity}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-cyan truncate">
                          {c.entityId}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          {c.confidence}% conf
                        </span>
                      </div>

                      <p className="mt-1 font-medium text-foreground truncate">
                        {c.subtype}
                      </p>

                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="truncate">{c.ward.split("—")[0]}</span>
                        <span className="uppercase text-[9px] font-mono">
                          {c.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform mt-3",
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

        {/* 2. MapLibre Conflict GIS Engine */}
        <div className="xl:col-span-5 flex flex-col overflow-hidden rounded-xl border border-border/80 bg-surface shadow-xl relative min-h-[480px]">
          <ConflictMapEngine
            conflicts={filteredConflicts}
            selectedConflictId={selectedConflictId}
            onSelectConflict={(id) => setSelectedConflictId(id)}
            mapMode={mapMode}
            onMapModeChange={setMapMode}
            isInvestigationMode={isInvestigationMode}
            className="h-full w-full"
          />
        </div>

        {/* 3. Selected Conflict Inspector */}
        <div className="xl:col-span-4 flex flex-col overflow-hidden min-h-[480px]">
          {activeConflict ? (
            <ConflictInspector
              conflict={activeConflict}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-xl border border-border/80 bg-surface/90 p-8 text-center text-xs text-muted-foreground">
              Select a conflict from the queue or map to open the investigation inspector.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
