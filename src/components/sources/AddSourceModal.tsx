import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Database,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import {
  startDemoIngestion,
  type SourceType,
  type FileFormat,
  type DataSource,
} from "@/lib/api/sources";

interface AddSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSourceAdded: (source: DataSource) => void;
}

const FILE_FORMATS: Array<{ label: string; value: FileFormat; icon: string }> = [
  { label: "GeoJSON (.geojson / .json)", value: "GeoJSON", icon: "🌐" },
  { label: "Shapefile (.zip containing .shp, .dbf, .prj)", value: "Shapefile", icon: "📦" },
  { label: "CSV / Tabular (.csv)", value: "CSV", icon: "📊" },
  { label: "Keyhole Markup Language (.kml / .kmz)", value: "KML", icon: "📍" },
  { label: "OGC GeoPackage (.gpkg)", value: "GeoPackage", icon: "🗄️" },
  { label: "Geospatial Raster (GeoTIFF Placeholder)", value: "GeoTIFF", icon: "🛰️" },
];

const STAGES = [
  "SELECT FILE",
  "READ METADATA",
  "VALIDATE",
  "DETECT CRS",
  "DETECT SCHEMA",
  "CHECK GEOMETRY",
  "READY FOR HARMONIZATION",
] as const;

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  open,
  onOpenChange,
  onSourceAdded,
}) => {
  const [sourceName, setSourceName] = useState("State Cadastral Sector 9");
  const [filename, setFilename] = useState("cadastral_sector9.geojson");
  const [sourceType, setSourceType] = useState<SourceType>("Government GIS");
  const [format, setFormat] = useState<FileFormat>("GeoJSON");
  const [crs, setCrs] = useState("EPSG:4326");

  const [isIngesting, setIsIngesting] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [detectedMeta, setDetectedMeta] = useState<{
    crs?: string;
    geometry?: string;
    features?: number;
    schemaCount?: number;
  } | null>(null);

  const handleRunIngestion = async (customFile?: { name: string; format: FileFormat; crs: string }) => {
    setIsIngesting(true);
    setProgress(5);
    setCurrentStageIndex(0);
    setDetectedMeta(null);

    const ingName = customFile ? customFile.name : sourceName;
    const ingFile = customFile ? `${customFile.name.toLowerCase().replace(/\s+/g, "_")}.${customFile.format.toLowerCase()}` : filename;
    const ingFormat = customFile ? customFile.format : format;
    const ingCrs = customFile ? customFile.crs : crs;

    // Simulate multi-step ingestion timeline
    for (let stageIdx = 0; stageIdx < STAGES.length; stageIdx++) {
      setCurrentStageIndex(stageIdx);
      const stageProgress = Math.round(((stageIdx + 1) / STAGES.length) * 100);
      setProgress(stageProgress);

      if (stageIdx === 2) {
        // Validation step
        setDetectedMeta({
          crs: ingCrs,
          geometry: "Polygon / MultiPolygon",
          features: 1420,
          schemaCount: 5,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    // Call API helper
    const newSrc = await startDemoIngestion({
      filename: ingFile,
      sourceName: ingName,
      sourceType: sourceType,
      format: ingFormat,
      crs: ingCrs,
    });

    setIsIngesting(false);
    onSourceAdded(newSrc);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-cyan-500/30 bg-slate-950 text-slate-100 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="font-display text-lg text-slate-100">
                ADD GEOSPATIAL DATA SOURCE
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Register geospatial vectors, cadastral maps, or attribute tables into the ingestion pipeline.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="my-2 rounded-lg border border-amber-500/30 bg-amber-950/20 px-3 py-2 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              <strong>SYNTHETIC DEMONSTRATION INGESTION:</strong> Processes files through a local GIS validation simulator. No real server upload.
            </span>
          </div>
        </div>

        {!isIngesting ? (
          <div className="space-y-4 py-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Source Name</Label>
                <Input
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. Municipal Ward 18 GIS"
                  className="h-9 border-slate-800 bg-slate-900/80 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Source Category</Label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as SourceType)}
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/80 px-3 text-xs text-slate-200"
                >
                  <option value="Government GIS">Government GIS</option>
                  <option value="Land Registry">Land Registry</option>
                  <option value="Survey">Survey</option>
                  <option value="Planning">Planning</option>
                  <option value="Drone Imagery">Drone Imagery</option>
                  <option value="Satellite">Satellite</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-300">Supported File Format</Label>
              <div className="grid grid-cols-2 gap-2">
                {FILE_FORMATS.map((fmt) => (
                  <button
                    key={fmt.value}
                    type="button"
                    onClick={() => {
                      setFormat(fmt.value);
                      if (fmt.value === "GeoJSON") setFilename("cadastral_sector9.geojson");
                      else if (fmt.value === "Shapefile") setFilename("cadastral_sector9.zip");
                      else if (fmt.value === "CSV") setFilename("land_attributes.csv");
                      else if (fmt.value === "KML") setFilename("boundary_kml.kml");
                      else if (fmt.value === "GeoPackage") setFilename("district_layers.gpkg");
                      else setFilename("aerial_survey.tif");
                    }}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                      format === fmt.value
                        ? "border-cyan-500 bg-cyan-950/40 text-cyan-200 shadow"
                        : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span>{fmt.icon}</span>
                    <span className="font-semibold truncate">{fmt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Declared CRS / Reference</Label>
                <select
                  value={crs}
                  onChange={(e) => setCrs(e.target.value)}
                  className="h-9 w-full rounded-md border border-slate-800 bg-slate-900/80 px-3 text-xs text-slate-200 font-mono"
                >
                  <option value="EPSG:4326">EPSG:4326 (WGS 84 / Geographic)</option>
                  <option value="EPSG:32643">EPSG:32643 (UTM Zone 43N)</option>
                  <option value="EPSG:32644">EPSG:32644 (UTM Zone 44N)</option>
                  <option value="EPSG:7755">EPSG:7755 (WGS 84 / India Zone IV)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">File Name Placeholder</Label>
                <Input
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="h-9 border-slate-800 bg-slate-900/80 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-cyan-300">
                <span>STAGE: {STAGES[currentStageIndex]}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-3 bg-slate-900" />
            </div>

            {/* Stepper Pipeline */}
            <div className="grid grid-cols-7 gap-1 text-[10px]">
              {STAGES.map((stg, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div
                    key={stg}
                    className={`flex flex-col items-center justify-center p-2 rounded text-center border font-mono transition-all ${
                      isPassed
                        ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                        : isCurrent
                        ? "border-cyan-500 bg-cyan-950/60 text-cyan-200 animate-pulse font-bold"
                        : "border-slate-800 bg-slate-900/40 text-slate-600"
                    }`}
                  >
                    <span className="text-xs mb-1">
                      {isPassed ? "✓" : isCurrent ? "⚙" : idx + 1}
                    </span>
                    <span className="leading-tight">{stg}</span>
                  </div>
                );
              })}
            </div>

            {detectedMeta && (
              <div className="rounded-lg border border-cyan-500/30 bg-slate-900/80 p-3 text-xs space-y-1.5 font-mono">
                <div className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>METADATA & SCHEMA DETECTED</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>CRS: <span className="text-cyan-300">{detectedMeta.crs}</span></div>
                  <div>Geometry: <span className="text-cyan-300">{detectedMeta.geometry}</span></div>
                  <div>Features: <span className="text-cyan-300">{detectedMeta.features}</span></div>
                  <div>Schema Fields: <span className="text-cyan-300">{detectedMeta.schemaCount} detected</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="border-t border-slate-800 pt-3 flex items-center justify-between sm:justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={isIngesting}
            onClick={() => onOpenChange(false)}
            className="border-slate-800 text-slate-400"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={isIngesting}
              onClick={() =>
                handleRunIngestion({
                  name: "Quick Demo Ground Survey SP-2026",
                  format: "GeoJSON",
                  crs: "EPSG:32643",
                })
              }
              className="bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900 text-xs"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-indigo-400" />
              RUN DEMO INGESTION
            </Button>

            <Button
              size="sm"
              disabled={isIngesting}
              onClick={() => handleRunIngestion()}
              className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs shadow-md"
            >
              Start Ingestion Pipeline
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
