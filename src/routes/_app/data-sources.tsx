import React, { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Database,
  Plus,
  Search,
  Layers,
  Sparkles,
  Scale,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ShieldCheck,
  Compass,
  ArrowRight,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/common/ModulePage";
import { DemoDataNotice } from "@/components/common/TrustBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getDataSources,
  getIngestionStatus,
  type DataSource,
  type IngestionJob,
  type SourceType,
  type SourceStatus,
} from "@/lib/api/sources";

import { IngestionStatusCenter } from "@/components/sources/IngestionStatusCenter";
import { AddSourceModal } from "@/components/sources/AddSourceModal";
import { SourceDetailDrawer } from "@/components/sources/SourceDetailDrawer";
import { SourceComparisonModal } from "@/components/sources/SourceComparisonModal";
import { SchemaComparisonModal } from "@/components/sources/SchemaComparisonModal";
import { SourceValidationDrawer } from "@/components/sources/SourceValidationDrawer";

export const Route = createFileRoute("/_app/data-sources")({
  validateSearch: (s: Record<string, unknown>): { q?: string; [key: string]: unknown } => {
    if (typeof s["q"] === "string" && s["q"]) {
      return { ...s, q: s["q"] };
    }
    return { ...s };
  },
  head: () => ({
    meta: [
      { title: "Multi-Source Geospatial Data Center — Bhu Drishti 3D" },
      {
        name: "description",
        content:
          "Manage, inspect, and ingest heterogeneous geospatial cadastral maps, land registries, field surveys, and master planning datasets.",
      },
      { property: "og:title", content: "Multi-Source Geospatial Data Center — Bhu Drishti 3D" },
      {
        property: "og:description",
        content: "Government-grade multi-source land data ingestion and harmonization center.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: MultiSourceDataCenterPage,
});

function MultiSourceDataCenterPage() {
  const navigate = useNavigate();
  const { q: initialQ } = Route.useSearch();

  const [sources, setSources] = useState<DataSource[]>([]);
  const [ingestionJobs, setIngestionJobs] = useState<IngestionJob[]>([]);
  const [query, setQuery] = useState(initialQ ?? "");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Selection & Modals
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [schemaCompareOpen, setSchemaCompareOpen] = useState(false);
  const [validationDrawerOpen, setValidationDrawerOpen] = useState(false);
  const [selectedSourceIdsForComparison, setSelectedSourceIdsForComparison] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const list = await getDataSources();
    setSources(list);
    const jobs = await getIngestionStatus();
    setIngestionJobs(jobs);
    if (list.length > 0 && selectedSourceIdsForComparison.length === 0) {
      setSelectedSourceIdsForComparison([list[0]!.id, list[1]?.id ?? list[0]!.id]);
    }
  };

  const filteredSources = useMemo(() => {
    return sources.filter((s) => {
      if (selectedCategory !== "ALL" && s.type !== selectedCategory) return false;
      if (selectedStatus !== "ALL" && s.status !== selectedStatus) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.organization.toLowerCase().includes(q) ||
        s.spatial.crs.toLowerCase().includes(q) ||
        s.format.toLowerCase().includes(q)
      );
    });
  }, [sources, selectedCategory, selectedStatus, query]);

  const handleSourceAdded = (newSource: DataSource) => {
    setSources((prev) => [newSource, ...prev]);
    setSelectedSource(newSource);
    setDetailOpen(true);
  };

  const toggleSourceSelectionForCompare = (id: string) => {
    setSelectedSourceIdsForComparison((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const comparisonSources = sources.filter((s) => selectedSourceIdsForComparison.includes(s.id));

  return (
    <div className="space-y-6 px-4 py-6 md:px-6 md:py-8 pb-24 md:pb-8">
      {/* Page Header */}
      <PageHeader
        eyebrow="MULTI-SOURCE INGESTION & REGISTRY"
        title="Multi-Source Geospatial Data Center"
        description="Heterogeneous land record data ingestion, spatial CRS validation, quality metrics, and schema harmonization."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCompareModalOpen(true)}
              disabled={selectedSourceIdsForComparison.length < 2}
              className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 text-xs"
            >
              <Scale className="mr-1.5 h-3.5 w-3.5" />
              COMPARE SOURCES ({selectedSourceIdsForComparison.length})
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAddModalOpen(true)}
              className="bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-900 text-xs font-semibold"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-indigo-400" />
              RUN DEMO INGESTION
            </Button>

            <Button
              size="sm"
              onClick={() => setAddModalOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              ADD DATA SOURCE
            </Button>
          </div>
        }
      />

      {/* Trust Notice & Synthetic Banner */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-mono">
          <Database className="h-4 w-4 text-cyan-400" />
          <span>
            <strong>SYNTHETIC DEMONSTRATION SOURCES:</strong> Heterogeneous GeoJSON, Shapefile, and Tabular datasets loaded for land harmonization testing.
          </span>
        </div>
        <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 font-mono text-[10px]">
          {sources.length} SOURCES REGISTERED
        </Badge>
      </div>

      {/* Ingestion Status Activity Panel */}
      <IngestionStatusCenter jobs={ingestionJobs} onRefresh={loadData} />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search sources by name, CRS, format..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 pl-9 border-slate-800 bg-slate-950/80 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-cyan-400" /> Filter:
          </span>
          {["ALL", "Drone Imagery", "Government GIS", "Land Registry", "Survey", "Planning"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "rounded-md px-2.5 py-1 transition-colors whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                  : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {filteredSources.map((source) => {
          const isSelectedForCompare = selectedSourceIdsForComparison.includes(source.id);
          const statusTone =
            source.status === "CONNECTED" || source.status === "READY"
              ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
              : source.status === "WARNING"
              ? "border-amber-500/40 bg-amber-950/30 text-amber-300"
              : "border-rose-500/40 bg-rose-950/30 text-rose-300";

          return (
            <div
              key={source.id}
              className={cn(
                "glass-card glass-card-hover relative flex flex-col justify-between p-5 transition-all shadow-lg",
                isSelectedForCompare ? "border-cyan-500/60 ring-1 ring-cyan-500/40" : ""
              )}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="outline" className="border-slate-700 bg-slate-900 text-[10px] font-mono text-slate-400">
                      {source.type}
                    </Badge>
                    <h3 className="font-display font-bold text-slate-100 text-sm mt-1 leading-snug">
                      {source.name}
                    </h3>
                  </div>

                  <input
                    type="checkbox"
                    title="Select for comparison"
                    checked={isSelectedForCompare}
                    onChange={() => toggleSourceSelectionForCompare(source.id)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/40"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("text-[10px] font-mono uppercase tracking-wider", statusTone)}>
                    ● {source.status}
                  </Badge>
                  <span className="font-mono text-[11px] text-cyan-400 font-semibold">{source.spatial.crs}</span>
                  <span className="font-mono text-[11px] text-slate-500">· {source.format}</span>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-900/60 p-2.5 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px]">ENTITIES</span>
                    <div className="font-bold text-slate-200">{source.entityCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">QUALITY</span>
                    <div className="font-bold text-cyan-300">{source.quality.overallQualityScore}%</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">RELIABILITY</span>
                    <div className="font-bold text-emerald-400">{source.reliability.score}% ({source.reliability.level})</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">COVERAGE</span>
                    <div className="font-bold text-slate-200">{source.spatial.coveragePercentage}%</div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {source.assetCount} Asset{source.assetCount > 1 ? "s" : ""}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedSource(source);
                    setDetailOpen(true);
                  }}
                  className="h-8 border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 text-xs font-semibold"
                >
                  OPEN SOURCE
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Source Asset Registry Table */}
      <div className="glass-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-cyan-400" />
            <h3 className="font-display font-semibold text-slate-100 text-sm">
              GLOBAL SOURCE ASSET REGISTRY
            </h3>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {sources.reduce((acc, s) => acc + s.assets.length, 0)} Total Ingested Files
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono uppercase">
                <th className="p-3">Asset File</th>
                <th className="p-3">Source Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Format</th>
                <th className="p-3">Size</th>
                <th className="p-3">Features</th>
                <th className="p-3">CRS</th>
                <th className="p-3">Updated</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {sources.flatMap((s) =>
                s.assets.map((ast) => (
                  <tr
                    key={ast.id}
                    onClick={() => {
                      setSelectedSource(s);
                      setDetailOpen(true);
                    }}
                    className="cursor-pointer hover:bg-slate-900/60 transition-colors"
                  >
                    <td className="p-3 font-semibold text-cyan-300 flex items-center gap-1.5">
                      <FileCode className="h-3.5 w-3.5 text-cyan-400" />
                      {ast.name}
                    </td>
                    <td className="p-3 text-slate-200">{s.name}</td>
                    <td className="p-3 text-slate-400">{ast.assetType}</td>
                    <td className="p-3 text-indigo-300">{ast.format}</td>
                    <td className="p-3 text-slate-400">{ast.sizeMb} MB</td>
                    <td className="p-3 font-bold text-slate-100">{ast.featureCount.toLocaleString()}</td>
                    <td className="p-3 text-cyan-400">{ast.crs}</td>
                    <td className="p-3 text-slate-400">{ast.lastUpdated}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px]">
                        {ast.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals & Drawers */}
      <AddSourceModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSourceAdded={handleSourceAdded}
      />

      <SourceDetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        source={selectedSource}
        onOpenValidation={() => setValidationDrawerOpen(true)}
        onCompareSchema={() => setSchemaCompareOpen(true)}
      />

      <SourceComparisonModal
        open={compareModalOpen}
        onOpenChange={setCompareModalOpen}
        sources={comparisonSources}
        onPrepareHarmonization={() => {
          setCompareModalOpen(false);
          navigate({ to: "/harmonization" });
        }}
      />

      <SchemaComparisonModal
        open={schemaCompareOpen}
        onOpenChange={setSchemaCompareOpen}
        sources={comparisonSources.length >= 2 ? comparisonSources : sources.slice(0, 2)}
      />

      <SourceValidationDrawer
        open={validationDrawerOpen}
        onOpenChange={setValidationDrawerOpen}
        source={selectedSource}
        onMarkedForReview={loadData}
      />
    </div>
  );
}
