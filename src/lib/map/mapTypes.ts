/**
 * BHOO-MITRA AI — Phase 20 2D ↔ 3D Map Synchronization Types
 */

export type ActiveViewMode = "2D" | "3D" | "SPLIT";
export type SplitRatio = "50/50" | "60/40" | "40/60";
export type SelectionSource = "2d" | "3d" | "search" | "system" | "demo";
export type SyncStatus = "active" | "paused";

export interface SyncEventFeedback {
  id: string;
  message: string;
  source: SelectionSource;
  timestamp: number;
}

export interface MapSyncState {
  selectedParcelId: string | null;
  selectedBuildingId: string | null;
  selectedEntityId: string | null;
  selectedSourceId: string | null;
  activeView: ActiveViewMode;
  splitRatio: SplitRatio;
  syncEnabled: boolean;
  selectionSource: SelectionSource;
  lastFeedback: SyncEventFeedback | null;
}

export interface CommonMapEngine {
  selectEntity: (id: string, source?: SelectionSource) => void;
  clearSelection: () => void;
  flyToEntity: (id: string) => void;
  highlightEntity: (id: string) => void;
  setLayerVisibility: (layerKey: string, visible: boolean) => void;
}
