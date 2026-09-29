import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { executeSpatialQuery, SpatialQueryResponse, STARTER_QUERIES } from "@/lib/api/spatialQuery";
import { SpatialQueryResultCard } from "@/components/spatial-query/SpatialQueryResultCard";
import { MapEngine } from "@/components/maps/MapEngine";
import { CesiumViewer } from "@/components/maps/CesiumViewer";
import { useMapSync } from "@/lib/map/mapSelectionStore";
import { ActiveViewMode } from "@/lib/map/mapTypes";
import { Sparkles, Send, RotateCcw, Search, MessageSquare, Monitor, Columns, Layers, ShieldAlert, CheckCircle2, Info } from "lucide-react";

export const Route = createFileRoute("/_app/spatial-query")({
  validateSearch: (search: Record<string, unknown>) => search,
  head: () => ({
    meta: [
      { title: "Spatial Query Assistant — Bhu Drishti 3D" },
      { name: "description", content: "Natural-Language Spatial Query & GIS Decision-Support Assistant." },
      { property: "og:title", content: "Spatial Query Assistant — Bhu Drishti 3D" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpatialQueryPage,
});

function SpatialQueryPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const { selectedEntityId, activeView, setActiveView, selectEntity } = useMapSync();

  const [queryInput, setQueryInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<SpatialQueryResponse | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  // Initialize query if passed in search param
  useEffect(() => {
    if (searchParams.q && typeof searchParams.q === "string") {
      setQueryInput(searchParams.q);
      handleExecuteQuery(searchParams.q);
    }
  }, [searchParams]);

  const handleExecuteQuery = async (qText: string) => {
    const text = qText.trim();
    if (!text) return;

    setLoading(true);
    try {
      const res = await executeSpatialQuery(text, selectedEntityId || undefined);
      setResponse(res);
      setQueryHistory((prev) => [text, ...prev.filter((item) => item !== text)]);

      // Synchronize selection if entity retrieved
      if (res.plan.targetEntityId) {
        selectEntity(res.plan.targetEntityId, "search");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleExecuteQuery(queryInput);
    }
  };

  // Automated "RUN SPATIAL AI DEMO" Stepped Demonstration
  const handleRunSpatialDemo = async () => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);

    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const demoQueries = [
      "Show PARCEL-DEMO-014.",
      "Which buildings are inside PARCEL-DEMO-014?",
      "Compare Municipal GIS and Survey Dataset for PARCEL-DEMO-014.",
      "What conflicts affect this parcel?",
      "Show supporting evidence for this conflict.",
      "Open 3D Spatial Investigation.",
    ];

    try {
      setActiveView("SPLIT");
      for (const q of demoQueries) {
        setQueryInput(q);
        await handleExecuteQuery(q);
        await sleep(2500);
      }
    } finally {
      setIsDemoRunning(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      
      {/* 1. Header & Command Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-teal-400 font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            BHU-DRISHTI 3D SPATIAL INTELLIGENCE COPILOT
          </div>
          <h1 className="text-2xl font-black font-display text-white mt-1">Natural-Language Spatial Query Assistant</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Ask natural-language questions to query spatial relationships, building extrusions, 3D conflicts, evidence chains, and verification records.
          </p>
        </div>

        {/* SIH Demo Script Action */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleRunSpatialDemo}
            disabled={isDemoRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black shadow-lg shadow-teal-500/20 transition"
          >
            <Sparkles className="h-4 w-4" />
            {isDemoRunning ? "RUNNING AI DEMO..." : "RUN SPATIAL AI DEMO"}
          </button>
        </div>
      </div>

      {/* 2. Natural-Language Input Box */}
      <div className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3 backdrop-blur-xl">
        <div className="relative">
          <textarea
            rows={2}
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a natural-language question e.g. 'Show parcels with geometry conflicts' or 'Which buildings are inside PARCEL-DEMO-014?'"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-28 text-slate-100 font-sans text-sm focus:outline-none focus:border-teal-500"
          />

          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            {queryInput && (
              <button
                onClick={() => setQueryInput("")}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}

            <button
              onClick={() => handleExecuteQuery(queryInput)}
              disabled={loading || !queryInput.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-mono font-bold text-xs shadow-md shadow-teal-500/20 transition"
            >
              <Send className="h-3.5 w-3.5" />
              {loading ? "SEARCHING..." : "ASK"}
            </button>
          </div>
        </div>

        {/* Starter Query Cards */}
        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase">EXAMPLE STARTER QUERIES:</span>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {STARTER_QUERIES.map((sq) => (
              <button
                key={sq}
                onClick={() => {
                  setQueryInput(sq);
                  handleExecuteQuery(sq);
                }}
                className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-teal-300 hover:bg-slate-800 hover:border-teal-500/40 transition"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. View Switcher & Result Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols Wide): Result Card & Details */}
        <div className="lg:col-span-2 space-y-6">
          <SpatialQueryResultCard response={response} onFollowUp={(q) => { setQueryInput(q); handleExecuteQuery(q); }} />

          {/* Query History */}
          {queryHistory.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 font-bold">
                <span>RECENT QUERY HISTORY ({queryHistory.length})</span>
                <button
                  onClick={() => setQueryHistory([])}
                  className="text-[10px] text-slate-500 hover:text-slate-300"
                >
                  CLEAR HISTORY
                </button>
              </div>
              <div className="space-y-1">
                {queryHistory.slice(0, 5).map((hQuery, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setQueryInput(hQuery);
                      handleExecuteQuery(hQuery);
                    }}
                    className="p-2 rounded bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between text-slate-300 hover:text-white transition text-[11px]"
                  >
                    <span className="truncate">&ldquo;{hQuery}&rdquo;</span>
                    <span className="text-[10px] text-teal-400 font-bold">RUN AGAIN</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col Wide): Synchronized 2D/3D Map Canvas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="font-bold text-teal-400 uppercase">Synchronized Canvas</span>
            <div className="flex items-center gap-1">
              {(["2D", "SPLIT", "3D"] as ActiveViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setActiveView(v)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    activeView === v ? "bg-teal-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[480px] w-full rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl">
            {activeView === "2D" && <MapEngine className="w-full h-full" />}
            {activeView === "3D" && (
              <CesiumViewer
                selectedEntity={null}
                onSelectEntity={() => {}}
                layers={{ parcels: true, buildings: true, parcelBoundaries: true, roads: true, referenceFeatures: true, conflictOverlay: true, evidenceOverlay: true, showLabels: true }}
                visualMode="Standard"
                heightScale={1.5}
                buildingFilter={{ minHeight: 0, maxHeight: 50, minFloors: 1, maxFloors: 20, selectedUsages: new Set(), minConfidence: 0.0 }}
                parcelFilter={{ selectedLandUses: new Set(), selectedStatuses: new Set(), minConfidence: 0.0, onlyConflicts: false }}
                isNightMode={true}
              />
            )}
            {activeView === "SPLIT" && (
              <div className="flex h-full w-full">
                <div className="w-1/2 h-full"><MapEngine className="w-full h-full" /></div>
                <div className="w-1/2 h-full">
                  <CesiumViewer
                    selectedEntity={null}
                    onSelectEntity={() => {}}
                    layers={{ parcels: true, buildings: true, parcelBoundaries: true, roads: true, referenceFeatures: true, conflictOverlay: true, evidenceOverlay: true, showLabels: true }}
                    visualMode="Standard"
                    heightScale={1.5}
                    buildingFilter={{ minHeight: 0, maxHeight: 50, minFloors: 1, maxFloors: 20, selectedUsages: new Set(), minConfidence: 0.0 }}
                    parcelFilter={{ selectedLandUses: new Set(), selectedStatuses: new Set(), minConfidence: 0.0, onlyConflicts: false }}
                    isNightMode={true}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 4. Governance Disclaimer */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-400 flex items-center gap-2 justify-center">
        <Info className="h-4 w-4 text-teal-400 shrink-0" />
        <span>
          <strong className="text-teal-400 font-bold">DECISION SUPPORT INTERFACE:</strong> Natural-language queries execute safe structured operations against existing dataset records. AI explanations do not replace authorized human review or official land records.
        </span>
      </div>

    </div>
  );
}
