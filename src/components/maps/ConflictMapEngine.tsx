/**
 * BHOO-MITRA AI — Conflict Map Engine
 *
 * Specialized MapLibre GIS viewer for Conflict Intelligence & Investigation.
 * Supports:
 * - Standard Mode (Severity-coded conflict markers & boundary overlays)
 * - Conflict Density Mode (Heatmap layer)
 * - Confidence Mode (Detection confidence visualization)
 * - Two-way selection synchronization with conflict list
 */

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  type ConflictCase,
  generateConflictsGeoJSON,
  generateConflictPolygons,
} from "@/lib/mock/conflicts-data";
import { cn } from "@/lib/utils";
import { Layers, Flame, Gauge, Crosshair, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export type ConflictMapMode = "standard" | "density" | "confidence";

interface ConflictMapEngineProps {
  conflicts: ConflictCase[];
  selectedConflictId: string | null;
  onSelectConflict: (id: string) => void;
  mapMode: ConflictMapMode;
  onMapModeChange?: (mode: ConflictMapMode) => void;
  className?: string;
  isInvestigationMode?: boolean;
}

const MAP_STYLE = {
  version: 8 as const,
  sources: {
    "osm-tiles": {
      type: "raster" as const,
      tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
      attribution: "© Esri, OpenStreetMap",
    },
  },
  layers: [
    {
      id: "base-map",
      type: "raster" as const,
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "#ef4444",
  HIGH: "#f59e0b",
  MEDIUM: "#06b6d4",
  LOW: "#64748b",
};

export function ConflictMapEngine({
  conflicts,
  selectedConflictId,
  onSelectConflict,
  mapMode,
  onMapModeChange,
  className,
  isInvestigationMode,
}: ConflictMapEngineProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const selectedConflict = conflicts.find((c) => c.id === selectedConflictId);

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainer.current) return;

    const initialCenter: [number, number] = [77.202, 28.6012];

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE as any,
      center: initialCenter,
      zoom: 15.2,
      pitch: 35,
      bearing: -15,
      attributionControl: false,
    });

    mapInstance.on("load", () => {
      map.current = mapInstance;
      setMapLoaded(true);
    });

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Update GeoJSON Sources and Layers when map is ready or conflicts change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const m = map.current;

    const geojsonData = generateConflictsGeoJSON(conflicts);

    // Add or update conflicts GeoJSON source
    if (m.getSource("conflicts-points")) {
      (m.getSource("conflicts-points") as maplibregl.GeoJSONSource).setData(geojsonData as any);
    } else {
      m.addSource("conflicts-points", {
        type: "geojson",
        data: geojsonData as any,
      });

      // Heatmap Layer for Density mode
      m.addLayer({
        id: "conflicts-heat",
        type: "heatmap",
        source: "conflicts-points",
        maxzoom: 18,
        paint: {
          "heatmap-weight": ["interpolate", ["linear"], ["get", "confidence"], 50, 0.5, 100, 1.5],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 10, 1, 16, 3],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(6, 182, 212, 0)",
            0.2,
            "rgba(6, 182, 212, 0.5)",
            0.4,
            "rgba(245, 158, 11, 0.7)",
            0.7,
            "rgba(239, 68, 68, 0.85)",
            1,
            "rgba(255, 255, 255, 0.95)",
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 10, 15, 16, 40],
          "heatmap-opacity": 0.85,
        },
        layout: {
          visibility: mapMode === "density" ? "visible" : "none",
        },
      });

      // Points Layer for Confidence mode
      m.addLayer({
        id: "conflicts-confidence-circles",
        type: "circle",
        source: "conflicts-points",
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 12, 6, 16, 14],
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "confidence"],
            60,
            "#64748b",
            80,
            "#06b6d4",
            90,
            "#f59e0b",
            95,
            "#10b981",
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": 0.85,
        },
        layout: {
          visibility: mapMode === "confidence" ? "visible" : "none",
        },
      });

      // Click on circle in confidence mode
      m.on("click", "conflicts-confidence-circles", (e) => {
        const feat = e.features?.[0];
        const pId = feat?.properties?.["id"];
        if (pId) {
          onSelectConflict(String(pId));
        }
      });
    }

    // Toggle layer visibility based on mapMode
    if (m.getLayer("conflicts-heat")) {
      m.setLayoutProperty("conflicts-heat", "visibility", mapMode === "density" ? "visible" : "none");
    }
    if (m.getLayer("conflicts-confidence-circles")) {
      m.setLayoutProperty(
        "conflicts-confidence-circles",
        "visibility",
        mapMode === "confidence" ? "visible" : "none"
      );
    }

    // Render HTML Markers in Standard Mode
    // Clear old markers
    markersRef.current.forEach((mk) => mk.remove());
    markersRef.current = [];

    if (mapMode === "standard") {
      conflicts.forEach((c) => {
        const isSelected = c.id === selectedConflictId;
        const color = SEVERITY_COLORS[c.severity] ?? "#06b6d4";

        const el = document.createElement("div");
        el.className = cn(
          "conflict-map-marker group relative cursor-pointer flex items-center justify-center transition-all duration-300",
          isSelected ? "z-30 scale-125" : "z-10 hover:scale-110"
        );

        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            ${
              isSelected
                ? `<span class="absolute inline-flex h-8 w-8 animate-ping rounded-full opacity-60" style="background-color: ${color}"></span>`
                : ""
            }
            <div class="flex items-center gap-1 px-2 py-1 rounded-full border shadow-lg backdrop-blur-md transition-all"
                 style="background-color: rgba(15, 23, 42, 0.9); border-color: ${
                   isSelected ? "#ffffff" : color
                 }; box-shadow: 0 0 ${isSelected ? "16px" : "6px"} ${color}66;">
              <span class="h-2 w-2 rounded-full" style="background-color: ${color}"></span>
              <span class="text-[10px] font-mono font-bold text-white">${c.id.replace("CONFLICT-DEMO-", "CF-")}</span>
            </div>
          </div>
        `;

        el.addEventListener("click", () => {
          onSelectConflict(c.id);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(c.coordinates)
          .addTo(m);

        markersRef.current.push(marker);
      });
    }
  }, [mapLoaded, conflicts, selectedConflictId, mapMode]);

  // Handle selected conflict polygon overlay and camera focus
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const m = map.current;

    if (!selectedConflict) {
      // Remove polygon layers if no conflict selected
      if (m.getLayer("conflict-diff-fill")) m.removeLayer("conflict-diff-fill");
      if (m.getLayer("conflict-diff-line")) m.removeLayer("conflict-diff-line");
      if (m.getLayer("conflict-obs-fill")) m.removeLayer("conflict-obs-fill");
      if (m.getLayer("conflict-obs-line")) m.removeLayer("conflict-obs-line");
      if (m.getLayer("conflict-ref-fill")) m.removeLayer("conflict-ref-fill");
      if (m.getLayer("conflict-ref-line")) m.removeLayer("conflict-ref-line");
      if (m.getSource("selected-conflict-polygons")) m.removeSource("selected-conflict-polygons");
      return;
    }

    const polygonData = generateConflictPolygons(selectedConflict);

    if (m.getSource("selected-conflict-polygons")) {
      (m.getSource("selected-conflict-polygons") as maplibregl.GeoJSONSource).setData(polygonData as any);
    } else {
      m.addSource("selected-conflict-polygons", {
        type: "geojson",
        data: polygonData as any,
      });

      // Reference Fill (Cyan)
      m.addLayer({
        id: "conflict-ref-fill",
        type: "fill",
        source: "selected-conflict-polygons",
        filter: ["==", ["get", "role"], "reference"],
        paint: {
          "fill-color": "#06b6d4",
          "fill-opacity": 0.2,
        },
      });

      // Reference Line
      m.addLayer({
        id: "conflict-ref-line",
        type: "line",
        source: "selected-conflict-polygons",
        filter: ["==", ["get", "role"], "reference"],
        paint: {
          "line-color": "#06b6d4",
          "line-width": 2,
          "line-dasharray": [2, 2],
        },
      });

      // Observed Fill (Saffron)
      m.addLayer({
        id: "conflict-obs-fill",
        type: "fill",
        source: "selected-conflict-polygons",
        filter: ["==", ["get", "role"], "observed"],
        paint: {
          "fill-color": "#f59e0b",
          "fill-opacity": 0.25,
        },
      });

      // Observed Line
      m.addLayer({
        id: "conflict-obs-line",
        type: "line",
        source: "selected-conflict-polygons",
        filter: ["==", ["get", "role"], "observed"],
        paint: {
          "line-color": "#f59e0b",
          "line-width": 2.5,
        },
      });

      // Difference / Conflict Fill (Red)
      m.addLayer({
        id: "conflict-diff-fill",
        type: "fill",
        source: "selected-conflict-polygons",
        filter: ["==", ["get", "role"], "difference"],
        paint: {
          "fill-color": "#ef4444",
          "fill-opacity": 0.6,
        },
      });

      // Difference Line
      m.addLayer({
        id: "conflict-diff-line",
        type: "line",
        source: "selected-conflict-polygons",
        filter: ["==", ["get", "role"], "difference"],
        paint: {
          "line-color": "#ef4444",
          "line-width": 3,
        },
      });
    }

    // Smooth flyTo the selected conflict coordinates
    m.flyTo({
      center: selectedConflict.coordinates,
      zoom: 16.8,
      pitch: 45,
      bearing: -20,
      duration: 1200,
      essential: true,
    });
  }, [mapLoaded, selectedConflictId]);

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleResetView = () => {
    map.current?.flyTo({
      center: [77.202, 28.6012],
      zoom: 15.2,
      pitch: 35,
      bearing: -15,
      duration: 1000,
    });
  };

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-slate-950", className)}>
      <div ref={mapContainer} className="h-full w-full" />

      {/* Top Floating Map Controls */}
      <div className="absolute left-3 top-3 z-20 flex flex-wrap items-center gap-2">
        {/* Map Mode Selector */}
        {onMapModeChange && (
          <div className="flex items-center rounded-lg border border-border/80 bg-slate-900/90 p-1 shadow-lg backdrop-blur-md">
            <button
              onClick={() => onMapModeChange("standard")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                mapMode === "standard"
                  ? "bg-primary text-ivory font-bold shadow-sm"
                  : "text-muted-foreground hover:text-ivory"
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              Standard
            </button>
            <button
              onClick={() => onMapModeChange("density")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                mapMode === "density"
                  ? "bg-saffron text-slate-950 font-bold shadow-sm"
                  : "text-muted-foreground hover:text-ivory"
              )}
            >
              <Flame className="h-3.5 w-3.5" />
              Density Heatmap
            </button>
            <button
              onClick={() => onMapModeChange("confidence")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                mapMode === "confidence"
                  ? "bg-cyan text-slate-950 font-bold shadow-sm"
                  : "text-muted-foreground hover:text-ivory"
              )}
            >
              <Gauge className="h-3.5 w-3.5" />
              Confidence
            </button>
          </div>
        )}
      </div>

      {/* Right Map Navigation Tools */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5 rounded-lg border border-border/80 bg-slate-900/90 p-1 shadow-lg backdrop-blur-md">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-slate-800 hover:text-ivory"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-slate-800 hover:text-ivory"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <div className="my-0.5 h-px bg-border/60" />
        <button
          onClick={handleResetView}
          title="Reset Camera"
          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-slate-800 hover:text-ivory"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Bottom Map Status & Legend Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between border-t border-border/80 bg-slate-950/85 px-3 py-1.5 text-[11px] text-muted-foreground backdrop-blur-md">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-saffron">DATA: Synthetic Conflict Demo</span>
          <span>DISAGREEMENTS: {conflicts.length} cases</span>
          {selectedConflict && (
            <span className="font-mono text-cyan">
              SELECTED: {selectedConflict.id} ({selectedConflict.entityId})
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="hidden items-center gap-3 md:flex">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-conflict" /> Critical
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-saffron" /> High
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan" /> Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-slate-500" /> Low
          </span>
        </div>
      </div>
    </div>
  );
}
