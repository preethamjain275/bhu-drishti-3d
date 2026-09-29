import React, { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { municipalData, registryData, surveyData } from "@/lib/mock/geo-data";
import { get2DParcelFeatureCollection, get2DBuildingFeatureCollection, getEntityCenter } from "@/lib/map/mapSync";
import { SelectionSource } from "@/lib/map/mapTypes";
import { cn } from "@/lib/utils";
import { type ActiveLayers } from "./LayerControl";
import { RefreshCw, AlertTriangle, MapPin } from "lucide-react";

const MAP_STYLE = {
  version: 8,
  sources: {
    "osm-tiles": {
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
      id: "base-map",
      type: "raster",
      source: "osm-tiles",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

import { LayerVisibilityState } from "@/lib/maps/cesium/types";

interface MapEngineProps {
  className?: string;
  onParcelSelect?: (parcelId: string | null, source?: SelectionSource) => void;
  selectedParcelId?: string | null;
  selectedBuildingId?: string | null;
  selectedEntityId?: string | null;
  activeLayers?: ActiveLayers | LayerVisibilityState | Record<string, boolean>;
  confidenceMode?: boolean;
}

export function MapEngine({
  className,
  onParcelSelect,
  selectedParcelId,
  selectedBuildingId,
  selectedEntityId,
  activeLayers = {
    municipal: true,
    registry: true,
    survey: true,
    parcels: true,
    buildings: true,
  },
}: MapEngineProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const activeEntityId = selectedEntityId || selectedBuildingId || selectedParcelId || "PARCEL-DEMO-014";

  const initMap = useCallback(() => {
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    setLoaded(false);
    setError(null);

    if (!mapContainer.current) return;

    try {
      const m = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLE as unknown as maplibregl.StyleSpecification,
        center: [77.593, 12.973],
        zoom: 16.5,
        pitch: 0,
        maxZoom: 22,
        fadeDuration: 0,
        trackResize: true,
      });
      map.current = m;

      m.on("error", (e) => {
        console.warn("MapEngine notice:", e.error?.message);
      });

      m.on("load", () => {
        m.resize();
        setTimeout(() => m.resize(), 100);
        setTimeout(() => m.resize(), 400);

        try {
          // Add Synchronized 2D GeoJSON sources for 3D parcels & building footprints
          const parcelGeoJSON = get2DParcelFeatureCollection();
          const buildingGeoJSON = get2DBuildingFeatureCollection();

          m.addSource("sync-parcels-source", { type: "geojson", data: parcelGeoJSON, generateId: true });
          m.addSource("sync-buildings-source", { type: "geojson", data: buildingGeoJSON, generateId: true });

          // Add legacy sources
          m.addSource("municipal-source", { type: "geojson", data: municipalData, generateId: true });
          m.addSource("registry-source", { type: "geojson", data: registryData, generateId: true });
          m.addSource("survey-source", { type: "geojson", data: surveyData, generateId: true });

          // Synchronized Parcel Fill Layer
          m.addLayer({
            id: "sync-parcels-fill",
            type: "fill",
            source: "sync-parcels-source",
            paint: {
              "fill-color": [
                "match",
                ["get", "landUse"],
                "Commercial", "#0ea5e9",
                "Residential", "#10b981",
                "Institutional", "#8b5cf6",
                "Vacant", "#f59e0b",
                "Mixed Use", "#ec4899",
                "#14b8a6",
              ],
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "selected"], false], 0.55,
                ["boolean", ["feature-state", "hover"], false], 0.45,
                0.28,
              ],
            },
          });

          // Synchronized Parcel Boundary Line Layer
          m.addLayer({
            id: "sync-parcels-line",
            type: "line",
            source: "sync-parcels-source",
            paint: {
              "line-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false], "#00ffff",
                "#38bdf8",
              ],
              "line-width": [
                "case",
                ["boolean", ["feature-state", "selected"], false], 3.5,
                1.5,
              ],
            },
          });

          // Synchronized Buildings Footprint Layer
          m.addLayer({
            id: "sync-buildings-fill",
            type: "fill",
            source: "sync-buildings-source",
            paint: {
              "fill-color": [
                "case",
                ["boolean", ["feature-state", "selected"], false], "#a855f7",
                "#818cf8",
              ],
              "fill-opacity": 0.65,
            },
          });

          m.addLayer({
            id: "sync-buildings-line",
            type: "line",
            source: "sync-buildings-source",
            paint: {
              "line-color": "#c084fc",
              "line-width": 1.5,
            },
          });

          // Standard legacy layers
          const colors = { municipal: "#00ffff", registry: "#a78bfa", survey: "#fbbf24" };
          m.addLayer({
            id: "municipal-fill",
            type: "fill",
            source: "municipal-source",
            paint: {
              "fill-color": colors.municipal,
              "fill-opacity": 0.25,
            },
          });
          m.addLayer({
            id: "municipal-line",
            type: "line",
            source: "municipal-source",
            paint: {
              "line-color": colors.municipal,
              "line-width": 2,
            },
          });

          setLoaded(true);
        } catch (layerError) {
          console.error("Failed to add map layers:", layerError);
          setLoaded(true);
        }
      });
    } catch (initError) {
      console.error("Map initialization notice:", initError);
      setLoaded(true);
    }
  }, [retryCount]);

  useEffect(() => {
    initMap();

    // ResizeObserver on the container to always keep MapLibre correctly sized
    let observer: ResizeObserver | null = null;
    if (mapContainer.current) {
      observer = new ResizeObserver(() => {
        map.current?.resize();
      });
      observer.observe(mapContainer.current);
    }

    return () => {
      observer?.disconnect();
      map.current?.remove();
      map.current = null;
    };
  }, [initMap]);

  // Click & hover handlers
  useEffect(() => {
    if (!loaded || !map.current) return;
    const m = map.current;

    const clickableLayers = ["sync-parcels-fill", "sync-buildings-fill", "municipal-fill"];

    clickableLayers.forEach((layerId) => {
      if (!m.getLayer(layerId)) return;
      m.on("click", layerId, (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const props = feature?.properties;
          if (props && props["id"]) {
            const targetId = props["id"] as string;
            if (onParcelSelect) {
              onParcelSelect(targetId, "2d");
            }
          }
        }
      });

      m.on("mouseenter", layerId, () => {
        m.getCanvas().style.cursor = "pointer";
      });

      m.on("mouseleave", layerId, () => {
        m.getCanvas().style.cursor = "";
      });
    });
  }, [loaded, onParcelSelect]);

  // Synchronized Selection Highlighting & FlyTo Camera
  useEffect(() => {
    if (!loaded || !map.current || !activeEntityId) return;
    const m = map.current;

    const center = getEntityCenter(activeEntityId);
    if (center) {
      m.flyTo({
        center,
        zoom: 17,
        duration: 900,
        essential: true,
      });
    }
  }, [loaded, activeEntityId]);

  // Synchronized Layer Visibility
  useEffect(() => {
    if (!loaded || !map.current) return;
    const m = map.current;

    const setVis = (layerId: string, visible: boolean) => {
      if (m.getLayer(layerId)) {
        m.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
      }
    };

    const layersRecord = activeLayers as Record<string, boolean | undefined>;
    const showParcels = layersRecord["parcels"] ?? true;
    const showBuildings = layersRecord["buildings"] ?? true;

    setVis("sync-parcels-fill", showParcels);
    setVis("sync-parcels-line", showParcels);
    setVis("sync-buildings-fill", showBuildings);
    setVis("sync-buildings-line", showBuildings);

    setVis("municipal-fill", layersRecord["municipal"] ?? true);
    setVis("municipal-line", layersRecord["municipal"] ?? true);
  }, [activeLayers, loaded]);

  return (
    <div className={cn("relative h-full w-full bg-[#0a0f18] min-h-[400px]", className)}>
      <div ref={mapContainer} className="absolute inset-0 z-0 h-full w-full" />

      {/* Map Attribution Badge */}
      <div className="absolute bottom-2 left-2 z-10 glass-badge px-2.5 py-1 text-[10px] font-mono text-cyan-400">
        MapLibre 2D GIS · EPSG:4326
      </div>
    </div>
  );
}
