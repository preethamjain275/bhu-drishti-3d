/**
 * BHOO-MITRA AI — Version Geometry Comparison Map
 *
 * Displays Version A geometry vs Version B geometry on a MapLibre map,
 * highlighting boundary shifts, area differences, and parcel centroids.
 *
 * ⚠️ SYNTHETIC DEMONSTRATION DATA
 */

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { type EntityVersion } from "@/lib/api/audit";
import { cn } from "@/lib/utils";

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

// Synthetic GeoJSON boundaries for Version V01 (Municipal original) vs V05 (Verified)
const GEOMETRY_GEOJSON: Record<string, any> = {
  V01: {
    type: "Feature",
    properties: { version: "V01", area: 2430 },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [77.2018, 28.6006],
          [77.203, 28.6007],
          [77.2029, 28.6018],
          [77.2017, 28.6016],
          [77.2018, 28.6006],
        ],
      ],
    },
  },
  V02: {
    type: "Feature",
    properties: { version: "V02", area: 2510 },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [77.20175, 28.60055],
          [77.2031, 28.60075],
          [77.2030, 28.6019],
          [77.20165, 28.60165],
          [77.20175, 28.60055],
        ],
      ],
    },
  },
  V03: {
    type: "Feature",
    properties: { version: "V03", area: 2465 },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [77.2018, 28.6006],
          [77.20305, 28.60072],
          [77.20295, 28.60185],
          [77.2017, 28.60162],
          [77.2018, 28.6006],
        ],
      ],
    },
  },
  V04: {
    type: "Feature",
    properties: { version: "V04", area: 2465 },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [77.20182, 28.6006],
          [77.20306, 28.60072],
          [77.20296, 28.60185],
          [77.20171, 28.60162],
          [77.20182, 28.6006],
        ],
      ],
    },
  },
  V05: {
    type: "Feature",
    properties: { version: "V05", area: 2465 },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [77.20182, 28.6006],
          [77.20306, 28.60072],
          [77.20296, 28.60185],
          [77.20171, 28.60162],
          [77.20182, 28.6006],
        ],
      ],
    },
  },
};

interface VersionMapEngineProps {
  versionA: EntityVersion;
  versionB: EntityVersion;
  className?: string;
}

export function VersionMapEngine({ versionA, versionB, className }: VersionMapEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE as any,
      center: [77.20245, 28.60125],
      zoom: 17,
      attributionControl: false,
      fadeDuration: 0,
      pixelRatio: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 1.5),
      trackResize: true,
      canvasContextAttributes: { antialias: false, powerPreference: "high-performance" },
    });

    mapRef.current = map;

    map.on("load", () => {
      // Source A
      const geoA = GEOMETRY_GEOJSON[versionA.version] ?? GEOMETRY_GEOJSON["V01"];
      map.addSource("ver-a-source", { type: "geojson", data: geoA });
      map.addLayer({
        id: "ver-a-fill",
        type: "fill",
        source: "ver-a-source",
        paint: { "fill-color": "#00ffff", "fill-opacity": 0.2 },
      });
      map.addLayer({
        id: "ver-a-line",
        type: "line",
        source: "ver-a-source",
        paint: { "line-color": "#00ffff", "line-width": 2.5, "line-dasharray": [2, 2] },
      });

      // Source B
      const geoB = GEOMETRY_GEOJSON[versionB.version] ?? GEOMETRY_GEOJSON["V05"];
      map.addSource("ver-b-source", { type: "geojson", data: geoB });
      map.addLayer({
        id: "ver-b-fill",
        type: "fill",
        source: "ver-b-source",
        paint: { "fill-color": "#fbbf24", "fill-opacity": 0.25 },
      });
      map.addLayer({
        id: "ver-b-line",
        type: "line",
        source: "ver-b-source",
        paint: { "line-color": "#fbbf24", "line-width": 3 },
      });

      setLoaded(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map features when version selection changes
  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    const map = mapRef.current;

    const geoA = GEOMETRY_GEOJSON[versionA.version] ?? GEOMETRY_GEOJSON["V01"];
    const geoB = GEOMETRY_GEOJSON[versionB.version] ?? GEOMETRY_GEOJSON["V05"];

    const srcA = map.getSource("ver-a-source") as maplibregl.GeoJSONSource;
    if (srcA) srcA.setData(geoA);

    const srcB = map.getSource("ver-b-source") as maplibregl.GeoJSONSource;
    if (srcB) srcB.setData(geoB);
  }, [versionA, versionB, loaded]);

  const handleZoomToEntity = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [77.20245, 28.60125],
      zoom: 17.8,
      speed: 1.2,
    });
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-[#0a0f18] min-h-[340px] flex flex-col items-center justify-center select-none", className)}>
      <div ref={containerRef} className="absolute inset-0 z-0 opacity-70" />

      {/* Instant High-Tech SVG Spatial CAD Overlay */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 500 320" preserveAspectRatio="xMidYMid meet">
        {/* Subtle coordinate grid lines */}
        <defs>
          <pattern id="cadGrid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" />
          </pattern>
          <pattern id="diffHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cadGrid)" />

        {/* Difference Area Highlight (Hatched) */}
        <polygon
          points="130,70 370,80 355,245 115,230"
          fill="url(#diffHatch)"
          className="animate-pulse"
        />

        {/* Version A Polygon (Cyan - Original) */}
        <polygon
          points="140,85 350,95 340,235 125,220"
          fill="rgba(6, 182, 212, 0.22)"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeDasharray="5 3"
        />

        {/* Version B Polygon (Amber - Canonical/Verified) */}
        <polygon
          points="130,70 370,80 355,245 115,230"
          fill="rgba(245, 158, 11, 0.18)"
          stroke="#f59e0b"
          strokeWidth="2.5"
        />

        {/* Centroid / Anchor points */}
        <circle cx="237" cy="158" r="4" fill="#06b6d4" />
        <circle cx="242" cy="156" r="4" fill="#f59e0b" />
        <line x1="237" y1="158" x2="242" y2="156" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 2" />

        {/* Vertex Markers */}
        <circle cx="140" cy="85" r="3" fill="#06b6d4" />
        <circle cx="350" cy="95" r="3" fill="#06b6d4" />
        <circle cx="340" cy="235" r="3" fill="#06b6d4" />
        <circle cx="125" cy="220" r="3" fill="#06b6d4" />

        <circle cx="130" cy="70" r="3.5" fill="#f59e0b" />
        <circle cx="370" cy="80" r="3.5" fill="#f59e0b" />
        <circle cx="355" cy="245" r="3.5" fill="#f59e0b" />
        <circle cx="115" cy="230" r="3.5" fill="#f59e0b" />

        {/* Dimensions callout label */}
        <text x="245" y="65" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          +35 m² Difference (+1.44%)
        </text>
        <text x="375" y="165" fill="#38bdf8" fontSize="9" fontFamily="monospace">
          Δ Centroid: 8.06m
        </text>
      </svg>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-col gap-1.5 rounded-lg border border-border/80 bg-slate-950/90 p-2.5 backdrop-blur-md text-xs shadow-xl pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="h-2 w-4 rounded bg-cyan border border-cyan/80" />
          <span className="font-mono text-[11px] font-semibold text-cyan">
            {versionA.version}: {versionA.title} ({versionA.geometry.area} m²)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-4 rounded bg-saffron border border-saffron/80" />
          <span className="font-mono text-[11px] font-semibold text-saffron">
            {versionB.version}: {versionB.title} ({versionB.geometry.area} m²)
          </span>
        </div>
      </div>

      {/* Zoom to parcel button */}
      <button
        onClick={handleZoomToEntity}
        className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-md border border-border/80 bg-slate-950/90 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-ivory backdrop-blur-md hover:bg-slate-800 transition-colors shadow-lg pointer-events-auto"
      >
        <span>📍 RESET CAD VIEW</span>
      </button>
    </div>
  );
}
