import React, { useState } from "react";
import { ReportType, ReportConfig, ReportSectionState, REPORT_TEMPLATES } from "@/lib/api/reports";
import { FileText, CheckCircle2, ChevronRight, Sparkles, Layers, Sliders } from "lucide-react";

interface ReportBuilderProps {
  onGenerateReport: (config: ReportConfig) => void;
  isGenerating?: boolean;
}

export function ReportBuilder({ onGenerateReport, isGenerating = false }: ReportBuilderProps) {
  const [selectedType, setSelectedType] = useState<ReportType>("PARCEL_INTELLIGENCE");
  const [targetId, setTargetId] = useState<string>("PARCEL-DEMO-014");
  const [reportTitle, setReportTitle] = useState<string>("");

  const [sections, setSections] = useState<ReportSectionState>({
    executiveSummary: true,
    parcelInfo: true,
    sourceComparison: true,
    geometryMetrics: true,
    buildings: true,
    conflicts: true,
    evidence: true,
    recommendation: true,
    verification: true,
    auditTrail: true,
  });

  const activeTemplate = REPORT_TEMPLATES.find((t) => t.typeId === selectedType) || REPORT_TEMPLATES[0];

  const handleToggleSection = (key: keyof ReportSectionState) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = () => {
    onGenerateReport({
      reportType: selectedType,
      targetId: targetId.trim() || "PARCEL-DEMO-014",
      title: reportTitle.trim() || undefined,
      sections,
    });
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5 text-slate-100 font-sans backdrop-blur-xl">
      
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 font-mono font-bold text-xs text-teal-400">
          <Sliders className="h-4 w-4" />
          INTERACTIVE REPORT BUILDER
        </div>
        <span className="text-[11px] font-mono text-slate-400">Step 1 of 3: Configuration</span>
      </div>

      {/* 1. Select Report Template */}
      <div className="space-y-2">
        <label className="font-mono text-xs font-bold text-slate-300 block">SELECT REPORT TEMPLATE</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 font-mono text-xs">
          {REPORT_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.typeId}
              onClick={() => setSelectedType(tmpl.typeId)}
              className={`p-3 rounded-xl border cursor-pointer transition ${
                selectedType === tmpl.typeId
                  ? "bg-teal-950/60 border-teal-500 shadow-md shadow-teal-500/20"
                  : "bg-slate-950/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700"
              }`}
            >
              <div className="font-bold text-teal-300 text-[11px] flex items-center justify-between">
                <span>{tmpl.name}</span>
                {selectedType === tmpl.typeId && <CheckCircle2 className="h-3.5 w-3.5 text-teal-400" />}
              </div>
              <div className="text-[10px] text-slate-400 font-sans mt-1 line-clamp-2">{tmpl.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Target Entity / Case Picker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
        <div className="space-y-1.5">
          <label className="text-slate-300 font-bold block">TARGET ENTITY / CASE ID</label>
          <input
            type="text"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            placeholder="e.g. PARCEL-DEMO-014 or CNF-3D-001"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs focus:outline-none focus:border-teal-500"
          />
          <span className="text-[10px] text-slate-500">Supported: PARCEL-DEMO-014, CNF-3D-001, BLDG-014-B</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-300 font-bold block">CUSTOM REPORT TITLE (OPTIONAL)</label>
          <input
            type="text"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            placeholder="Leave blank for automatic title"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-sans text-xs focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* 3. Section Toggles */}
      <div className="space-y-2">
        <label className="font-mono text-xs font-bold text-slate-300 block">CONFIGURE REPORT SECTIONS</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11px]">
          {Object.entries(sections).map(([key, val]) => (
            <label
              key={key}
              className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition ${
                val ? "bg-slate-950 border-teal-500/40 text-teal-300" : "bg-slate-950/40 border-slate-800 text-slate-500"
              }`}
            >
              <input
                type="checkbox"
                checked={val}
                onChange={() => handleToggleSection(key as keyof ReportSectionState)}
                className="accent-teal-400 rounded"
              />
              <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Action Button */}
      <div className="pt-2 flex items-center justify-end">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-mono text-xs font-black shadow-lg shadow-teal-500/20 transition"
        >
          <Sparkles className="h-4 w-4" />
          {isGenerating ? "GENERATING REPORT..." : "GENERATE REPORT PREVIEW"}
        </button>
      </div>

    </div>
  );
}
