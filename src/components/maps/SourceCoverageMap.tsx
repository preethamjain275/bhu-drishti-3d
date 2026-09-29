import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ExternalLink, Layers, Maximize2, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DataSource } from "@/lib/api/sources";

interface SourceCoverageMapProps {
  source: DataSource;
  onOpenInMainMap?: () => void;
  heightClass?: string;
}

export const SourceCoverageMap: React.FC<SourceCoverageMapProps> = ({
  source,
  onOpenInMainMap,
  heightClass = "h-64",
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const [minLng, minLat, maxLng, maxLat] = source.spatial.bbox;
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
      zoom: 15,
      interactive: true,
      attributionControl: false,
    });

    map.current = mapInstance;

    mapInstance.on("load", () => {
      // Add Coverage Bounding Box polygon source & layer
      const bboxPolygon = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: `${source.name} Boundary` },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [minLng, minLat],
                  [maxLng, minLat],
                  [maxLng, maxLat],
                  [minLng, maxLat],
                  [minLng, minLat],
                ],
              ],
            },
          },
        ],
      };

      mapInstance.addSource("coverage-bbox-src", {
        type: "geojson",
        data: bboxPolygon as any,
      });

      mapInstance.addLayer({
        id: "coverage-bbox-fill",
        type: "fill",
        source: "coverage-bbox-src",
        paint: {
          "fill-color": "#06b6d4",
          "fill-opacity": 0.12,
        },
      });

      mapInstance.addLayer({
        id: "coverage-bbox-outline",
        type: "line",
        source: "coverage-bbox-src",
        paint: {
          "line-color": "#38bdf8",
          "line-width": 2,
          "line-dasharray": [3, 2],
        },
      });

      // Synthetic sample parcel features inside bbox
      const sampleParcels = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { id: "PARCEL-DEMO-014", owner: "Devi Sharan & Sons", area: "2,465 m²", status: "VERIFIED" },
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
          {
            type: "Feature",
            properties: { id: "PARCEL-DEMO-015", owner: "Municipal Infra Corp", area: "1,840 m²", status: "VALIDATED" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [centerLng + 0.001, centerLat - 0.001],
                  [centerLng + 0.0022, centerLat - 0.001],
                  [centerLng + 0.0022, centerLat + 0.0008],
                  [centerLng + 0.001, centerLat + 0.0008],
                  [centerLng + 0.001, centerLat - 0.001],
                ],
              ],
            },
          },
        ],
      };

      mapInstance.addSource("sample-parcels-src", {
        type: "geojson",
        data: sampleParcels as any,
      });

      mapInstance.addLayer({
        id: "sample-parcels-fill",
        type: "fill",
        source: "sample-parcels-src",
        paint: {
          "fill-color": "#3b82f6",
          "fill-opacity": 0.25,
        },
      });

      mapInstance.addLayer({
        id: "sample-parcels-outline",
        type: "line",
        source: "sample-parcels-src",
        paint: {
          "line-color": "#60a5fa",
          "line-width": 1.5,
        },
      });

      mapInstance.on("mouseenter", "sample-parcels-fill", (e) => {
        mapInstance.getCanvas().style.cursor = "pointer";
        if (e.features && e.features[0]) {
          const propId = e.features[0].properties?.["id"];
          if (propId) setHoveredFeature(propId);
        }
      });

      mapInstance.on("mouseleave", "sample-parcels-fill", () => {
        mapInstance.getCanvas().style.cursor = "";
        setHoveredFeature(null);
      });

      mapInstance.fitBounds(
        [
          [minLng - 0.002, minLat - 0.002],
          [maxLng + 0.002, maxLat + 0.002],
        ],
        { padding: 20, animate: false }
      );
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [source]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/80 shadow-lg">
      <div ref={mapContainer} className={`w-full ${heightClass}`} />

      {/* Overlay controls */}
      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-lg bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-cyan-200 backdrop-blur border border-cyan-500/30">
        <Layers className="h-3.5 w-3.5 text-cyan-400" />
        <span>{source.spatial.crs} ({source.spatial.geometryType})</span>
      </div>

      <div className="absolute right-3 top-3 flex items-center gap-2">
        {onOpenInMainMap && (
          <Button
            size="sm"
            variant="secondary"
            className="h-8 border border-cyan-500/40 bg-slate-900/90 text-xs font-semibold text-cyan-300 hover:bg-cyan-950/80 hover:text-cyan-100 shadow"
            onClick={onOpenInMainMap}
          >
            <Maximize2 className="mr-1.5 h-3.5 w-3.5" />
            OPEN IN MAIN MAP
          </Button>
        )}
      </div>

      {hoveredFeature && (
        <div className="absolute bottom-3 left-3 rounded-md bg-slate-900/90 px-3 py-1.5 text-xs text-slate-200 backdrop-blur border border-cyan-500/40 shadow-md">
          <span className="font-semibold text-cyan-400">{hoveredFeature}</span>
          <span className="ml-2 text-slate-400">· Click to inspect feature</span>
        </div>
      )}

      <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-md bg-slate-950/80 px-2 py-1 text-[10px] font-mono text-slate-400 backdrop-blur border border-slate-800">
        <MapPin className="h-3 w-3 text-cyan-400" />
        <span>BBOX: [{minLng.toFixed(3)}, {minLat.toFixed(3)}, {maxLng.toFixed(3)}, {maxLat.toFixed(3)}]</span>
      </div>
    </div>
  );
};
