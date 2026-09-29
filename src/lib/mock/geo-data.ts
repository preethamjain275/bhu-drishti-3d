import type { FeatureCollection, Polygon } from "geojson";

export interface ParcelProperties {
  id: string;
  source: string;
  area: number;
  landUse: string;
  ownerReference?: string;
  surveyNumber?: string;
  confidence: number;
  status: "VERIFIED" | "MATCHED" | "CONFLICT" | "PENDING";
  updatedAt: string;
}

// Helper to offset coordinates for slight source differences
const offsetCoords = (coords: number[][][], dx: number, dy: number): number[][][] => {
  const ring = coords[0];
  if (!ring) return [];
  return [ring.map(([x = 0, y = 0]) => [x + dx, y + dy])];
};

// Base coordinates for 5 parcels (we will generate variations for different sources)
// Coordinates roughly in New Delhi (longitude, latitude)
const baseParcels = [
  { id: "PARCEL-DEMO-001", coords: [[[77.2, 28.6], [77.201, 28.6], [77.201, 28.601], [77.2, 28.601], [77.2, 28.6]]], use: "Residential", area: 1200 },
  { id: "PARCEL-DEMO-002", coords: [[[77.2015, 28.6], [77.2025, 28.6], [77.2025, 28.601], [77.2015, 28.601], [77.2015, 28.6]]], use: "Commercial", area: 1400 },
  { id: "PARCEL-DEMO-003", coords: [[[77.203, 28.6], [77.204, 28.6], [77.204, 28.601], [77.203, 28.601], [77.203, 28.6]]], use: "Residential", area: 1100 },
  { id: "PARCEL-DEMO-004", coords: [[[77.2, 28.6015], [77.201, 28.6015], [77.201, 28.6025], [77.2, 28.6025], [77.2, 28.6015]]], use: "Public", area: 1300 },
  { id: "PARCEL-DEMO-005", coords: [[[77.2015, 28.6015], [77.2025, 28.6015], [77.2025, 28.6025], [77.2015, 28.6025], [77.2015, 28.6015]]], use: "Industrial", area: 2500 },
];

export const generateSourceData = (sourceName: string, dx: number, dy: number, baseConfidence: number): FeatureCollection<Polygon, ParcelProperties> => {
  return {
    type: "FeatureCollection",
    features: baseParcels.map((p, i) => {
       // Simulate conflict for parcel 3
       const isConflict = i === 2 && sourceName !== "Municipal GIS";
       const status = isConflict ? "CONFLICT" : "MATCHED";
       const finalDx = isConflict ? dx + 0.0003 : dx; // create a visible overlap/conflict
       
       return {
          type: "Feature",
          geometry: {
             type: "Polygon",
             coordinates: offsetCoords(p.coords, finalDx, dy)
          },
          properties: {
             id: p.id,
             source: sourceName,
             area: isConflict ? p.area * 1.1 : p.area,
             landUse: p.use,
             confidence: isConflict ? 0.45 : baseConfidence,
             status: status,
             updatedAt: new Date(Date.now() - i * 100000000).toISOString()
          }
       };
    })
  };
};

export const municipalData = generateSourceData("Municipal GIS", 0, 0, 0.95);
export const registryData = generateSourceData("Property Registry", 0.00005, 0.00005, 0.88);
export const surveyData = generateSourceData("Survey", -0.00002, 0.00002, 0.99);

// Combine all for global search
export const allParcels = [...municipalData.features, ...registryData.features, ...surveyData.features];
