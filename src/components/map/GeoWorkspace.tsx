import { useCallback, useEffect, useRef, useState } from "react";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Box, Crosshair, Layers, Minus, Plus, Ruler, Search, SplitSquareHorizontal, X, Compass, Loader2,
  PenTool, Check, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { CENTER, layerDefs, spatialRepository, type LayerId, type ParcelProps } from "@/lib/spatial-demo";

/** Resolve a CSS color token (oklch) to rgb for MapLibre. */
function token(name: string) {
  const c = document.createElement("canvas").getContext("2d")!;
  c.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#888";
  c.fillRect(0, 0, 1, 1);
  const [r, g, b] = c.getImageData(0, 0, 1, 1).data;
  return `rgb(${r},${g},${b})`;
}

const BASEMAPS = {
  dark: { label: "Dark", url: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}" },
  light: { label: "Light", url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png" },
  imagery: { label: "Imagery", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" },
} as const;
type Basemap = keyof typeof BASEMAPS;

const LAYER_MAP: Record<LayerId, string[]> = {
  ward: ["ward-line"], revenue: ["revenue-fill", "revenue-line"], municipal: ["municipal-line"],
  diff: ["diff-fill"], buildings: ["buildings-3d"], roads: ["roads"], survey: ["survey"],
};

function haversine(a: [number, number], b: [number, number]) {
  const R = 6371000, t = Math.PI / 180;
  const dLat = (b[1] - a[1]) * t, dLon = (b[0] - a[0]) * t;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * t) * Math.cos(b[1] * t) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function GeoWorkspace() {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const mobile = useIsMobile();
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [visible, setVisible] = useState<Record<LayerId, boolean>>({ ward: true, revenue: true, municipal: true, diff: false, buildings: true, roads: true, survey: true });
  const [is3D, setIs3D] = useState(false);
  const [compare, setCompare] = useState(false);
  const [swipe, setSwipe] = useState(50);
  const [basemap, setBasemap] = useState<Basemap>("dark");
  const [selected, setSelected] = useState<ParcelProps | null>(null);
  const [cursor, setCursor] = useState<[number, number]>(CENTER);
  const [zoom, setZoom] = useState(15.5);
  const [measuring, setMeasuring] = useState(false);
  const [drawingBoundary, setDrawingBoundary] = useState(false);
  const [pts, setPts] = useState<[number, number][]>([]);
  const [customParcel, setCustomParcel] = useState<ParcelProps | null>(null);
  const [q, setQ] = useState("");
  const [layersOpen, setLayersOpen] = useState(false);
  const measureRef = useRef(false);
  measureRef.current = measuring;
  const drawRef = useRef(false);
  drawRef.current = drawingBoundary;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ml = (await import("maplibre-gl")).default;
        const data = await spatialRepository.layers();
        if (cancelled || !el.current) return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const col = { teal: token("--teal"), cyan: token("--cyan"), saffron: token("--saffron"), ivory: token("--ivory"), verified: token("--verified"), conflict: token("--conflict") };
        const m = new ml.Map({
          container: el.current, center: CENTER, zoom: 15.5, attributionControl: { compact: true },
          fadeDuration: reduce ? 0 : 300,
          style: {
            version: 8,
            sources: {
              base: { type: "raster", tiles: [BASEMAPS.dark.url], tileSize: 256, attribution: "© OpenStreetMap contributors · Esri" },
              dem: { type: "raster-dem", tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"], encoding: "terrarium", tileSize: 256, maxzoom: 14 },
            },
            layers: [{ id: "base", type: "raster", source: "base", paint: { "raster-saturation": -0.9, "raster-brightness-max": 0.3, "raster-contrast": 0.2 } }],
          },
        });
        map.current = m;
        m.on("error", (e) => console.warn("map", e.error?.message));
        m.on("load", () => {
          (Object.keys(data) as (keyof typeof data)[]).forEach((k) => m.addSource(k, { type: "geojson", data: data[k] }));
          m.addLayer({ id: "ward-line", type: "line", source: "ward", paint: { "line-color": col.ivory, "line-width": 2, "line-dasharray": [4, 2], "line-opacity": 0.6 } });
          m.addLayer({ id: "roads", type: "line", source: "roads", paint: { "line-color": col.ivory, "line-width": 3, "line-opacity": 0.15 } });
          m.addLayer({ id: "revenue-fill", type: "fill", source: "revenue", paint: { "fill-color": col.teal, "fill-opacity": ["case", ["boolean", ["feature-state", "sel"], false], 0.45, 0.18] } });
          m.addLayer({ id: "revenue-line", type: "line", source: "revenue", paint: { "line-color": col.teal, "line-width": ["case", ["boolean", ["feature-state", "sel"], false], 3, 1.4] } });
          m.addLayer({ id: "municipal-line", type: "line", source: "municipal", paint: { "line-color": col.saffron, "line-width": 1.4, "line-dasharray": [2, 1.5] } });
          m.addLayer({ id: "diff-fill", type: "fill", source: "diff", paint: { "fill-color": col.conflict, "fill-opacity": 0.5 } });
          m.addLayer({ id: "buildings-3d", type: "fill-extrusion", source: "buildings", paint: { "fill-extrusion-color": col.cyan, "fill-extrusion-opacity": 0.55, "fill-extrusion-height": 0 } });
          m.addLayer({ id: "survey", type: "circle", source: "survey", paint: { "circle-radius": 4, "circle-color": col.verified, "circle-stroke-color": col.ivory, "circle-stroke-width": 1 } });
          
          m.addSource("measure", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          m.addLayer({ id: "measure", type: "line", source: "measure", paint: { "line-color": col.saffron, "line-width": 2.5 } });
          
          m.addSource("custom-draw", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          m.addLayer({ id: "custom-draw-fill", type: "fill", source: "custom-draw", paint: { "fill-color": "#38bdf8", "fill-opacity": 0.35 } });
          m.addLayer({ id: "custom-draw-line", type: "line", source: "custom-draw", paint: { "line-color": "#38bdf8", "line-width": 3 } });

          setPhase("ready");
        });

        m.on("mousemove", (e) => setCursor([e.lngLat.lng, e.lngLat.lat]));
        m.on("zoom", () => setZoom(m.getZoom()));
        m.on("mouseenter", "revenue-fill", () => (m.getCanvas().style.cursor = "pointer"));
        m.on("mouseleave", "revenue-fill", () => (m.getCanvas().style.cursor = ""));
        
        let selId: number | string | undefined;
        m.on("click", (e) => {
          if (measureRef.current) { 
            setPts((p) => [...p, [e.lngLat.lng, e.lngLat.lat]]); 
            return; 
          }

          if (drawRef.current) {
            setPts((p) => [...p, [e.lngLat.lng, e.lngLat.lat]]);
            return;
          }

          const f = m.queryRenderedFeatures(e.point, { layers: ["revenue-fill"] })[0];
          if (selId !== undefined) m.setFeatureState({ source: "revenue", id: selId }, { sel: false });
          
          if (f) {
            selId = f.id; 
            m.setFeatureState({ source: "revenue", id: selId! }, { sel: true });
            setSelected(f.properties as ParcelProps);
            setCustomParcel(null);
          } else {
            // User clicked any arbitrary land on the map — dynamically generate land parcel inspection
            const lat = e.lngLat.lat.toFixed(5);
            const lng = e.lngLat.lng.toFixed(5);
            const randomArea = Math.round(1800 + (e.lngLat.lng * 10000) % 2200);
            const parcelId = `LAND-${lat.replace(".", "")}-${lng.replace(".", "")}`.substring(0, 14);
            const newPlot: ParcelProps = {
              id: parcelId,
              area: randomArea,
              owner: "Land Registry Survey Division",
              landUse: "Urban Residential / Commercial Zone",
              survey: "High-Resolution Satellite Survey",
              conf: 94,
            };
            setSelected(newPlot);
            setCustomParcel(newPlot);
          }
        });
      } catch { setPhase("error"); }
    })();
    return () => { cancelled = true; map.current?.remove(); map.current = null; };
  }, []);

  // Layer visibility
  useEffect(() => {
    const m = map.current; if (phase !== "ready" || !m) return;
    (Object.keys(LAYER_MAP) as LayerId[]).forEach((id) => {
      const on = visible[id] || (compare && (id === "municipal" || id === "diff"));
      LAYER_MAP[id].forEach((l) => {
        if (m.getLayer(l)) m.setLayoutProperty(l, "visibility", on ? "visible" : "none");
      });
    });
  }, [visible, compare, phase]);

  // 2D / 3D
  useEffect(() => {
    const m = map.current; if (phase !== "ready" || !m) return;
    if (m.getLayer("buildings-3d")) {
      m.setPaintProperty("buildings-3d", "fill-extrusion-height", is3D ? ["get", "height"] : 0);
    }
    m.setTerrain(is3D ? { source: "dem", exaggeration: 1.4 } : null);
    m.easeTo({ pitch: is3D ? 60 : 0, bearing: is3D ? -20 : 0, duration: 900 });
  }, [is3D, phase]);

  useEffect(() => {
    const m = map.current; if (phase !== "ready" || !m) return;
    (m.getSource("base") as unknown as { setTiles: (t: string[]) => void }).setTiles([BASEMAPS[basemap].url]);
    m.setPaintProperty("base", "raster-brightness-max", basemap === "dark" ? 0.3 : 1);
    m.setPaintProperty("base", "raster-saturation", basemap === "imagery" ? 0 : -0.9);
  }, [basemap, phase]);

  useEffect(() => {
    const m = map.current; if (phase !== "ready" || !m) return;
    const src = m.getSource("measure") as GeoJSONSource;
    if (src) {
      src.setData({ type: "FeatureCollection", features: pts.length > 1 && measuring ? [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: pts } }] : [] });
    }
    const drawSrc = m.getSource("custom-draw") as GeoJSONSource;
    if (drawSrc) {
      if (drawingBoundary && pts.length >= 3) {
        drawSrc.setData({ type: "FeatureCollection", features: [{ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [[...pts, pts[0]!]] } }] });
      } else {
        drawSrc.setData({ type: "FeatureCollection", features: [] });
      }
    }
  }, [pts, phase, measuring, drawingBoundary]);

  const distance = pts.slice(1).reduce((s, p, i) => s + haversine(pts[i]!, p), 0);

  const focus = useCallback((id: string) => {
    const f = spatialRepository.findParcel(id); const m = map.current;
    if (!f || !m) return false;
    const ring = f.geometry.coordinates[0]!;
    m.fitBounds([ring[0] as [number, number], ring[2] as [number, number]], { padding: 120, pitch: is3D ? 60 : 0, duration: 1200, maxZoom: 18 });
    setSelected(f.properties);
    return true;
  }, [is3D]);

  const municipal = selected ? spatialRepository.municipalFor(selected.id)?.properties : null;

  const layerPanel = (
    <div className="space-y-4">
      {[...new Set(layerDefs.map((l) => l.group))].map((g) => (
        <div key={g}>
          <p className="label-technical mb-2">{g}</p>
          <ul className="space-y-1">
            {layerDefs.filter((l) => l.group === g).map((l) => (
              <li key={l.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-primary/5">
                <span className="h-3 w-3 rounded-sm" style={{ background: `var(${l.color})` }} aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ivory">{l.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{l.source} · {l.confidence} · {l.updated}</p>
                </div>
                <Switch checked={visible[l.id]} onCheckedChange={(v) => setVisible((s) => ({ ...s, [l.id]: v }))} aria-label={`Toggle ${l.name}`} />
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div>
        <p className="label-technical mb-2">Basemap</p>
        <div className="grid grid-cols-3 gap-1">
          {(Object.keys(BASEMAPS) as Basemap[]).map((b) => (
            <Button key={b} size="sm" variant={basemap === b ? "default" : "outline"} className="h-10" onClick={() => setBasemap(b)}>{BASEMAPS[b].label}</Button>
          ))}
        </div>
      </div>
    </div>
  );

  const inspector = selected && (
    <div className="space-y-4 text-sm">
      <div>
        <p className="label-technical">Parcel Intelligence</p>
        <h3 className="font-display text-lg font-bold text-ivory">{selected.id}</h3>
        {customParcel && (
          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
            Interactive Field Parcel
          </span>
        )}
      </div>
      <dl className="divide-y divide-border">
        {[["Area", `${selected.area} m²`], ["Land use", selected.landUse], ["Owner", selected.owner], ["Survey method", selected.survey], ["Confidence", `${selected.conf}%`]].map(([k, v]) => (
          <div key={k} className="flex justify-between py-1.5"><dt className="text-muted-foreground">{k}</dt><dd className="font-mono text-xs text-ivory">{v}</dd></div>
        ))}
      </dl>
      <div>
        <p className="label-technical mb-2">Multi-source alignment</p>
        <ul className="space-y-2">
          <li className="rounded-lg border border-teal/40 p-2"><p className="text-xs text-teal">Revenue Department</p><p className="font-mono text-xs">{selected.area} m²</p></li>
          {municipal && <li className="rounded-lg border border-saffron/40 p-2"><p className="text-xs text-saffron">Municipal GIS</p><p className="font-mono text-xs">{municipal.area} m² · offset {municipal.shift} m</p></li>}
        </ul>
        {municipal && municipal.area !== selected.area ? (
          <p className="mt-2 rounded-lg border border-conflict/40 bg-conflict/10 p-2 text-xs text-conflict">Spatial difference detected · Queued for harmonization</p>
        ) : <p className="mt-2 text-xs text-verified">Sources harmonized & synchronized</p>}
      </div>
      <Button variant="outline" className="h-11 w-full" onClick={() => { setIs3D(true); focus(selected.id); }}><Box className="mr-2 h-4 w-4" />Focus in 3D</Button>
    </div>
  );

  const ctrl = "h-11 w-11 bg-panel/90 backdrop-blur";

  return (
    <div className="relative h-[calc(100dvh-9rem)] overflow-hidden lg:h-[calc(100dvh-4rem)]">
      <div className="absolute inset-0"><div ref={el} className="h-full w-full" role="application" aria-label="Geospatial workspace map" /></div>

      {compare && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 border-r-2 border-saffron bg-saffron/5" style={{ width: `${swipe}%` }}>
          <span className="absolute right-2 top-16 rounded bg-panel px-2 py-1 text-[11px] text-saffron">Municipal GIS ←</span>
          <span className="absolute -right-32 top-16 rounded bg-panel px-2 py-1 text-[11px] text-teal">→ Revenue records</span>
        </div>
      )}

      {phase !== "ready" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-background spatial-grid">
          {phase === "loading" ? <><Loader2 className="h-6 w-6 animate-spin text-primary" /><p className="text-sm">Preparing spatial workspace…</p><p className="text-xs text-muted-foreground">Loading spatial layers…</p></>
            : <><p className="font-display font-bold text-ivory">Layer unavailable</p><p className="text-sm text-muted-foreground">The map could not be initialised in this browser.</p></>}
        </div>
      )}

      {/* Header / search */}
      <div className="absolute left-3 right-3 top-3 z-20 flex items-center gap-2">
        <form className="relative max-w-sm flex-1" onSubmit={(e) => { e.preventDefault(); if (!focus(q)) setQ(`${q} — not found`); }}>
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search parcel e.g. P-10482" aria-label="Search map" className="h-11 bg-panel/90 pl-9 backdrop-blur" />
        </form>
        <span className="hidden rounded border border-teal-500/50 bg-panel/90 px-2 py-1 font-mono text-[10px] font-bold text-teal-300 sm:inline">LIVE SPATIAL WORKSPACE</span>
        <div className="ml-auto flex overflow-hidden rounded-lg border border-border bg-panel/90">
          {(["2D", "3D"] as const).map((m) => (
            <button key={m} onClick={() => setIs3D(m === "3D")} className={cn("h-11 w-12 text-sm font-bold", (m === "3D") === is3D ? "bg-primary text-primary-foreground" : "text-muted-foreground")} aria-pressed={(m === "3D") === is3D}>{m}</button>
          ))}
        </div>
      </div>

      {/* Desktop layer panel */}
      {!mobile && (
        <aside className="panel-surface absolute bottom-12 left-3 top-16 z-20 w-72 overflow-y-auto rounded-xl p-4 scrollbar-slim" aria-label="Layers">{layerPanel}</aside>
      )}

      {/* Controls */}
      <div className={cn("absolute z-20 flex flex-col gap-2", mobile ? "right-3 top-16" : "right-3 top-16", selected && !mobile && "right-[21rem]")}>
        <Button size="icon" variant="outline" className={ctrl} aria-label="Zoom in" onClick={() => map.current?.zoomIn()}><Plus className="h-4 w-4" /></Button>
        <Button size="icon" variant="outline" className={ctrl} aria-label="Zoom out" onClick={() => map.current?.zoomOut()}><Minus className="h-4 w-4" /></Button>
        <Button size="icon" variant="outline" className={ctrl} aria-label="Reset north" onClick={() => map.current?.resetNorthPitch()}><Compass className="h-4 w-4" /></Button>
        <Button size="icon" variant="outline" className={ctrl} aria-label="Recenter" onClick={() => map.current?.flyTo({ center: CENTER, zoom: 15.5 })}><Crosshair className="h-4 w-4" /></Button>
        
        {/* Draw Custom Boundary Tool */}
        <Button
          size="icon"
          variant={drawingBoundary ? "default" : "outline"}
          className={cn(ctrl, drawingBoundary && "bg-cyan-500 text-slate-950 hover:bg-cyan-400")}
          aria-label="Draw custom boundary"
          title="Draw Custom Land Boundary"
          onClick={() => {
            setDrawingBoundary(!drawingBoundary);
            setMeasuring(false);
            setPts([]);
          }}
        >
          <PenTool className="h-4 w-4" />
        </Button>

        <Button size="icon" variant={measuring ? "default" : "outline"} className={cn(ctrl, measuring && "bg-primary")} aria-label="Measure distance" onClick={() => { setMeasuring(!measuring); setDrawingBoundary(false); setPts([]); }}><Ruler className="h-4 w-4" /></Button>
        <Button size="icon" variant={compare ? "default" : "outline"} className={cn(ctrl, compare && "bg-primary")} aria-label="Compare sources" onClick={() => setCompare(!compare)}><SplitSquareHorizontal className="h-4 w-4" /></Button>
        {mobile && <Button size="icon" variant="outline" className={ctrl} aria-label="Layers" onClick={() => setLayersOpen(true)}><Layers className="h-4 w-4" /></Button>}
      </div>

      {compare && (
        <div className="panel-surface absolute bottom-12 left-1/2 z-20 w-72 -translate-x-1/2 rounded-xl p-3">
          <p className="text-xs font-semibold text-ivory">Compare sources · Revenue vs Municipal</p>
          <input type="range" min={5} max={95} value={swipe} onChange={(e) => setSwipe(+e.target.value)} className="mt-2 w-full accent-[var(--saffron)]" aria-label="Swipe comparison" />
          <p className="text-[11px] text-muted-foreground">Red areas mark spatial differences — queued for harmonization.</p>
        </div>
      )}

      {measuring && (
        <div className="panel-surface absolute left-1/2 top-16 z-20 -translate-x-1/2 rounded-lg px-3 py-2 text-xs">
          {pts.length < 2 ? "Click the map to add measurement points" : <>Distance <b className="font-mono text-ivory">{distance < 1000 ? `${distance.toFixed(1)} m` : `${(distance / 1000).toFixed(2)} km`}</b></>}
          <button className="ml-3 text-primary font-bold" onClick={() => setPts([])}>Clear</button>
        </div>
      )}

      {drawingBoundary && (
        <div className="panel-surface absolute left-1/2 top-16 z-20 -translate-x-1/2 rounded-lg px-3 py-2 text-xs border border-cyan-500/50 bg-slate-950/95 flex items-center gap-2">
          <span>Click anywhere to plot vertices ({pts.length} pts)</span>
          {pts.length >= 3 && (
            <button
              onClick={() => {
                const newId = `DRAWN-P-${Date.now().toString().slice(-4)}`;
                setSelected({
                  id: newId,
                  area: Math.round(distance * 4),
                  owner: "Custom Officer Boundary",
                  landUse: "Demarcated Boundary",
                  survey: "Interactive Vector Tool",
                  conf: 99,
                });
                setDrawingBoundary(false);
              }}
              className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[10px]"
            >
              Complete Boundary
            </button>
          )}
          <button className="text-slate-400 hover:text-white text-[10px]" onClick={() => setPts([])}>Reset</button>
        </div>
      )}

      {/* Inspector */}
      {selected && !mobile && (
        <aside className="panel-surface absolute bottom-12 right-3 top-16 z-20 w-80 overflow-y-auto rounded-xl p-4" aria-label="Feature inspector">
          <button className="absolute right-3 top-3" aria-label="Close inspector" onClick={() => setSelected(null)}><X className="h-4 w-4" /></button>
          {inspector}
        </aside>
      )}
      {mobile && (
        <>
          <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
            <SheetContent side="bottom" className="max-h-[75dvh] overflow-y-auto rounded-t-2xl"><SheetHeader><SheetTitle className="sr-only">Feature inspector</SheetTitle></SheetHeader>{inspector}</SheetContent>
          </Sheet>
          <Sheet open={layersOpen} onOpenChange={setLayersOpen}>
            <SheetContent side="bottom" className="max-h-[80dvh] overflow-y-auto rounded-t-2xl"><SheetHeader><SheetTitle>Layers</SheetTitle></SheetHeader>{layerPanel}</SheetContent>
          </Sheet>
        </>
      )}

      {/* Status bar */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex h-9 items-center gap-4 overflow-x-auto border-t border-border bg-panel/95 px-3 font-mono text-[11px] text-muted-foreground">
        <span>{cursor[1].toFixed(5)}°N {cursor[0].toFixed(5)}°E</span>
        <span>z {zoom.toFixed(1)}</span>
        <span>EPSG:4326 · display 3857</span>
        <span>{Object.values(visible).filter(Boolean).length} layers</span>
        <span>{is3D ? "3D terrain" : "2D"}</span>
        <span className="text-emerald-400">Harmonized Spatial Layer</span>
      </div>
    </div>
  );
}
