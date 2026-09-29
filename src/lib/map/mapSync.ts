/**
 * BHOO-MITRA AI — Phase 20 Map Synchronization Helper Utilities
 * Harmonizes 2D MapLibre GeoJSON data with 3D Cesium entities.
 */

import { FeatureCollection, Polygon, Feature } from "geojson";
import { MOCK_3D_PARCELS, MOCK_3D_BUILDINGS } from "@/lib/mock/threeD";
import { ThreeDParcel, ThreeDBuilding } from "@/lib/maps/cesium/types";

export interface GeoJSONParcelProps {
  id: string;
  parcelId: string;
  canonicalEntityId: string;
  landUse: string;
  status: string;
  confidence: number;
  area: number;
  buildingCount: number;
  conflictStatus: string;
  verificationStatus: string;
  sourceId: string;
  sourceName: string;
}

export interface GeoJSONBuildingProps {
  id: string;
  buildingId: string;
  parcelId: string;
  canonicalEntityId: string;
  usage: string;
  status: string;
  height: number;
  floorCount: number;
  confidence: number;
  conflictStatus: string;
}

/**
 * Returns 2D GeoJSON FeatureCollection of all 3D urban parcels
 */
export function get2DParcelFeatureCollection(): FeatureCollection<Polygon, GeoJSONParcelProps> {
  const features: Feature<Polygon, GeoJSONParcelProps>[] = MOCK_3D_PARCELS.map((p: ThreeDParcel) => ({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: p.geometry.coordinates,
    },
    properties: {
      id: p.id,
      parcelId: p.parcelId,
      canonicalEntityId: p.canonicalEntityId,
      landUse: p.landUse,
      status: p.propertyStatus,
      confidence: p.confidence,
      area: p.metrics.area,
      buildingCount: p.metrics.buildingCount,
      conflictStatus: p.conflictStatus,
      verificationStatus: p.verificationStatus,
      sourceId: p.sourceId,
      sourceName: p.sourceName,
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}

/**
 * Returns 2D GeoJSON FeatureCollection of all 3D building footprint polygons
 */
export function get2DBuildingFeatureCollection(): FeatureCollection<Polygon, GeoJSONBuildingProps> {
  const features: Feature<Polygon, GeoJSONBuildingProps>[] = MOCK_3D_BUILDINGS.map((b: ThreeDBuilding) => ({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: b.geometry.coordinates,
    },
    properties: {
      id: b.id,
      buildingId: b.buildingId,
      parcelId: b.parcelId,
      canonicalEntityId: b.canonicalEntityId,
      usage: b.usage,
      status: b.status,
      height: b.metrics.height,
      floorCount: b.metrics.floorCount,
      confidence: b.confidence,
      conflictStatus: b.conflictStatus,
    },
  }));

  return {
    type: "FeatureCollection",
    features,
  };
}

/**
 * Calculate bounding box centroid for flyTo / centering
 */
export function getEntityCenter(id: string): [number, number] | null {
  const parcel = MOCK_3D_PARCELS.find((p) => p.id === id);
  if (parcel && parcel.geometry.coordinates[0]) {
    const ring = parcel.geometry.coordinates[0];
    let sumLng = 0;
    let sumLat = 0;
    ring.forEach(([lng = 0, lat = 0]) => {
      sumLng += lng;
      sumLat += lat;
    });
    return [sumLng / ring.length, sumLat / ring.length];
  }

  const bldg = MOCK_3D_BUILDINGS.find((b) => b.id === id);
  if (bldg && bldg.geometry.coordinates[0]) {
    const ring = bldg.geometry.coordinates[0];
    let sumLng = 0;
    let sumLat = 0;
    ring.forEach(([lng = 0, lat = 0]) => {
      sumLng += lng;
      sumLat += lat;
    });
    return [sumLng / ring.length, sumLat / ring.length];
  }

  return null;
}
