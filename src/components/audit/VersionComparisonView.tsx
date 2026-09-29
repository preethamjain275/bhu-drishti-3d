/**
 * BHOO-MITRA AI — Entity Version History & Side-by-Side Comparison
 *
 * Displays version progression V01 → V05 for canonical parcel PARCEL-DEMO-014
 * and provides side-by-side attribute, geometry, evidence, and spatial map diffs.
 */

import React, { useState, useEffect } from "react";
import {
  type EntityVersion,
  type VersionComparisonDiff,
  getEntityVersions,
  compareVersions,
} from "@/lib/api/audit";
import { VersionMapEngine } from "@/components/maps/VersionMapEngine";
import { GlassPanel, StatusBadge } from "@/components/ui/bhumitra";
import { cn } from "@/lib/utils";
import {
  GitCompare,
  Layers,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  FileCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function VersionComparisonView() {
  const [versions, setVersions] = useState<EntityVersion[]>([]);
  const [verAKey, setVerAKey] = useState<string>("V01");
  const [verBKey, setVerBKey] = useState<string>("V05");
  const [diff, setDiff] = useState<VersionComparisonDiff | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await getEntityVersions("PARCEL-DEMO-014");
      setVersions(list);
      const d = await compareVersions(verAKey, verBKey);
      setDiff(d);
      setLoading(false);
    }
    load();
  }, [verAKey, verBKey]);

  if (loading || !diff) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs font-mono">Loading Entity Version History…</p>
      </div>
    );
  }

  const verAObj = versions.find((v) => v.version === verAKey) ?? versions[0]!;
  const verBObj = versions.find((v) => v.version === verBKey) ?? versions[versions.length - 1]!;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-ivory">ENTITY VERSION HISTORY</h2>
            <span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-bold text-primary border border-primary/30">
              PARCEL-DEMO-014
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Harmonization states reflect analysis progression, not replacement of original government sources.
          </p>
        </div>
      </div>

      {/* Visual Version Progression Timeline */}
      <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
        <p className="label-technical text-muted-foreground">Version Progression Timeline</p>
        <div className="flex items-center justify-between overflow-x-auto scrollbar-slim gap-3 pb-2 pt-1">
          {versions.map((ver, idx) => {
            const isSelectedA = ver.version === verAKey;
            const isSelectedB = ver.version === verBKey;
            return (
              <React.Fragment key={ver.version}>
                <div
                  className={cn(
                    "flex min-w-[160px] flex-col rounded-xl border p-3 text-left transition-all cursor-pointer",
                    isSelectedA && isSelectedB
                      ? "border-saffron bg-saffron/10 shadow-[0_0_12px_-4px_var(--saffron)]"
                      : isSelectedA
                      ? "border-cyan bg-cyan/10 shadow-[0_0_12px_-4px_var(--cyan)]"
                      : isSelectedB
                      ? "border-saffron bg-saffron/10 shadow-[0_0_12px_-4px_var(--saffron)]"
                      : "border-border hover:border-primary/40 hover:bg-white/3"
                  )}
                  onClick={() => {
                    if (verAKey === ver.version) return;
                    setVerBKey(ver.version);
                  }}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-xs font-bold text-ivory">{ver.version}</span>
                    <StatusBadge
                      label={ver.verificationStatus}
                      variant={
                        ver.verificationStatus === "VERIFIED"
                          ? "verified"
                          : ver.verificationStatus === "MODIFIED"
                          ? "warning"
                          : "muted"
                      }
                    />
                  </div>
                  <p className="mt-1 font-sans text-xs font-semibold text-ivory line-clamp-1">{ver.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground flex items-center gap-1">
                    <User className="h-2.5 w-2.5" />
                    {ver.actor.name}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 pt-2 border-t border-border/40 text-[10px]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVerAKey(ver.version);
                      }}
                      className={cn(
                        "rounded px-1.5 py-0.5 font-mono font-bold transition-colors",
                        isSelectedA ? "bg-cyan text-background" : "bg-white/10 text-muted-foreground hover:text-ivory"
                      )}
                    >
                      Compare A
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVerBKey(ver.version);
                      }}
                      className={cn(
                        "rounded px-1.5 py-0.5 font-mono font-bold transition-colors",
                        isSelectedB ? "bg-saffron text-background" : "bg-white/10 text-muted-foreground hover:text-ivory"
                      )}
                    >
                      Compare B
                    </button>
                  </div>
                </div>
                {idx < versions.length - 1 && (
                  <div className="h-0.5 w-8 shrink-0 bg-border/60 self-center" aria-hidden />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Version Comparison Controls */}
      <GlassPanel
        title="COMPARE VERSIONS"
        meta={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan" />
              <span className="font-mono text-cyan font-semibold">Version A:</span>
              <select
                value={verAKey}
                onChange={(e) => setVerAKey(e.target.value)}
                className="rounded border border-border bg-background px-2 py-1 font-mono text-xs text-ivory"
              >
                {versions.map((v) => (
                  <option key={v.version} value={v.version}>
                    {v.version} — {v.title}
                  </option>
                ))}
              </select>
            </div>
            <GitCompare className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-1 text-xs">
              <span className="h-2.5 w-2.5 rounded-full bg-saffron" />
              <span className="font-mono text-saffron font-semibold">Version B:</span>
              <select
                value={verBKey}
                onChange={(e) => setVerBKey(e.target.value)}
                className="rounded border border-border bg-background px-2 py-1 font-mono text-xs text-ivory"
              >
                {versions.map((v) => (
                  <option key={v.version} value={v.version}>
                    {v.version} — {v.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Spatial Geometry Map View */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="label-technical text-muted-foreground">Spatial Geometry Overlay</p>
              <span className="font-mono text-xs text-saffron">
                Area Shift: {diff.geometryDiff.areaChange > 0 ? "+" : ""}{diff.geometryDiff.areaChange} m² ({diff.geometryDiff.areaDiffPercent}%)
              </span>
            </div>
            <VersionMapEngine versionA={verAObj} versionB={verBObj} />
          </div>

          {/* Detailed Differences Table */}
          <div className="space-y-4">
            {/* Geometry Metrics Diff */}
            <div className="rounded-xl border border-border bg-background/50 p-3 space-y-2">
              <p className="label-technical text-primary">Geometry Metrics Comparison</p>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Metric</span>
                <span className="text-cyan">{verAObj.version}</span>
                <span className="text-saffron">{verBObj.version}</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Area</span>
                  <span className="text-ivory">{verAObj.geometry.area.toLocaleString()} m²</span>
                  <span className="text-ivory">{verBObj.geometry.area.toLocaleString()} m²</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Perimeter</span>
                  <span className="text-ivory">{verAObj.geometry.perimeter} m</span>
                  <span className="text-ivory">{verBObj.geometry.perimeter} m</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Centroid Shift</span>
                  <span className="text-muted-foreground font-sans">Baseline</span>
                  <span className="text-saffron font-bold">{diff.geometryDiff.centroidShiftMeters} m</span>
                </div>
              </div>
            </div>

            {/* Attribute Diffs */}
            <div className="rounded-xl border border-border bg-background/50 p-3 space-y-2">
              <p className="label-technical text-muted-foreground">Attribute Changes</p>
              <div className="scrollbar-slim overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/40 text-left label-technical">
                      <th className="py-1">Field</th>
                      <th className="py-1 text-cyan">{verAObj.version}</th>
                      <th className="py-1 text-saffron">{verBObj.version}</th>
                      <th className="py-1 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diff.attributeDiffs.map((row) => (
                      <tr key={row.field} className="border-b border-border/30 hover:bg-white/3">
                        <td className="py-1.5 font-mono text-muted-foreground">{row.field}</td>
                        <td className="py-1.5 text-ivory">{row.valueA}</td>
                        <td className="py-1.5 text-ivory">{row.valueB}</td>
                        <td className="py-1.5 text-right">
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 font-mono text-[9px] font-bold",
                              row.status === "CHANGED"
                                ? "bg-saffron/15 text-saffron border border-saffron/30"
                                : "bg-muted/20 text-muted-foreground"
                            )}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Evidence & Reviewer Status Diff */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border bg-background/50 p-3 space-y-1">
                <p className="label-technical text-muted-foreground">Evidence Added</p>
                {diff.evidenceDiffs.added.length > 0 ? (
                  <p className="font-mono text-verified text-xs">{diff.evidenceDiffs.added.join(", ")}</p>
                ) : (
                  <p className="text-muted-foreground text-xs">No new evidence added</p>
                )}
              </div>
              <div className="rounded-xl border border-border bg-background/50 p-3 space-y-1">
                <p className="label-technical text-muted-foreground">Verification Reviewer</p>
                <p className="font-mono text-ivory text-xs">{diff.reviewerDiff.newActor}</p>
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
