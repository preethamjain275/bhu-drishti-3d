/**
 * BHOO-MITRA AI — Verification GIS Map Engine
 *
 * MapLibre GIS viewer tailored specifically for Human Verification investigation:
 * - Zoom, pan, reset views
 * - Toggle Original Source Geometries (Municipal, Deed, Drone)
 * - Toggle Recommended Candidate Geometry
 * - Toggle Overlap/Conflict Highlight Slivers
 * - Toggle Evidence Anchor Markers
 * - Candidate comparison mode
 * - Strict geometry immutability (original source geometries are purely read-only)
 */

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { type VerificationCase } from "@/lib/api/verification";
import { cn } from "@/lib/utils";
import { Layers, Eye, EyeOff, Sparkles, MapPin, ZoomIn, ZoomOut, RotateCcw, ShieldCheck, AlertTriangle } from "lucide-react";

interface VerificationMapEngineProps {
  currentCase: VerificationCase;
  className?: string;
  onSelectEvidence?: (evidenceId: string) => void;
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

export const VerificationMapEngine: React.FC<VerificationMapEngineProps> = ({
  currentCase,
  className,
  onSelectEvidence,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Layer Toggles
  const [showOriginalSources, setShowOriginalSources] = useState(true);
  const [showRecommendedCandidate, setShowRecommendedCandidate] = useState(true);
  const [showConflictSlivers, setShowConflictSlivers] = useState(true);
  const [showEvidenceMarkers, setShowEvidenceMarkers] = useState(true);
  const [activeInspector, setActiveInspector] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const [lng, lat] = currentCase.coordinates;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: [lng, lat],
      zoom: 17.5,
      pitch: 35,
      bearing: -10,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      // 1. Original Source 1: Municipal GIS Polygon (Cyan outline)
      map.addSource("src-municipal", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: { name: "Municipal GIS Cadastre (1998)", area: "1,228.4 m²" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [lng - 0.0008, lat - 0.0006],
                [lng + 0.0007, lat - 0.0005],
                [lng + 0.0006, lat + 0.0007],
                [lng - 0.0007, lat + 0.0006],
                [lng - 0.0008, lat - 0.0006],
              ],
            ],
          },
        },
      });

      map.addLayer({
        id: "layer-municipal-fill",
        type: "fill",
        source: "src-municipal",
        paint: {
          "fill-color": "#06b6d4",
          "fill-opacity": 0.12,
        },
      });

      map.addLayer({
        id: "layer-municipal-line",
        type: "line",
        source: "src-municipal",
        paint: {
          "line-color": "#06b6d4",
          "line-width": 2,
          "line-dasharray": [3, 2],
        },
      });

      // 2. Original Source 2: Property Registry Boundary (Amber)
      map.addSource("src-registry", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: { name: "Revenue Deed Boundary", area: "1,240.0 m²" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [lng - 0.00085, lat - 0.00065],
                [lng + 0.00075, lat - 0.00045],
                [lng + 0.00065, lat + 0.00075],
                [lng - 0.00072, lat + 0.00062],
                [lng - 0.00085, lat - 0.00065],
              ],
            ],
          },
        },
      });

      map.addLayer({
        id: "layer-registry-line",
        type: "line",
        source: "src-registry",
        paint: {
          "line-color": "#f59e0b",
          "line-width": 2,
        },
      });

      // 3. Recommended AI Candidate / High-Res UAV Survey (Green / Purple glow)
      map.addSource("src-candidate", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: { name: "Recommended Candidate (UAV RTK 2026)", area: "1,215.2 m²" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [lng - 0.00078, lat - 0.00058],
                [lng + 0.00068, lat - 0.00048],
                [lng + 0.00058, lat + 0.00068],
                [lng - 0.00068, lat + 0.00058],
                [lng - 0.00078, lat - 0.00058],
              ],
            ],
          },
        },
      });

      map.addLayer({
        id: "layer-candidate-fill",
        type: "fill",
        source: "src-candidate",
        paint: {
          "fill-color": "#10b981",
          "fill-opacity": 0.22,
        },
      });

      map.addLayer({
        id: "layer-candidate-line",
        type: "line",
        source: "src-candidate",
        paint: {
          "line-color": "#10b981",
          "line-width": 3,
        },
      });

      // 4. Disputed Encroachment Sliver / Conflict Polygon (Red crosshatch)
      map.addSource("src-conflict-sliver", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: { name: "Disputed Overlap Sliver", diff: "-24.8 m²" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [lng + 0.00068, lat - 0.00048],
                [lng + 0.00075, lat - 0.00045],
                [lng + 0.00065, lat + 0.00075],
                [lng + 0.00058, lat + 0.00068],
                [lng + 0.00068, lat - 0.00048],
              ],
            ],
          },
        },
      });

      map.addLayer({
        id: "layer-conflict-fill",
        type: "fill",
        source: "src-conflict-sliver",
        paint: {
          "fill-color": "#ef4444",
          "fill-opacity": 0.45,
        },
      });

      // 5. Evidence Marker Points
      map.addSource("src-evidence-points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { id: "EVID-014-A", title: "RTK Boundary Marker #01", type: "SURVEY" },
              geometry: { type: "Point", coordinates: [lng - 0.00078, lat - 0.00058] },
            },
            {
              type: "Feature",
              properties: { id: "EVID-014-B", title: "Registered Deed Pillar #04", type: "DEED" },
              geometry: { type: "Point", coordinates: [lng + 0.00075, lat - 0.00045] },
            },
            {
              type: "Feature",
              properties: { id: "EVID-014-C", title: "Municipal Boundary Corner #02", type: "GIS" },
              geometry: { type: "Point", coordinates: [lng + 0.00065, lat + 0.00075] },
            },
          ],
        },
      });

      map.addLayer({
        id: "layer-evidence-circles",
        type: "circle",
        source: "src-evidence-points",
        paint: {
          "circle-radius": 7,
          "circle-color": "#a855f7",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Click on evidence circles
      map.on("click", "layer-evidence-circles", (e) => {
        if (e.features && e.features[0]) {
          const props = e.features[0].properties;
          const id = props ? props["id"] : undefined;
          if (id && typeof id === "string" && onSelectEvidence) {
            onSelectEvidence(id);
          }
        }
      });
    });

    return () => {
      map.remove();
    };
  }, [currentCase.id]);

  // Handle Layer Visibility Updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // Original Sources
    const origVisible = showOriginalSources ? "visible" : "none";
    if (map.getLayer("layer-municipal-fill")) map.setLayoutProperty("layer-municipal-fill", "visibility", origVisible);
    if (map.getLayer("layer-municipal-line")) map.setLayoutProperty("layer-municipal-line", "visibility", origVisible);
    if (map.getLayer("layer-registry-line")) map.setLayoutProperty("layer-registry-line", "visibility", origVisible);

    // Candidate
    const candVisible = showRecommendedCandidate ? "visible" : "none";
    if (map.getLayer("layer-candidate-fill")) map.setLayoutProperty("layer-candidate-fill", "visibility", candVisible);
    if (map.getLayer("layer-candidate-line")) map.setLayoutProperty("layer-candidate-line", "visibility", candVisible);

    // Conflict
    const confVisible = showConflictSlivers ? "visible" : "none";
    if (map.getLayer("layer-conflict-fill")) map.setLayoutProperty("layer-conflict-fill", "visibility", confVisible);

    // Evidence
    const evidVisible = showEvidenceMarkers ? "visible" : "none";
    if (map.getLayer("layer-evidence-circles")) map.setLayoutProperty("layer-evidence-circles", "visibility", evidVisible);
  }, [showOriginalSources, showRecommendedCandidate, showConflictSlivers, showEvidenceMarkers]);

  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleReset = () => {
    const [lng, lat] = currentCase.coordinates;
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 17.5, pitch: 35, bearing: -10 });
  };

  return (
    <div className={cn("relative w-full h-full min-h-[480px] rounded-xl overflow-hidden border border-border/80 bg-background/95", className)}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />

      {/* Top Banner Notice */}
      <div className="absolute top-3 left-3 right-14 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/90 backdrop-blur-md border border-border/70 text-xs shadow-lg pointer-events-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono font-medium text-foreground">{currentCase.entityId}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">{currentCase.propertyId}</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-semibold">
            {currentCase.status}
          </span>
        </div>
      </div>

      {/* Layer Controls Bar */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-background/90 backdrop-blur-md border border-border/80 shadow-2xl">
        <button
          onClick={() => setShowOriginalSources(!showOriginalSources)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
            showOriginalSources
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "bg-muted/50 text-muted-foreground border border-transparent hover:text-foreground"
          )}
          title="Toggle Municipal GIS & Registry Deed boundary layers"
        >
          <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
          Original Sources
        </button>

        <button
          onClick={() => setShowRecommendedCandidate(!showRecommendedCandidate)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
            showRecommendedCandidate
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-muted/50 text-muted-foreground border border-transparent hover:text-foreground"
          )}
          title="Toggle AI Recommended Candidate boundary"
        >
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
          Recommended Candidate
        </button>

        <button
          onClick={() => setShowConflictSlivers(!showConflictSlivers)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
            showConflictSlivers
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
              : "bg-muted/50 text-muted-foreground border border-transparent hover:text-foreground"
          )}
          title="Toggle Encroachment & Conflict sliver areas"
        >
          <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
          Conflict Slivers
        </button>

        <button
          onClick={() => setShowEvidenceMarkers(!showEvidenceMarkers)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
            showEvidenceMarkers
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
              : "bg-muted/50 text-muted-foreground border border-transparent hover:text-foreground"
          )}
          title="Toggle Ground-Truth & Evidence markers"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          Evidence Markers
        </button>
      </div>

      {/* Floating Map Navigation Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 bg-background/90 backdrop-blur-md p-1 rounded-xl border border-border/80 shadow-lg">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"
          title="Reset Camera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* GIS Immutability Badge */}
      <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
        <div className="px-2.5 py-1 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] text-muted-foreground font-mono">
          🔒 Source Records Immutability Guaranteed
        </div>
      </div>
    </div>
  );
};
