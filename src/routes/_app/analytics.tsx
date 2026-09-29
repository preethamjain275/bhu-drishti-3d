import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState, useMemo } from "react";
import {
  getAnalyticsOverview,
  getSourceAnalytics,
  getConflictAnalytics,
  getMatchingAnalytics,
  getHarmonizationPipeline,
  getVerificationAnalytics,
  getEvidenceAnalytics,
  getSpatialCoverage,
  getBuildingAnalytics,
  generateExportPreview,
  ExecutiveKPIs,
  DataQualityMetrics,
  SourceAnalyticsItem,
  ConflictAnalyticsBreakdown,
  MatchingAnalyticsData,
  HarmonizationPipelineStage,
  VerificationAnalyticsData,
  EvidenceAnalyticsData,
  SpatialCoverageData,
  BuildingAnalyticsData,
  AnalyticsFilterState,
  ExportPreviewData,
} from "@/lib/api/analytics";
import { ExecutiveKPIStrip } from "@/components/analytics/ExecutiveKPIStrip";
import { AnalyticsMap } from "@/components/analytics/AnalyticsMap";
import { AnalyticsExportModal } from "@/components/analytics/AnalyticsExportModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  RefreshCw,
  Download,
  Filter,
  X,
  Layers,
  Database,
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  Building2,
  ExternalLink,
  Sparkles,
  Info,
  Clock,
  Flame,
} from "lucide-react";

export const Route = createFileRoute("/_app/analytics")({
  validateSearch: (search: Record<string, unknown>) => search,
  head: () => ({
    meta: [
      { title: "Analytics Center — Bhu Drishti 3D" },
      { name: "description", content: "Urban Land Intelligence Decision-Support Analytics & Quality Dashboard — Bhu Drishti 3D." },
      { property: "og:title", content: "Analytics Center — Bhu Drishti 3D" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const navigate = useNavigate();

  // Filter State
  const [filters, setFilters] = useState<AnalyticsFilterState>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportPreview, setExportPreview] = useState<ExportPreviewData | null>(null);

  // Data States
  const [kpis, setKpis] = useState<ExecutiveKPIs | null>(null);
  const [quality, setQuality] = useState<DataQualityMetrics | null>(null);
  const [sources, setSources] = useState<SourceAnalyticsItem[]>([]);
  const [conflicts, setConflicts] = useState<ConflictAnalyticsBreakdown | null>(null);
  const [matching, setMatching] = useState<MatchingAnalyticsData | null>(null);
  const [pipeline, setPipeline] = useState<HarmonizationPipelineStage[]>([]);
  const [verification, setVerification] = useState<VerificationAnalyticsData | null>(null);
  const [evidence, setEvidence] = useState<EvidenceAnalyticsData | null>(null);
  const [spatial, setSpatial] = useState<SpatialCoverageData | null>(null);
  const [buildings, setBuildings] = useState<BuildingAnalyticsData | null>(null);

  const loadAllAnalytics = async () => {
    setIsRefreshing(true);
    try {
      const overviewRes = await getAnalyticsOverview(filters);
      setKpis(overviewRes.kpis);
      setQuality(overviewRes.quality);

      const [srcRes, cnfRes, matchRes, pipeRes, verifRes, evdRes, spatRes, bldgRes] = await Promise.all([
        getSourceAnalytics(),
        getConflictAnalytics(),
        getMatchingAnalytics(),
        getHarmonizationPipeline(),
        getVerificationAnalytics(),
        getEvidenceAnalytics(),
        getSpatialCoverage(),
        getBuildingAnalytics(),
      ]);

      setSources(srcRes);
      setConflicts(cnfRes);
      setMatching(matchRes);
      setPipeline(pipeRes);
      setVerification(verifRes);
      setEvidence(evdRes);
      setSpatial(spatRes);
      setBuildings(bldgRes);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllAnalytics();
  }, [filters]);

  const handleExport = async () => {
    const data = await generateExportPreview(filters);
    setExportPreview(data);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-teal-400 font-bold uppercase tracking-wider">
            <BarChart3 className="h-4 w-4" />
            URBAN LAND INTELLIGENCE ANALYTICS CENTER
          </div>
          <h1 className="text-2xl font-black font-display text-white mt-1">Executive Analytics & Quality Dashboard</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cross-source reliability metrics, spatial conflict density, matching confidence, and verification pipelines.
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-bold">
            SYNTHETIC DEMO ANALYTICS
          </span>

          <button
            onClick={loadAllAnalytics}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 transition font-bold"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-teal-400 ${isRefreshing ? "animate-spin" : ""}`} />
            REFRESH
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition shadow-lg shadow-teal-500/20"
          >
            <Download className="h-3.5 w-3.5" />
            EXPORT ANALYTICS
          </button>
        </div>
      </div>

      {/* 2. Active Filters Bar */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-teal-400" />
            <span className="text-slate-400 font-bold">ACTIVE FILTERS:</span>
            {filters.sourceId && <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300">Source: {filters.sourceId}</span>}
            {filters.conflictType && <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300">Type: {filters.conflictType}</span>}
            {filters.severity && <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300">Severity: {filters.severity}</span>}
            {filters.landUse && <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300">Land Use: {filters.landUse}</span>}
          </div>
          <button
            onClick={() => setFilters({})}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
          >
            <X className="h-3 w-3" />
            CLEAR ALL
          </button>
        </div>
      )}

      {/* 3. Executive KPI Strip */}
      {kpis && <ExecutiveKPIStrip kpis={kpis} onDrillDown={(route) => navigate({ to: route })} />}

      {/* 4. Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols wide on desktop): Conflict & Source Intelligence */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Data Quality Overview Card */}
          {quality && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  DATA QUALITY & HARMONIZATION READINESS OVERVIEW
                </span>
                <span className="text-xl font-black text-emerald-400">{quality.overallScore}% OVERALL</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Completeness</div>
                  <div className="text-base font-bold text-slate-100 mt-1">{quality.completeness}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Geometry</div>
                  <div className="text-base font-bold text-teal-300 mt-1">{quality.geometryValidity}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">CRS Readiness</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">{quality.crsReadiness}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Schema Sync</div>
                  <div className="text-base font-bold text-blue-300 mt-1">{quality.schemaReadiness}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Temporal Coverage</div>
                  <div className="text-base font-bold text-purple-300 mt-1">{quality.temporalCoverage}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400">Source Reliability</div>
                  <div className="text-base font-bold text-amber-300 mt-1">{quality.sourceReliabilityAverage}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Source Intelligence & Reliability Bar Chart */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between font-mono">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="h-4 w-4" />
                  SOURCE INTELLIGENCE & RELIABILITY SIGNALS
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Statistical reliability indicators across connected cadastral feeds.</p>
              </div>
              <button
                onClick={() => navigate({ to: "/sources" })}
                className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1 font-bold"
              >
                MANAGE SOURCES <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sources} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="sourceName" stroke="#64748b" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem" }}
                  />
                  <Bar dataKey="reliabilitySignal" name="Reliability %" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="qualityScore" name="Quality Score" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spatial Conflict Map Panel */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between font-mono">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" />
                SPATIAL CONFLICT DENSITY MAP
              </span>
              <button
                onClick={() => navigate({ to: "/conflicts" })}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
              >
                OPEN CONFLICT EXPLORER <ExternalLink className="h-3 w-3" />
              </button>
            </div>
            <AnalyticsMap />
          </div>

          {/* Conflict Analytics Breakdown & Trend Chart */}
          {conflicts && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Conflict Types Pie Chart */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider">
                  CONFLICTS BY CATEGORY
                </span>
                <div className="h-52 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={conflicts.byType}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        innerRadius={45}
                        paddingAngle={4}
                      >
                        {conflicts.byType.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.5rem" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  {conflicts.byType.map((t) => (
                    <div
                      key={t.name}
                      onClick={() => setFilters((prev) => ({ ...prev, conflictType: t.name }))}
                      className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700"
                    >
                      <span className="flex items-center gap-1.5" style={{ color: t.color }}>
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                        {t.name}
                      </span>
                      <span className="font-bold">{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conflict Detection Trend Area Chart */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <span className="font-mono text-xs font-bold text-teal-400 uppercase tracking-wider">
                  CONFLICT RESOLUTION TREND
                </span>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={conflicts.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.5rem" }} />
                      <Area type="monotone" dataKey="detected" stroke="#ef4444" fill="#ef444420" name="Detected" />
                      <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="#10b98120" name="Resolved" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Right Column (1 Col wide on desktop): Matching, Harmonization, Verification, 3D Preview */}
        <div className="space-y-6">
          
          {/* 3D Analytics Preview Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between font-mono">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-purple-400" />
                3D DIGITAL TWIN ANALYTICS
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                CesiumJS 3D
              </span>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Extruded building height distribution, parcel coverage ratio, and volumetric analysis.
            </p>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-500">Buildings / Parcel</div>
                <div className="text-sm font-bold text-slate-100">2.8 Avg</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Avg Coverage</div>
                <div className="text-sm font-bold text-teal-300">38%</div>
              </div>
            </div>

            <button
              onClick={() => navigate({ to: "/intelligence-3d" })}
              className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20"
            >
              OPEN 3D ANALYTICS <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Entity Matching Analytics */}
          {matching && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  ENTITY MATCHING CONFIDENCE
                </span>
                <button
                  onClick={() => navigate({ to: "/entity-matching" })}
                  className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1 font-bold"
                >
                  DETAILS <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <div className="text-xl font-bold">{matching.highConfidencePct}%</div>
                  <div className="text-[9px] uppercase mt-0.5">High Conf</div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <div className="text-xl font-bold">{matching.needsReviewPct}%</div>
                  <div className="text-[9px] uppercase mt-0.5">Review</div>
                </div>
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                  <div className="text-xl font-bold">{matching.unresolvedPct}%</div>
                  <div className="text-[9px] uppercase mt-0.5">Unresolved</div>
                </div>
              </div>

              {/* Matching Signals Readout */}
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="text-slate-400 text-[10px] uppercase font-bold">MATCHING SIGNAL METRICS</div>
                {matching.matchingSignals.slice(0, 4).map((sig) => (
                  <div key={sig.signal} className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-300">{sig.signal}</span>
                    <span className="text-teal-300 font-bold">{sig.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Harmonization Pipeline Stages */}
          {pipeline.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-4 w-4" />
                  HARMONIZATION PIPELINE
                </span>
                <button
                  onClick={() => navigate({ to: "/harmonization" })}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
                >
                  VIEW PIPELINE <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                {pipeline.map((stg) => (
                  <div key={stg.stage} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{stg.stage}</span>
                      <span className="text-slate-200 font-bold">{stg.count}/{stg.total} ({stg.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${stg.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Human Verification Analytics */}
          {verification && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  HUMAN VERIFICATION QUEUE
                </span>
                <button
                  onClick={() => navigate({ to: "/verification" })}
                  className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1 font-bold"
                >
                  QUEUE ({verification.pendingReview}) <ExternalLink className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300">
                  <div className="font-bold text-base">{verification.pendingReview}</div>
                  <div className="text-[9px]">Pending</div>
                </div>
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300">
                  <div className="font-bold text-base">{verification.inReview}</div>
                  <div className="text-[9px]">In Review</div>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <div className="font-bold text-base">{verification.approved}</div>
                  <div className="text-[9px]">Approved</div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 5. Governance Notice */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-400 flex items-center gap-2 justify-center">
        <Info className="h-4 w-4 text-teal-400 shrink-0" />
        <span>
          <strong className="text-teal-400">ANALYTICS NOTICE:</strong> Metrics summarize available source observations, quality signals, conflicts, evidence, and verification states for decision support.
        </span>
      </div>

      {/* 6. Export Preview Modal */}
      <AnalyticsExportModal
        isOpen={!!exportPreview}
        data={exportPreview}
        onClose={() => setExportPreview(null)}
      />

    </div>
  );
}
