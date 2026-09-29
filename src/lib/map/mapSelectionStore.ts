/**
 * BHOO-MITRA AI — Phase 20 Centralized Map Selection Store
 * Provides a clean reactive store for 2D ↔ 3D synchronized selection state.
 * Includes loop prevention with selectionSource checking.
 */

import { useState, useEffect } from "react";
import { ActiveViewMode, SplitRatio, SelectionSource, MapSyncState, SyncEventFeedback } from "./mapTypes";

let globalState: MapSyncState = {
  selectedParcelId: "PARCEL-DEMO-014",
  selectedBuildingId: null,
  selectedEntityId: "PARCEL-DEMO-014",
  selectedSourceId: "SRC-BBMP-01",
  activeView: "3D",
  splitRatio: "50/50",
  syncEnabled: true,
  selectionSource: "system",
  lastFeedback: {
    id: "init-1",
    message: "2D ↔ 3D Synchronization Active",
    source: "system",
    timestamp: Date.now(),
  },
};

type Listener = (state: MapSyncState) => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((listener) => listener(globalState));
}

export const mapSyncStore = {
  getState: (): MapSyncState => globalState,

  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  selectEntity: (id: string | null, source: SelectionSource = "system", options?: { parcelId?: string; buildingId?: string; sourceId?: string }) => {
    if (!globalState.syncEnabled && source !== "system" && source !== "demo") {
      // If sync is paused, only update local state without firing cross-engine sync feedback
      globalState = {
        ...globalState,
        selectedEntityId: id,
        selectedParcelId: options?.parcelId ?? (id?.startsWith("PARCEL") ? id : globalState.selectedParcelId),
        selectedBuildingId: options?.buildingId ?? (id?.startsWith("BLDG") ? id : null),
        selectionSource: source,
      };
      notifyListeners();
      return;
    }

    if (id === globalState.selectedEntityId && source === globalState.selectionSource) {
      return; // Avoid redundant state mutations
    }

    let isParcel = id ? id.startsWith("PARCEL") : false;
    let isBuilding = id ? id.startsWith("BLDG") : false;

    let computedParcelId = options?.parcelId ?? (isParcel ? id : globalState.selectedParcelId);
    let computedBuildingId = options?.buildingId ?? (isBuilding ? id : null);

    let sourceLabel = source === "2d" ? "2D Map" : source === "3d" ? "3D Scene" : source === "search" ? "Command Search" : "System";
    let targetLabel = source === "2d" ? "3D Scene" : source === "3d" ? "2D Map" : "2D & 3D Views";
    let entityLabel = isBuilding ? `Building ${id}` : isParcel ? `Parcel ${id}` : "Entity";

    const feedback: SyncEventFeedback = {
      id: `sync-${Date.now()}`,
      message: `${sourceLabel} → ${targetLabel}: ${entityLabel} Synchronized`,
      source,
      timestamp: Date.now(),
    };

    globalState = {
      ...globalState,
      selectedEntityId: id,
      selectedParcelId: computedParcelId,
      selectedBuildingId: computedBuildingId,
      selectedSourceId: options?.sourceId ?? globalState.selectedSourceId,
      selectionSource: source,
      lastFeedback: feedback,
    };

    notifyListeners();
  },

  setActiveView: (view: ActiveViewMode) => {
    globalState = {
      ...globalState,
      activeView: view,
    };
    notifyListeners();
  },

  setSplitRatio: (ratio: SplitRatio) => {
    globalState = {
      ...globalState,
      splitRatio: ratio,
    };
    notifyListeners();
  },

  setSyncEnabled: (enabled: boolean) => {
    const feedback: SyncEventFeedback = {
      id: `sync-toggle-${Date.now()}`,
      message: enabled ? "2D ↔ 3D Synchronization Resumed" : "2D ↔ 3D Synchronization Paused",
      source: "system",
      timestamp: Date.now(),
    };

    globalState = {
      ...globalState,
      syncEnabled: enabled,
      lastFeedback: feedback,
    };
    notifyListeners();
  },

  clearSelection: (source: SelectionSource = "system") => {
    globalState = {
      ...globalState,
      selectedEntityId: null,
      selectedParcelId: null,
      selectedBuildingId: null,
      selectionSource: source,
      lastFeedback: {
        id: `clear-${Date.now()}`,
        message: "Selection Cleared Across Engines",
        source,
        timestamp: Date.now(),
      },
    };
    notifyListeners();
  },
};

/**
 * React Hook for subscribing to 2D ↔ 3D Map Synchronization State
 */
export function useMapSync() {
  const [state, setState] = useState<MapSyncState>(mapSyncStore.getState());

  useEffect(() => {
    const unsubscribe = mapSyncStore.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  return {
    ...state,
    selectEntity: mapSyncStore.selectEntity,
    setActiveView: mapSyncStore.setActiveView,
    setSplitRatio: mapSyncStore.setSplitRatio,
    setSyncEnabled: mapSyncStore.setSyncEnabled,
    clearSelection: mapSyncStore.clearSelection,
  };
}
