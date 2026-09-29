import React, { useState } from "react";
import { ThreeDConflict, SourceCompareMode } from "@/lib/maps/cesium/types";
import { X, ShieldAlert, Database, Check, Edit3, XCircle, Clock, Eye, Minimize2, Maximize2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/languageStore";

interface CesiumConflictInvestigatorProps {
  conflict: ThreeDConflict | null;
  compareMode: SourceCompareMode;
  onChangeCompareMode: (mode: SourceCompareMode) => void;
  onClose: () => void;
  onCreateSnapshot: () => void;
}

export function CesiumConflictInvestigator({
  conflict,
  compareMode,
  onChangeCompareMode,
  onClose,
  onCreateSnapshot,
}: CesiumConflictInvestigatorProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"EVIDENCE" | "DETAILS">("EVIDENCE");
  const [actionStatus, setActionStatus] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  if (!conflict) return null;

  if (isMinimized) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/90 border border-red-500/50 shadow-2xl backdrop-blur-xl text-slate-100 font-mono text-xs animate-in fade-in">
        <ShieldAlert className="h-4 w-4 text-red-400" />
        <span className="font-bold text-red-300">{conflict.conflictId}</span>
        <span className="text-slate-400">({conflict.entityId})</span>
        <button
          onClick={() => setIsMinimized(false)}
          className="ml-2 p-1 rounded hover:bg-slate-800 text-teal-300 font-bold"
          title="Expand Panel"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          title="Close Panel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-[340px] sm:w-[370px] bg-slate-950/95 border border-teal-500/30 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl text-slate-100 space-y-3.5 max-h-[calc(100vh-8rem)] overflow-y-auto font-sans animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* 1. Header Tabs & Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("EVIDENCE")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition ${
              activeTab === "EVIDENCE"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Evidence & Harmonization
          </button>
          <button
            onClick={() => setActiveTab("DETAILS")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition ${
              activeTab === "DETAILS"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Details
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Minimize to floating pill"
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Red Geometry Conflict Detected Alert Banner */}
      <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-2.5 flex items-start gap-2.5">
        <div className="h-7 w-7 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center shrink-0 text-red-400">
          <ShieldAlert className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-red-300 uppercase tracking-wide flex items-center gap-1">
            {t("conflict.detected")}
          </h4>
          <p className="text-[10px] text-red-200/80 mt-0.5 leading-snug">
            {t("conflict.subtitle")}
          </p>
        </div>
      </div>

      {/* 3. Selected Parcel Details */}
      <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 font-mono text-xs">
        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t("parcel.selected")}</div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">{t("parcel.id")}</span>
          <span className="font-bold text-slate-100">{conflict.entityId || "P-10482"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">{t("parcel.area")}</span>
          <span className="font-bold text-teal-300">12,438.6 m²</span>
        </div>
      </div>

      {/* 4. Source Details Breakdown */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>{t("sources.title")}</span>
          <span className="text-[9px] text-teal-400">3 SOURCES</span>
        </div>
        <div className="space-y-1 font-mono text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <div>
                <div className="font-bold text-slate-200 text-[11px]">{t("sources.revenue")}</div>
                <div className="text-[8px] text-slate-500">2026-08-14 10:32</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-200 text-xs">12,438.6 m²</span>
              <Eye className="h-3 w-3 text-slate-500 cursor-pointer hover:text-teal-300" />
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <div>
                <div className="font-bold text-slate-200 text-[11px]">{t("sources.municipal")}</div>
                <div className="text-[8px] text-slate-500">2026-08-12 16:20</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-200 text-xs">12,441.9 m²</span>
              <Eye className="h-3 w-3 text-slate-500 cursor-pointer hover:text-teal-300" />
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              <div>
                <div className="font-bold text-slate-200 text-[11px]">{t("sources.survey")}</div>
                <div className="text-[8px] text-slate-500">2026-08-10 09:15</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-200 text-xs">12,426.1 m²</span>
              <Eye className="h-3 w-3 text-slate-500 cursor-pointer hover:text-teal-300" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Conflict Information */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{t("conflict.info")}</div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">{t("conflict.type")}</span>
            <span className="font-bold text-slate-200">Geometry (Boundary Shift)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t("conflict.discrepancy")}</span>
            <span className="font-bold text-amber-400">2.8 m</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">{t("conflict.confidence")}</span>
              <span className="font-bold text-teal-300">87%</span>
            </div>
            <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-teal-400 rounded-full" style={{ width: "87%" }} />
            </div>
          </div>
          <div className="flex justify-between pt-0.5">
            <span className="text-slate-400">{t("conflict.status")}</span>
            <span className="font-bold text-amber-400 flex items-center gap-1 text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Pending Human Review
            </span>
          </div>
        </div>
      </div>

      {/* 6. AI Explanation & Recommendation */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
          <Database className="h-3 w-3" /> AI EXPLANATION
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-teal-500/30 space-y-1.5 text-xs">
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Detected a <strong>2.8m northern offset</strong> between Municipal Cadastral GIS and State Property Registry. Drone Survey confirms Municipal setback with <strong>98% confidence</strong>.
          </p>
          <div className="p-2 rounded-lg bg-teal-950/40 border border-teal-500/40 text-[10px] font-mono text-teal-200">
            <strong>RECOMMENDED:</strong> 2,450.0 m² (Confidence 96.4%)
          </div>
        </div>
      </div>

      {/* Action Notification */}
      {actionStatus && (
        <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold text-center animate-in fade-in">
          ✓ Logged: {actionStatus} (#AUD-{Date.now().toString().slice(-6)})
        </div>
      )}

      {/* 7. Human Verification Action Buttons */}
      <div className="space-y-1.5 pt-1 border-t border-slate-800">
        <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          HUMAN VERIFICATION
        </div>
        <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
          <button
            onClick={() => setActionStatus("ACCEPTED & HARMONIZED")}
            className="flex items-center justify-center gap-1 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition shadow-lg shadow-teal-500/20 cursor-pointer text-xs"
          >
            <Check className="h-3.5 w-3.5" />
            {t("action.accept")}
          </button>

          <button
            onClick={() => setActionStatus("MODIFICATION REQUESTED")}
            className="flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold transition cursor-pointer text-xs"
          >
            <Edit3 className="h-3.5 w-3.5 text-cyan-400" />
            {t("action.modify")}
          </button>

          <button
            onClick={() => setActionStatus("REJECTED")}
            className="flex items-center justify-center gap-1 py-2 rounded-xl bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-300 font-bold transition cursor-pointer text-xs"
          >
            <XCircle className="h-3.5 w-3.5 text-red-400" />
            {t("action.reject")}
          </button>

          <button
            onClick={() => setActionStatus("DEFERRED")}
            className="flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 font-bold transition cursor-pointer text-xs"
          >
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            {t("action.defer")}
          </button>
        </div>
      </div>

    </div>
  );
}
