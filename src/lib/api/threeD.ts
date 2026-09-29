/**
 * BHOO-MITRA AI — 3D Intelligence Data API Service
 * Strongly typed service exposing 3D parcels, extruded buildings, and spatial relationship metadata.
 */

import { ThreeDParcel, ThreeDBuilding, ThreeDSourceRepresentation, ParcelBuildingRelationship } from "@/lib/maps/cesium/types";
import { MOCK_3D_PARCELS, MOCK_3D_BUILDINGS } from "@/lib/mock/threeD";

export async function get3DParcels(): Promise<ThreeDParcel[]> {
  return MOCK_3D_PARCELS;
}

export async function get3DParcel(parcelId: string): Promise<ThreeDParcel | null> {
  return MOCK_3D_PARCELS.find((p) => p.id === parcelId || p.parcelId === parcelId) || null;
}

export async function get3DBuildings(parcelId?: string): Promise<ThreeDBuilding[]> {
  if (parcelId) {
    return MOCK_3D_BUILDINGS.filter((b) => b.parcelId === parcelId);
  }
  return MOCK_3D_BUILDINGS;
}

export async function get3DBuilding(buildingId: string): Promise<ThreeDBuilding | null> {
  return MOCK_3D_BUILDINGS.find((b) => b.id === buildingId || b.buildingId === buildingId) || null;
}

export async function getParcelBuildings(parcelId: string): Promise<ThreeDBuilding[]> {
  return get3DBuildings(parcelId);
}

export async function get3DSourceRepresentations(parcelId: string): Promise<ThreeDSourceRepresentation[]> {
  const parcel = await get3DParcel(parcelId);
  return parcel?.sourceRepresentations || [];
}

export async function getParcelBuildingRelationship(parcelId: string): Promise<ParcelBuildingRelationship | null> {
  const parcel = await get3DParcel(parcelId);
  if (!parcel) return null;

  const buildings = await getParcelBuildings(parcelId);
  const totalBuiltUp = buildings.reduce((acc, b) => acc + b.metrics.footprintArea, 0);
  const coveragePercent = parcel.metrics.area > 0 ? (totalBuiltUp / parcel.metrics.area) * 100 : 0;

  return {
    parcelId: parcel.id,
    parcelArea: parcel.metrics.area,
    buildingCount: buildings.length,
    totalBuiltUpArea: totalBuiltUp,
    coverageRatioPercent: Math.round(coveragePercent * 10) / 10,
    buildings,
  };
}
