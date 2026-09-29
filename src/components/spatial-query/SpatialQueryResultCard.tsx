import React from "react";
import { SpatialQueryResponse } from "@/lib/api/spatialQuery";
import { Database, Calculator, Sparkles, ExternalLink, ShieldAlert, Layers, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMapSync } from "@/lib/map/mapSelectionStore";

interface SpatialQueryResultCardProps {
  response: SpatialQueryResponse | null;
  onFollowUp: (q: string) => void;
}

export function SpatialQueryResultCard({ response, onFollowUp }: SpatialQueryResultCardProps) {
  const navigate = useNavigate();
  const { selectEntity } = useMapSync();

  if (!response) return null;

  const { query, intent, plan, result, suggestedFollowUps, status } = response;
  const targetId = plan.targetEntityId || "PARCEL-DEMO-014";

  const handleFocus2D = () => {
    selectEntity(targetId, "search");
    navigate({ to: "/intelligence-3d", search: { parcel: targetId, view: "2D" } });
  };

  const handleFocus3D = () => {
    selectEntity(targetId, "search");
    navigate({ to: "/intelligence-3d", search: { parcel: targetId, view: "3D" } });
  };

  const handleOpenConflict = () => {
    selectEntity(targetId, "search");
    navigate({ to: "/conflicts", search: { conflict: "CNF-3D-001" } });
  };

  const handleGenerateReport = () => {
    navigate({ to: "/reports", search: { target: targetId, template: "PARCEL_INTELLIGENCE" } });
  };

  return (
    <div className="w-full bg-slate-900/90 border border-teal-500/40 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-100 font-sans backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* 1. Header Query & Intent Badge */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-500/15 border border-teal-500/40 text-teal-300">
              INTENT: {intent}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                status === "SUCCESS"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40"
                  : "bg-amber-500/15 text-amber-400 border border-amber-500/40"
              }`}
            >
              {status}
            </span>
          </div>
          <h2 className="text-base font-bold font-display text-white mt-1.5">&ldquo;{query}&rdquo;</h2>
        </div>

        <div className="text-right font-mono text-[11px] text-slate-400">
          Target Entity: <span className="text-teal-300 font-bold">{targetId}</span>
        </div>
      </div>

      {/* 2. Three-Part Transparency Model (DATA | CALCULATION | EXPLANATION) */}
      <div className="space-y-4">
        
        {/* A. RETRIEVED DATA RECORDS */}
        <div className="space-y-2">
          <div className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="h-4 w-4" />
            1. RETRIEVED DATA RECORDS (SOURCE FACTS)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            {result.dataRecords.map((rec, i) => (
              <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 space-y-1">
                {Object.entries(rec).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 capitalize">{k}:</span>
                    <span className="text-slate-100 font-bold">{String(v)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* B. DETERMINISTIC SPATIAL CALCULATIONS */}
        {Object.keys(result.calculations).length > 0 && (
          <div className="space-y-2">
            <div className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="h-4 w-4" />
              2. DETERMINISTIC GEOSPATIAL CALCULATIONS
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              {Object.entries(result.calculations).map(([k, v]) => (
                <div key={k} className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 capitalize">{k.replace(/([A-Z])/g, " $1")}</div>
                  <div className="text-sm font-bold text-amber-300 mt-0.5">{String(v)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* C. EVIDENCE-GROUNDED AI EXPLANATION */}
        <div className="space-y-2">
          <div className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            3. GROUNDED AI EXPLANATION
          </div>
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 font-sans text-xs text-slate-200 leading-relaxed shadow-inner">
            {result.explanation}
          </div>
        </div>

        {/* Evidence References Chips */}
        {result.evidenceReferences.length > 0 && (
          <div className="flex items-center gap-2 font-mono text-xs pt-1">
            <span className="text-slate-400 text-[11px] font-bold">SUPPORTING EVIDENCE REFS:</span>
            {result.evidenceReferences.map((refId) => (
              <Link
                key={refId}
                to="/evidence"
                className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold hover:bg-purple-500/20 transition"
              >
                {refId}
              </Link>
            ))}
          </div>
        )}

      </div>

      {/* 3. Result Quick Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 font-mono text-xs">
        <button
          onClick={handleFocus2D}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-500/25 transition"
        >
          <Layers className="h-3.5 w-3.5" />
          FOCUS 2D MAP
        </button>

        <button
          onClick={handleFocus3D}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-300 font-bold hover:bg-purple-500/25 transition"
        >
          <Sparkles className="h-3.5 w-3.5" />
          FOCUS 3D SCENE
        </button>

        <button
          onClick={handleOpenConflict}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-500/25 transition"
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          OPEN CONFLICT
        </button>

        <button
          onClick={handleGenerateReport}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-md shadow-teal-500/20 transition"
        >
          <FileText className="h-3.5 w-3.5" />
          GENERATE REPORT
        </button>
      </div>

      {/* 4. Contextual Suggested Follow-up Questions */}
      {suggestedFollowUps.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="font-mono text-[11px] text-slate-400 font-bold">SUGGESTED FOLLOW-UP QUESTIONS:</div>
          <div className="flex flex-wrap gap-2 font-mono text-[11px]">
            {suggestedFollowUps.map((q) => (
              <button
                key={q}
                onClick={() => onFollowUp(q)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-teal-300 hover:bg-slate-800 hover:border-teal-500/40 transition"
              >
                <span>{q}</span>
                <ArrowRight className="h-3 w-3 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
