/**
 * ComparisonMapEngine — MapLibre GL component for multi-source parcel comparison.
 * Supports side-by-side single-source display, overlay mode, and difference mode.
 *
 * ⚠️ SYNTHETIC DEMO DATA — not real government records.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  PARCEL_014_GEOJSON,
  CONFLICT_ZONE_GEOJSON,
  SOURCE_OBSERVATIONS,
  DEMO_MAP_CENTER,
  DEMO_MAP_ZOOM,
  type SourceId,
  type ComparisonMode,
} from "@/lib/mock/comparison-data";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Dark basemap style (CARTO dark)
// ---------------------------------------------------------------------------
const MAP_STYLE = {
  version: 8,
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
      attribution: "© Esri, OpenStreetMap",
    },
  },
  layers: [{ id: "base-map", type: "raster", source: "osm-tiles", minzoom: 0, maxzoom: 22 }],
} as const;

// ---------------------------------------------------------------------------
// Single-source map (for side-by-side)
// ---------------------------------------------------------------------------

interface SingleSourceMapProps {
  sourceId: SourceId;
  className?: string;
  syncRef?: React.MutableRefObject<maplibregl.Map | null>;
  onReady?: (map: maplibregl.Map) => void;
}

export function SingleSourceMap({ sourceId, className, syncRef, onReady }: SingleSourceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const src = SOURCE_OBSERVATIONS[sourceId];

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE as any,
      center: DEMO_MAP_CENTER,
      zoom: DEMO_MAP_ZOOM,
      attributionControl: false,
      fadeDuration: 0,
      pixelRatio: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5),
      trackResize: true,
      canvasContextAttributes: { antialias: false, powerPreference: "high-performance" },
    });

    mapRef.current = map;

    map.on("load", () => {
      const geojson = PARCEL_014_GEOJSON[sourceId];

      map.addSource(`parcel-${sourceId}`, { type: "geojson", data: geojson as any });

      // Fill layer
      map.addLayer({
        id: `fill-${sourceId}`,
        type: "fill",
        source: `parcel-${sourceId}`,
        paint: {
          "fill-color": src.color,
          "fill-opacity": 0.18,
        },
      });

      // Line layer (selected highlight)
      map.addLayer({
        id: `line-${sourceId}`,
        type: "line",
        source: `parcel-${sourceId}`,
        paint: {
          "line-color": src.color,
          "line-width": 2.5,
          "line-dasharray": src.dashArray ?? [1],
        },
      });

      // Glow / selection ring
      map.addLayer({
        id: `glow-${sourceId}`,
        type: "line",
        source: `parcel-${sourceId}`,
        paint: {
          "line-color": src.color,
          "line-width": 6,
          "line-opacity": 0.25,
          "line-blur": 3,
        },
      });

      setLoaded(true);
      onReady?.(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [sourceId]);

  // Sync move events with primary map
  useEffect(() => {
    if (!loaded || !mapRef.current || !syncRef) return;
    const map = mapRef.current;

    const handleMove = () => {
      if (!syncRef.current || syncRef.current === map) return;
      const center = syncRef.current.getCenter();
      const zoom = syncRef.current.getZoom();
      map.jumpTo({ center, zoom });
    };

    syncRef.current?.on("move", handleMove);
    return () => { syncRef.current?.off("move", handleMove); };
  }, [loaded, syncRef]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-[#0a0f18]", className)}>
      <div ref={containerRef} className="absolute inset-0" />
      {/* Source label overlay */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 rounded-lg border border-border/60 bg-background/80 px-2.5 py-1.5 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: src.color }} />
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-ivory">{src.label}</span>
      </div>
      {/* Confidence badge */}
      <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-lg border border-border/60 bg-background/80 px-2 py-1 backdrop-blur-md">
        <span className="font-mono text-[10px] text-muted-foreground">{src.confidence}% confidence</span>
      </div>
      {!loaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0f18]/90">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="font-mono text-[10px] text-muted-foreground">Loading {src.shortLabel}…</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overlay Map — all sources on one map with opacity controls
// ---------------------------------------------------------------------------

interface OverlayMapProps {
  className?: string;
  activeSources: Record<SourceId, boolean>;
  opacities: Record<SourceId, number>;
  showConflictZone: boolean;
}

export function OverlayMap({ className, activeSources, opacities, showConflictZone }: OverlayMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE as any,
      center: DEMO_MAP_CENTER,
      zoom: DEMO_MAP_ZOOM,
      attributionControl: false,
      fadeDuration: 0,
      pixelRatio: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5),
      trackResize: true,
      canvasContextAttributes: { antialias: false, powerPreference: "high-performance" },
    });

    mapRef.current = map;

    map.on("load", () => {
      const sources: SourceId[] = ["municipal", "registry", "survey"];

      // Add conflict zone first (beneath parcels)
      map.addSource("conflict-zone", { type: "geojson", data: CONFLICT_ZONE_GEOJSON as any });
      map.addLayer({
        id: "conflict-fill",
        type: "fill",
        source: "conflict-zone",
        paint: {
          "fill-color": "#ef4444",
          "fill-opacity": 0.15,
        },
      });
      map.addLayer({
        id: "conflict-line",
        type: "line",
        source: "conflict-zone",
        paint: {
          "line-color": "#ef4444",
          "line-width": 1.5,
          "line-dasharray": [3, 3],
          "line-opacity": 0.7,
        },
      });

      // Add each source parcel
      sources.forEach((sid) => {
        const src = SOURCE_OBSERVATIONS[sid];
        map.addSource(`overlay-${sid}`, { type: "geojson", data: PARCEL_014_GEOJSON[sid] as any });
        map.addLayer({
          id: `overlay-fill-${sid}`,
          type: "fill",
          source: `overlay-${sid}`,
          paint: { "fill-color": src.color, "fill-opacity": 0.15 },
        });
        map.addLayer({
          id: `overlay-line-${sid}`,
          type: "line",
          source: `overlay-${sid}`,
          paint: {
            "line-color": src.color,
            "line-width": 2,
            "line-dasharray": src.dashArray ?? [1],
          },
        });
      });

      setLoaded(true);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Update visibility and opacity when controls change
  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    const map = mapRef.current;
    const sources: SourceId[] = ["municipal", "registry", "survey"];

    sources.forEach((sid) => {
      const visible = activeSources[sid] ? "visible" : "none";
      const fillOpacity = (opacities[sid] / 100) * 0.25;
      const lineOpacity = opacities[sid] / 100;

      if (map.getLayer(`overlay-fill-${sid}`)) {
        map.setLayoutProperty(`overlay-fill-${sid}`, "visibility", visible);
        map.setPaintProperty(`overlay-fill-${sid}`, "fill-opacity", fillOpacity);
      }
      if (map.getLayer(`overlay-line-${sid}`)) {
        map.setLayoutProperty(`overlay-line-${sid}`, "visibility", visible);
        map.setPaintProperty(`overlay-line-${sid}`, "line-opacity", lineOpacity);
      }
    });

    // Toggle conflict zone
    const conflictViz = showConflictZone ? "visible" : "none";
    if (map.getLayer("conflict-fill")) map.setLayoutProperty("conflict-fill", "visibility", conflictViz);
    if (map.getLayer("conflict-line")) map.setLayoutProperty("conflict-line", "visibility", conflictViz);
  }, [loaded, activeSources, opacities, showConflictZone]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-[#0a0f18]", className)}>
      <div ref={containerRef} className="absolute inset-0" />
      {/* Legend */}
      {loaded && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 space-y-1 rounded-lg border border-border/60 bg-background/80 px-3 py-2 backdrop-blur-md">
          {(["municipal", "registry", "survey"] as SourceId[]).map((sid) => (
            <div key={sid} className="flex items-center gap-2">
              <span className="h-1.5 w-6 rounded" style={{ backgroundColor: SOURCE_OBSERVATIONS[sid].color, opacity: activeSources[sid] ? 1 : 0.3 }} />
              <span className="font-mono text-[10px] text-muted-foreground">{SOURCE_OBSERVATIONS[sid].shortLabel}</span>
            </div>
          ))}
          {showConflictZone && (
            <div className="flex items-center gap-2 border-t border-border/40 pt-1 mt-1">
              <span className="h-1.5 w-6 rounded bg-red-500/70" />
              <span className="font-mono text-[10px] text-red-400">CONFLICT ZONE</span>
            </div>
          )}
        </div>
      )}
      {!loaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0f18]/90">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Difference Map — highlights conflict zones prominently
// ---------------------------------------------------------------------------

interface DifferenceMapProps {
  className?: string;
}

export function DifferenceMap({ className }: DifferenceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE as any,
      center: DEMO_MAP_CENTER,
      zoom: DEMO_MAP_ZOOM,
      attributionControl: false,
      fadeDuration: 0,
      pixelRatio: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5),
      trackResize: true,
      canvasContextAttributes: { antialias: false, powerPreference: "high-performance" },
    });

    mapRef.current = map;

    map.on("load", () => {
      // All three outlines shown dimly
      const sources: SourceId[] = ["municipal", "registry", "survey"];
      sources.forEach((sid) => {
        const src = SOURCE_OBSERVATIONS[sid];
        map.addSource(`diff-${sid}`, { type: "geojson", data: PARCEL_014_GEOJSON[sid] as any });
        map.addLayer({
          id: `diff-fill-${sid}`,
          type: "fill",
          source: `diff-${sid}`,
          paint: { "fill-color": src.color, "fill-opacity": 0.06 },
        });
        map.addLayer({
          id: `diff-line-${sid}`,
          type: "line",
          source: `diff-${sid}`,
          paint: {
            "line-color": src.color,
            "line-width": 1.5,
            "line-opacity": 0.6,
            "line-dasharray": src.dashArray ?? [1],
          },
        });
      });

      // Conflict zone — highlighted
      map.addSource("diff-conflict", { type: "geojson", data: CONFLICT_ZONE_GEOJSON as any });
      map.addLayer({
        id: "diff-conflict-fill",
        type: "fill",
        source: "diff-conflict",
        paint: { "fill-color": "#ef4444", "fill-opacity": 0.3 },
      });
      map.addLayer({
        id: "diff-conflict-line",
        type: "line",
        source: "diff-conflict",
        paint: { "line-color": "#ef4444", "line-width": 2.5, "line-opacity": 0.9 },
      });

      setLoaded(true);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-[#0a0f18]", className)}>
      <div ref={containerRef} className="absolute inset-0" />
      {/* Difference mode label */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg border border-red-500/40 bg-red-950/60 px-2.5 py-1.5 backdrop-blur-md">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-red-400">⚠ BOUNDARY DIFFERENCE</span>
      </div>
      <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-lg border border-border/60 bg-background/80 px-2 py-1 backdrop-blur-md">
        <span className="font-mono text-[10px] text-saffron">DEMO COMPUTATION</span>
      </div>
      {!loaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0f18]/90">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
