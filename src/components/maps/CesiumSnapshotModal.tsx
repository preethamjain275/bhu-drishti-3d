import React, { useState } from "react";
import { InvestigationSnapshot, ThreeDConflict } from "@/lib/maps/cesium/types";
import { X, Camera, Save, CheckCircle2, History } from "lucide-react";

interface CesiumSnapshotModalProps {
  isOpen: boolean;
  conflict: ThreeDConflict | null;
  onClose: () => void;
  onSaveSnapshot: (snapshot: InvestigationSnapshot) => void;
}

export function CesiumSnapshotModal({
  isOpen,
  conflict,
  onClose,
  onSaveSnapshot,
}: CesiumSnapshotModalProps) {
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  if (!isOpen || !conflict) return null;

  const handleSave = () => {
    const newSnapshot: InvestigationSnapshot = {
      snapshotId: `SNP-3D-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      conflictId: conflict.conflictId,
      entityId: conflict.entityId,
      compareMode: "BOTH",
      visualMode: "Conflict Ready",
      metrics: {
        areaDiff: conflict.geometryDifference?.areaDifference ?? 0,
        iou: conflict.geometryDifference?.iou ?? 1.0,
      },
      notes: notes || "3D Conflict Investigation Snapshot recorded.",
    };

    onSaveSnapshot(newSnapshot);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-2xl p-5 shadow-2xl text-slate-100 space-y-4 font-sans animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-mono font-bold text-sm text-purple-300">
            <Camera className="h-4 w-4" />
            CREATE INVESTIGATION SNAPSHOT
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Snapshot Summary */}
        <div className="space-y-2 font-mono text-xs p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span>Target Conflict:</span>
            <span className="text-purple-300 font-bold">{conflict.conflictId}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Entity ID:</span>
            <span className="text-teal-300 font-bold">{conflict.entityId}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Conflict Type:</span>
            <span className="text-amber-300 font-bold">{conflict.type}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Timestamp:</span>
            <span className="text-slate-300">{new Date().toLocaleString()}</span>
          </div>
        </div>

        {/* Investigator Notes */}
        <div className="space-y-1.5 font-mono text-xs">
          <label className="text-slate-400 font-bold block">INVESTIGATOR NOTES & EVIDENCE REASONING</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record investigation observations, metric discrepancies, or evidence flags..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-sans text-xs focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-purple-500/20"
          >
            {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "SNAPSHOT SAVED!" : "SAVE SNAPSHOT"}
          </button>
        </div>

      </div>
    </div>
  );
}
