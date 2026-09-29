import { useRef, useState } from "react";
import { Check, FileUp, TriangleAlert, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { sourceTypeLabel, type Dataset, type SourceType } from "@/lib/datasets";

const FORMATS: Record<string, { label: string; kind: Dataset["kind"]; crs: string | null; geom: string }> = {
  geojson: { label: "GeoJSON", kind: "Vector", crs: "EPSG:4326", geom: "Polygon" },
  json: { label: "GeoJSON", kind: "Vector", crs: "EPSG:4326", geom: "Polygon" },
  zip: { label: "Shapefile", kind: "Vector", crs: null, geom: "Polygon" },
  shp: { label: "Shapefile", kind: "Vector", crs: null, geom: "Polygon" },
  gpkg: { label: "GeoPackage", kind: "Vector", crs: null, geom: "Polygon" },
  tif: { label: "GeoTIFF", kind: "Raster", crs: null, geom: "Raster grid" },
  tiff: { label: "GeoTIFF", kind: "Raster", crs: null, geom: "Raster grid" },
  csv: { label: "CSV", kind: "Tabular", crs: null, geom: "Point" },
  dxf: { label: "DXF (CAD)", kind: "Vector", crs: null, geom: "LineString" },
  dwg: { label: "DWG (CAD)", kind: "Vector", crs: null, geom: "LineString" },
};
const STEPS = ["Source type", "Upload", "Details", "Spatial reference", "Review"];

type Upload = { file: File; progress: number; state: "uploading" | "done" | "error" };

export function AddDataSource({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (d: Dataset) => void }) {
  const mobile = useIsMobile();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<SourceType | null>(null);
  const [up, setUp] = useState<Upload | null>(null);
  const [info, setInfo] = useState({ name: "", org: "", desc: "", capture: "" });
  const [crs, setCrs] = useState("");
  const timer = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ext = up?.file.name.split(".").pop()?.toLowerCase() ?? "";
  const fmt = FORMATS[ext];

  const reset = () => { setStep(0); setType(null); setUp(null); setInfo({ name: "", org: "", desc: "", capture: "" }); setCrs(""); };

  const startUpload = (file: File) => {
    if (!FORMATS[file.name.split(".").pop()?.toLowerCase() ?? ""]) { setUp({ file, progress: 0, state: "error" }); return; }
    setUp({ file, progress: 0, state: "uploading" });
    if (!info.name) setInfo((i) => ({ ...i, name: file.name.replace(/\.[^.]+$/, "") }));
    timer.current = window.setInterval(() => {
      setUp((u) => {
        if (!u || u.state !== "uploading") return u;
        const p = Math.min(100, u.progress + 12);
        if (p === 100 && timer.current) clearInterval(timer.current);
        return { ...u, progress: p, state: p === 100 ? "done" : "uploading" };
      });
    }, 150);
  };
  const cancel = () => { if (timer.current) clearInterval(timer.current); setUp(null); };

  const finalCrs = fmt?.crs ?? (crs || null);
  const canNext = [!!type, up?.state === "done", !!info.name && !!info.org, true, true][step];

  const submit = () => {
    if (!type || !up || !fmt) return;
    const now = new Date().toISOString();
    onAdd({
      id: `ds-${Date.now()}`, name: info.name, source: `${info.org} (user upload)`, sourceType: type, kind: fmt.kind,
      format: fmt.label, crs: finalCrs, geometryType: fmt.geom, recordCount: null, captureDate: info.capture || now.slice(0, 10),
      uploadedAt: now, updatedAt: now, status: finalCrs ? "processing" : "crs-review", processingStage: finalCrs ? "Ingestion" : "Spatial reference",
      progress: 5, authorityLevel: "Medium", surveyMethod: "Digitized", spatialAccuracy: "Not assessed", metadataCompleteness: info.desc ? 70 : 40,
      geometryValidity: 0, attributeCompleteness: 0, boundingBox: [0, 0, 0, 0], units: finalCrs === "EPSG:4326" ? "degrees" : finalCrs ? "metres" : "unknown",
      createdBy: "You (demo session)", seed: Math.floor(Math.random() * 50),
    });
    onOpenChange(false); reset();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { cancel(); reset(); } }}>
      <SheetContent side={mobile ? "bottom" : "right"} className={cn("flex flex-col gap-0 p-0 sm:max-w-lg", mobile && "h-[92dvh] rounded-t-2xl")}>
        <SheetHeader className="border-b border-border p-5">
          <p className="label-technical">Step {step + 1} of 5 · {STEPS[step]}</p>
          <SheetTitle className="font-display text-ivory">Add data source</SheetTitle>
          <SheetDescription>Ingestion is simulated in this demo — files are not processed or stored.</SheetDescription>
          <div className="mt-2 flex gap-1">{STEPS.map((s, i) => <span key={s} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-border")} />)}</div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-slim">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(sourceTypeLabel) as SourceType[]).map((t) => (
                <button key={t} onClick={() => setType(t)} className={cn("min-h-14 rounded-lg border p-3 text-left text-sm transition-colors", type === t ? "border-primary bg-primary/10 text-ivory" : "border-border hover:border-primary/50")}>
                  {sourceTypeLabel[t]}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <button
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) startUpload(f); }}
                className="spatial-grid flex min-h-48 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary/40 p-6 text-center hover:border-primary"
              >
                <FileUp className="h-8 w-8 text-primary" />
                <span className="font-display font-bold text-ivory">Drop geospatial data here</span>
                <span className="text-xs text-muted-foreground">or tap to choose a file</span>
                <span className="flex flex-wrap justify-center gap-1">{["GeoJSON", "SHP (.zip)", "GPKG", "GeoTIFF", "CSV", "CAD"].map((f) => <span key={f} className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">{f}</span>)}</span>
              </button>
              <input ref={inputRef} type="file" className="sr-only" aria-label="Choose dataset file" onChange={(e) => { const f = e.target.files?.[0]; if (f) startUpload(f); e.target.value = ""; }} />
              {up && (
                <div className={cn("rounded-lg border p-3", up.state === "error" ? "border-conflict/50" : "border-border")}>
                  <div className="flex items-center gap-2 text-sm">
                    {up.state === "error" ? <TriangleAlert className="h-4 w-4 text-conflict" /> : up.state === "done" ? <Check className="h-4 w-4 text-verified" /> : <FileUp className="h-4 w-4 text-primary" />}
                    <span className="flex-1 truncate">{up.file.name}</span>
                    <Button size="icon" variant="ghost" className="h-9 w-9" onClick={cancel} aria-label="Cancel upload"><X className="h-4 w-4" /></Button>
                  </div>
                  {up.state === "error" ? (
                    <p className="mt-1 text-xs text-conflict">This dataset format could not be interpreted. Try one of the supported formats above.</p>
                  ) : (
                    <>
                      <Progress value={up.progress} className="mt-2 h-1.5" />
                      <p className="mt-1 text-xs text-muted-foreground">{up.state === "done" ? `Validated as ${fmt?.label}` : `Uploading… ${up.progress}%`}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {([["name", "Dataset name"], ["org", "Source organization"]] as const).map(([k, l]) => (
                <div key={k}><Label htmlFor={k}>{l}</Label><Input id={k} className="mt-1 h-11" value={info[k]} onChange={(e) => setInfo({ ...info, [k]: e.target.value })} /></div>
              ))}
              <div><Label htmlFor="desc">Description</Label><Textarea id="desc" className="mt-1" value={info.desc} onChange={(e) => setInfo({ ...info, desc: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label htmlFor="cap">Capture date</Label><Input id="cap" type="date" className="mt-1 h-11" value={info.capture} onChange={(e) => setInfo({ ...info, capture: e.target.value })} /></div>
                <div><Label>Upload date</Label><p className="mt-3 font-mono text-sm">{new Date().toISOString().slice(0, 10)}</p></div>
              </div>
              <p className="text-xs text-muted-foreground">Data type: <span className="text-ivory">{fmt?.kind}</span></p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {fmt?.crs ? (
                <p className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">GeoJSON declares WGS 84 by specification. Treated as <b>declared</b>, not verified.</p>
              ) : (
                <div className="rounded-lg border border-saffron/40 bg-saffron/5 p-3 text-sm">
                  <p className="flex items-center gap-2 font-bold text-saffron"><TriangleAlert className="h-4 w-4" />CRS requires confirmation</p>
                  <p className="mt-1 text-muted-foreground">Spatial reference information could not be confidently identified. Enter it if known, or leave blank to flag for review.</p>
                  <Input className="mt-2 h-11 font-mono" placeholder="e.g. EPSG:32643" value={crs} onChange={(e) => setCrs(e.target.value)} />
                </div>
              )}
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {[["Detected CRS", finalCrs ?? "Unknown"], ["Units", finalCrs === "EPSG:4326" ? "degrees" : finalCrs ? "metres" : "Unknown"], ["Coordinate system", finalCrs === "EPSG:4326" ? "Geographic" : finalCrs ? "Projected" : "Unknown"], ["Bounding area", "Computed after ingestion"], ["Geometry type", fmt?.geom ?? "—"]].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border p-2"><dt className="label-technical">{k}</dt><dd className="mt-1 font-mono text-xs">{v}</dd></div>
                ))}
              </dl>
            </div>
          )}

          {step === 4 && (
            <dl className="divide-y divide-border rounded-xl border border-border">
              {[["Dataset", info.name], ["Source", `${info.org} · ${type ? sourceTypeLabel[type] : ""}`], ["Format", fmt?.label], ["CRS", finalCrs ?? "Requires confirmation"], ["Geometry", fmt?.geom], ["Records", "Counted during ingestion"], ["Timestamp", new Date().toLocaleString()]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 p-3 text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-mono text-xs text-ivory">{v}</dd></div>
              ))}
            </dl>
          )}
        </div>

        <div className="safe-bottom flex gap-2 border-t border-border p-4">
          <Button variant="outline" className="h-11 flex-1" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
          {step < 4 ? (
            <Button className="h-11 flex-1" disabled={!canNext} onClick={() => setStep(step + 1)}>Continue</Button>
          ) : (
            <Button className="h-11 flex-1" onClick={submit}>Add to BhuSetu</Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
