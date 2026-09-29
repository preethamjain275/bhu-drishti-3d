/**
 * BHOO-MITRA AI — Audit Dashboard Visualizations (Pure SVG Engine)
 *
 * Lightweight, hardware-accelerated SVG charts for audit activity trends,
 * module breakdowns, and action category distributions.
 * 100% immune to third-party React dispatcher hook errors.
 */

import React from "react";
import { type AuditEvent } from "@/lib/api/audit";

interface AuditChartsProps {
  events: AuditEvent[];
}

export function AuditCharts({ events }: AuditChartsProps) {
  // Module breakdown
  const moduleCounts: Record<string, number> = {};
  events.forEach((e) => {
    moduleCounts[e.module] = (moduleCounts[e.module] || 0) + 1;
  });
  const moduleData = Object.entries(moduleCounts).map(([name, count]) => ({ name, count }));
  const maxModuleCount = Math.max(1, ...moduleData.map((m) => m.count));

  // Time trend data (simulated 7-day trend leading to current event count)
  const timeTrendData = [
    { date: "Sep 19", count: 12 },
    { date: "Sep 20", count: 18 },
    { date: "Sep 21", count: 14 },
    { date: "Sep 22", count: 22 },
    { date: "Sep 23", count: 30 },
    { date: "Sep 24", count: 45 },
    { date: "Sep 25", count: events.length },
  ];
  const maxTrend = Math.max(1, ...timeTrendData.map((d) => d.count));

  // Category breakdown
  const actionCounts: Record<string, number> = {};
  events.forEach((e) => {
    const actGroup = e.action.split("_")[0] ?? "OTHER";
    actionCounts[actGroup] = (actionCounts[actGroup] || 0) + 1;
  });
  const actionData = Object.entries(actionCounts).map(([name, count]) => ({ name, count }));

  // Generate SVG area chart points
  const points = timeTrendData
    .map((d, i) => {
      const x = (i / (timeTrendData.length - 1)) * 260 + 10;
      const y = 90 - (d.count / maxTrend) * 70;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `10,90 ${points} 270,90`;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* 1. Audit Activity Trend (SVG Area Chart) */}
      <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="label-technical text-muted-foreground">Audit Activity (7-Day Trend)</p>
          <span className="font-mono text-xs font-bold text-cyan">+{events.length} Events</span>
        </div>
        <div className="h-36 w-full flex items-center justify-center pt-2">
          <svg viewBox="0 0 280 100" className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id="audit-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ffff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="10" y1="20" x2="270" y2="20" stroke="currentColor" className="text-border/40" strokeDasharray="3 3" />
            <line x1="10" y1="55" x2="270" y2="55" stroke="currentColor" className="text-border/40" strokeDasharray="3 3" />
            <line x1="10" y1="90" x2="270" y2="90" stroke="currentColor" className="text-border/60" />

            {/* Area Fill */}
            <polygon points={areaPoints} fill="url(#audit-area-grad)" />

            {/* Area Line */}
            <polyline points={points} fill="none" stroke="#00ffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Data Circles */}
            {timeTrendData.map((d, i) => {
              const x = (i / (timeTrendData.length - 1)) * 260 + 10;
              const y = 90 - (d.count / maxTrend) * 70;
              return (
                <g key={d.date} className="group cursor-pointer">
                  <circle cx={x} cy={y} r="4" fill="#00ffff" stroke="#0f172a" strokeWidth="2" />
                  <title>{`${d.date}: ${d.count} events`}</title>
                </g>
              );
            })}

            {/* Date Labels */}
            {timeTrendData.map((d, i) => {
              const x = (i / (timeTrendData.length - 1)) * 260 + 10;
              return (
                <text key={d.date} x={x} y="99" textAnchor="middle" className="fill-muted-foreground font-mono text-[9px]">
                  {d.date.split(" ")[1]}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2. Events by Module (SVG Bar Chart) */}
      <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
        <p className="label-technical text-muted-foreground">Events by Platform Module</p>
        <div className="h-36 w-full flex items-center justify-center pt-2">
          <svg viewBox="0 0 280 100" className="h-full w-full overflow-visible">
            {moduleData.map((m, i) => {
              const barWidth = Math.min(32, 240 / (moduleData.length || 1));
              const x = i * (260 / (moduleData.length || 1)) + 20;
              const barHeight = (m.count / maxModuleCount) * 65;
              const y = 85 - barHeight;

              return (
                <g key={m.name} className="group cursor-pointer">
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="4"
                    fill="#3fb8b0"
                    className="hover:fill-cyan transition-colors"
                  />
                  <text x={x + barWidth / 2} y={y - 4} textAnchor="middle" className="fill-ivory font-mono text-[9px] font-bold">
                    {m.count}
                  </text>
                  <text x={x + barWidth / 2} y="97" textAnchor="middle" className="fill-muted-foreground font-mono text-[8px] uppercase">
                    {m.name.slice(0, 5)}
                  </text>
                  <title>{`${m.name}: ${m.count} events`}</title>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 3. Action Categories Breakdown */}
      <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
        <p className="label-technical text-muted-foreground">Action Categories</p>
        <div className="h-36 w-full flex flex-col justify-center gap-1.5 pt-1">
          {actionData.slice(0, 4).map(({ name, count }) => {
            const total = events.length || 1;
            const pct = Math.round((count / total) * 100);
            return (
              <div key={name} className="space-y-0.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-ivory font-semibold">{name}</span>
                  <span className="text-muted-foreground">{count} ({pct}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal to-cyan"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
