import React from "react";
import { LayerVisibilityState, VisualMode } from "@/lib/maps/cesium/types";
import { Layers, Eye, EyeOff, ShieldAlert, Sparkles, Box, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/i18n/languageStore";

interface CesiumLayersProps {
  layers: LayerVisibilityState;
  onToggleLayer: (layerKey: keyof LayerVisibilityState) => void;
  activeMode: VisualMode;
  onChangeMode: (mode: VisualMode) => void;
}

export function CesiumLayers({ layers, onToggleLayer, activeMode, onChangeMode }: CesiumLayersProps) {
  const { t } = useLanguage();

  const layerItems: Array<{ key: keyof LayerVisibilityState; label: string; icon: any }> = [
    { key: "parcels", label: t("layers.cadastral"), icon: MapPin },
    { key: "buildings", label: t("layers.buildings"), icon: Box },
    { key: "parcelBoundaries", label: t("layers.municipal"), icon: Layers },
    { key: "roads", label: t("layers.survey"), icon: Layers },
    { key: "referenceFeatures", label: t("layers.evidence"), icon: Sparkles },
    { key: "conflictOverlay", label: t("layers.conflicts"), icon: ShieldAlert },
    { key: "evidenceOverlay", label: t("layers.baseLayer"), icon: Sparkles },
  ];

  const modes: VisualMode[] = ["Standard", "Height", "Confidence", "Source", "Conflict"];

  return (
    <div className="w-64 bg-slate-950/95 border border-teal-500/30 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl text-slate-200 space-y-4 font-sans">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
        <Layers className="h-4 w-4 text-teal-400" />
        <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-slate-100">{t("layers.title")}</h3>
      </div>

      {/* Layer Visibility Controls */}
      <div className="space-y-1.5">
        {layerItems.map((item) => {
          const isVisible = layers[item.key];
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onToggleLayer(item.key)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition ${
                isVisible
                  ? "bg-slate-900 text-slate-100 border border-slate-700/60"
                  : "bg-slate-950/40 text-slate-500 border border-transparent hover:text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-3.5 w-3.5 ${isVisible ? "text-teal-400" : "text-slate-600"}`} />
                <span>{item.label}</span>
              </div>
              {isVisible ? <Eye className="h-3.5 w-3.5 text-teal-400" /> : <EyeOff className="h-3.5 w-3.5 text-slate-600" />}
            </button>
          );
        })}
      </div>

      {/* Visual Modes Selector */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <label className="block text-[11px] font-mono font-bold tracking-wider uppercase text-teal-400">
          Visual Rendering Mode
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => onChangeMode(m)}
              className={`px-2 py-1.5 rounded text-[11px] font-mono transition text-center ${
                activeMode === m
                  ? "bg-teal-500/20 border border-teal-500/40 text-teal-300 font-bold"
                  : "bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
