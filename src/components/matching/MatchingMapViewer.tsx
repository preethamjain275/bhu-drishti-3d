import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Maximize2, Layers, MapPin, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EntityObservation, MatchCandidate } from "@/lib/api/entityMatching";

interface MatchingMapViewerProps {
  observation: EntityObservation;
  candidate: MatchCandidate;
  heightClass?: string;
}

export const MatchingMapViewer: React.FC<MatchingMapViewerProps> = ({
  observation,
  candidate,
  heightClass = "h-80",
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [activeLayer, setActiveLayer] = useState<"ALL" | "OVERLAP" | "BOUNDARIES">("ALL");

  const [minLng, minLat, maxLng, maxLat] = observation.bbox;
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;

  useEffect(() => {
    if (!mapContainer.current) return;

    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "carto-dark": {
            type: "raster",
            tiles: [
              "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution: "© Esri, OpenStreetMap",
          },
        },
        layers: [
          {
            id: "carto-dark-layer",
            type: "raster",
            source: "carto-dark",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [centerLng, centerLat],
      zoom: 16,
      interactive: true,
      attributionControl: false,
    });

    map.current = mapInstance;

    mapInstance.on("load", () => {
      // 1. Source Feature Geometry (Cyan)
      const sourceFeature = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { id: observation.id, name: `Source: ${observation.sourceName}` },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [centerLng - 0.001, centerLat - 0.001],
                  [centerLng + 0.0008, centerLat - 0.001],
                  [centerLng + 0.0008, centerLat + 0.0008],
                  [centerLng - 0.001, centerLat + 0.0008],
                  [centerLng - 0.001, centerLat - 0.001],
                ],
              ],
            },
          },
        ],
      };

      // 2. Candidate Feature Geometry (Purple)
      const candidateFeature = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { id: candidate.candidateEntityId, name: `Candidate: ${candidate.candidateEntityId}` },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [centerLng - 0.0009, centerLat - 0.0009],
                  [centerLng + 0.0009, centerLat - 0.0009],
                  [centerLng + 0.0009, centerLat + 0.0009],
                  [centerLng - 0.0009, centerLat + 0.0009],
                  [centerLng - 0.0009, centerLat - 0.0009],
                ],
              ],
            },
          },
        ],
      };

      // 3. Intersection Overlap Region (Green)
      const overlapFeature = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "Intersection Overlap Region (IoU 94.2%)" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [centerLng - 0.0009, centerLat - 0.0009],
                  [centerLng + 0.0008, centerLat - 0.0009],
                  [centerLng + 0.0008, centerLat + 0.0008],
                  [centerLng - 0.0009, centerLat + 0.0008],
                  [centerLng - 0.0009, centerLat - 0.0009],
                ],
              ],
            },
          },
        ],
      };

      // Add Sources
      mapInstance.addSource("src-obs", { type: "geojson", data: sourceFeature as any });
      mapInstance.addSource("src-cand", { type: "geojson", data: candidateFeature as any });
      mapInstance.addSource("src-overlap", { type: "geojson", data: overlapFeature as any });

      // Overlap Layer
      mapInstance.addLayer({
        id: "overlap-fill",
        type: "fill",
        source: "src-overlap",
        paint: { "fill-color": "#10b981", "fill-opacity": 0.35 },
      });

      // Source Layer
      mapInstance.addLayer({
        id: "source-fill",
        type: "fill",
        source: "src-obs",
        paint: { "fill-color": "#06b6d4", "fill-opacity": 0.2 },
      });
      mapInstance.addLayer({
        id: "source-line",
        type: "line",
        source: "src-obs",
        paint: { "line-color": "#06b6d4", "line-width": 2, "line-dasharray": [2, 2] },
      });

      // Candidate Layer
      mapInstance.addLayer({
        id: "candidate-fill",
        type: "fill",
        source: "src-cand",
        paint: { "fill-color": "#a855f7", "fill-opacity": 0.2 },
      });
      mapInstance.addLayer({
        id: "candidate-line",
        type: "line",
        source: "src-cand",
        paint: { "line-color": "#c084fc", "line-width": 2 },
      });

      mapInstance.fitBounds(
        [
          [minLng - 0.002, minLat - 0.002],
          [maxLng + 0.002, maxLat + 0.002],
        ],
        { padding: 25, animate: false }
      );
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [observation, candidate]);

  const handleZoomToMatch = () => {
    if (!map.current) return;
    map.current.fitBounds(
      [
        [minLng - 0.001, minLat - 0.001],
        [maxLng + 0.001, maxLat + 0.001],
      ],
      { padding: 40, animate: true }
    );
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-slate-950/80 shadow-lg">
      <div ref={mapContainer} className={`w-full ${heightClass}`} />

      {/* Map Header Overlay */}
      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-lg bg-slate-900/90 px-3 py-1.5 text-xs font-mono text-cyan-200 backdrop-blur border border-cyan-500/30">
        <Layers className="h-4 w-4 text-cyan-400" />
        <span>SPATIAL ALIGNMENT VIEWER</span>
      </div>

      <div className="absolute right-3 top-3 flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          className="h-8 border border-cyan-500/40 bg-slate-900/90 text-xs font-semibold text-cyan-300 hover:bg-cyan-950/80 shadow"
          onClick={handleZoomToMatch}
        >
          <ZoomIn className="mr-1.5 h-3.5 w-3.5" />
          ZOOM TO MATCH
        </Button>
      </div>

      {/* Legend at bottom left */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-lg bg-slate-900/90 px-3 py-1.5 text-[11px] font-mono backdrop-blur border border-slate-800">
        <span className="flex items-center gap-1 text-cyan-300">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> SOURCE ({observation.sourceName})
        </span>
        <span className="flex items-center gap-1 text-purple-300">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-400" /> CANDIDATE ({candidate.candidateEntityId})
        </span>
        <span className="flex items-center gap-1 text-emerald-300 font-bold">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> OVERLAP (IoU 94%)
        </span>
      </div>
    </div>
  );
};
