/**
 * BHOO-MITRA AI — Map Engine Unified Abstraction
 * Supports 2D (MapLibre) and 3D (CesiumJS) visualization engines cleanly.
 */

export type MapMode = "2D" | "3D";

export interface MapEngineConfig {
  containerId: string;
  center: [number, number]; // [lon, lat]
  zoom: number;
  pitch?: number;
  bearing?: number;
}

export interface MapEngine {
  engineType: MapMode;
  initialize(config: MapEngineConfig): Promise<void>;
  destroy(): void;
  flyTo(coords: [number, number], zoomOrHeight?: number): void;
  selectEntity(entityId: string): void;
  setLayerVisibility(layerId: string, visible: boolean): void;
}
