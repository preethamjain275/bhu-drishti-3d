import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { health, healthLabel, healthTone, statusMeta, type Dataset } from "@/lib/datasets";
import { IngestionVisual, MiniMap } from "./MiniMap";
import { Progress } from "@/components/ui/progress";

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-3 py-1.5 text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-mono text-xs text-ivory">{v}</dd></div>;
}

export function DatasetDetail({ d, showMap = true }: { d: Dataset; showMap?: boolean }) {
  const stage = d.status === "ready" ? 3 : Math.min(3, Math.floor(d.progress / 30));
  return (
    <div className="space-y-5">
      <div>
        <p className="label-technical">{d.source}</p>
        <h3 className="mt-1 font-display text-lg font-bold text-ivory">{d.name}</h3>
        <p className={cn("mt-1 text-xs font-semibold", statusMeta[d.status].tone)}>● {statusMeta[d.status].label} · {d.processingStage}</p>
      </div>
      {showMap && <MiniMap seed={d.seed} dense className="h-44 w-full" />}
      {d.status !== "ready" && d.status !== "queued" && (
        <section aria-label="Ingestion progress" className="space-y-2">
          <IngestionVisual stage={stage} />
          <Progress value={d.progress} className="h-1.5" />
        </section>
      )}
      {!d.crs && (
        <p className="flex gap-2 rounded-lg border border-saffron/40 bg-saffron/5 p-3 text-xs text-saffron"><TriangleAlert className="h-4 w-4 shrink-0" />Spatial reference information could not be confidently identified. Review CRS before alignment.</p>
      )}
      <section><p className="label-technical mb-1">Identity</p><dl className="divide-y divide-border"><Row k="Type" v={d.kind} /><Row k="Format" v={d.format} /><Row k="Records" v={d.recordCount?.toLocaleString() ?? "—"} /></dl></section>
      <section><p className="label-technical mb-1">Spatial</p><dl className="divide-y divide-border"><Row k="CRS" v={d.crs ?? "Requires confirmation"} /><Row k="Bounding box" v={d.boundingBox.some(Boolean) ? d.boundingBox.join(", ") : "Pending"} /><Row k="Geometry" v={d.geometryType} /><Row k="Units" v={d.units} /></dl></section>
      <section>
        <p className="label-technical mb-2">Dataset health · illustrative</p>
        <ul className="space-y-2">
          {health(d).map((h) => (
            <li key={h.key} className="flex items-center gap-3 text-sm">
              <span className={cn("h-2 w-2 rounded-full", healthTone[h.state])} aria-hidden />
              <span className="flex-1">{h.label}</span>
              <span className="font-mono text-xs text-muted-foreground">{h.value}</span>
              <span className="w-24 text-right text-xs">{healthLabel[h.state]}</span>
            </li>
          ))}
        </ul>
      </section>
      <section><p className="label-technical mb-1">Source authority</p><dl className="divide-y divide-border"><Row k="Authority" v={d.authorityLevel} /><Row k="Survey method" v={d.surveyMethod} /><Row k="Capture date" v={d.captureDate} /><Row k="Spatial accuracy" v={d.spatialAccuracy} /></dl>
        <p className="mt-2 text-xs text-muted-foreground">Authority weights conflict resolution later — it does not mark a source as “correct”.</p></section>
    </div>
  );
}
