/**
 * BHOO-MITRA AI — Interactive Evidence Graph
 *
 * Visual graph workspace representing the complete evidence hierarchy:
 * CONFLICT → ENTITY → SOURCES → OBSERVATIONS → EVIDENCE → VERIFICATION
 *
 * Features:
 * - Interactive node selection and edge highlighting
 * - Pan and zoom controls
 * - Node type filtering
 * - Focus mode for specific conflict/entity
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  type GraphNode,
  type GraphEdge,
  type EvidenceGraphData,
  type GraphNodeType,
} from "@/lib/mock/evidence-data";
import { cn } from "@/lib/utils";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck,
  FileSearch,
  Focus,
  Eye,
} from "lucide-react";

interface EvidenceGraphProps {
  graphData: EvidenceGraphData;
  selectedNodeId: string | null;
  onSelectNode: (node: GraphNode) => void;
  className?: string;
  isFocused?: boolean;
  onToggleFocus?: () => void;
}

const NODE_TYPE_ICONS: Record<GraphNodeType, string> = {
  CONFLICT: "⚡",
  ENTITY: "📍",
  SOURCE: "🏛️",
  OBSERVATION: "👁️",
  GEOMETRY: "📐",
  ATTRIBUTE: "📋",
  TIMESTAMP: "⏱️",
  EVIDENCE: "📄",
  VERIFICATION: "🛡️",
};

export function EvidenceGraph({
  graphData,
  selectedNodeId,
  onSelectNode,
  className,
  isFocused,
  onToggleFocus,
}: EvidenceGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Compute Layout Coordinates in a clear, spacious hierarchical structure
  const positionedNodes = useMemo(() => {
    const width = 920;
    const height = 620;

    // Structured spacious levels:
    // Level 1 (y: 60): Conflict Root
    // Level 2 (y: 170): Target Entity / Parcel
    // Level 3 (y: 310): Authoritative Source Nodes (Municipal, Registry, Survey)
    // Level 4 (y: 450): Specific Evidence Observation Records
    // Level 5 (y: 560): Verified Harmonization Outcome

    return graphData.nodes.map((node, index) => {
      let x = width / 2;
      let y = height / 2;

      if (node.type === "CONFLICT") {
        x = width / 2;
        y = 65;
      } else if (node.type === "ENTITY") {
        x = width / 2;
        y = 175;
      } else if (node.type === "SOURCE") {
        if (node.id.includes("MUNI")) x = width * 0.20;
        else if (node.id.includes("REG")) x = width * 0.50;
        else x = width * 0.80;
        y = 310;
      } else if (node.type === "EVIDENCE") {
        if (node.id === "EVIDENCE-DEMO-001") {
          x = width * 0.20;
          y = 450;
        } else if (node.id === "EVIDENCE-DEMO-002") {
          x = width * 0.50;
          y = 450;
        } else if (node.id === "EVIDENCE-DEMO-003") {
          x = width * 0.80;
          y = 450;
        } else {
          x = width * 0.15 + (index * 160) % (width * 0.7);
          y = 450;
        }
      } else if (node.type === "VERIFICATION") {
        x = width / 2;
        y = 560;
      }

      return {
        ...node,
        x,
        y,
      };
    });
  }, [graphData.nodes]);

  // Find node by ID
  const getNodePos = (id: string) => {
    return positionedNodes.find((n) => n.id === id);
  };

  // Pan interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === "svg") {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2.0));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.6));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl border border-border/80 bg-slate-950/90 shadow-2xl select-none cursor-grab active:cursor-grabbing",
        className
      )}
    >
      {/* Background Grid Accent */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
          backgroundSize: "24px 24px",
          transform: `translate(${pan.x % 24}px, ${pan.y % 24}px)`,
        }}
      />

      {/* Top Floating Graph Toolbar */}
      <div className="absolute left-3 top-3 z-20 flex flex-wrap items-center gap-1.5 max-w-[calc(100%-55px)]">
        <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-slate-900/90 px-2.5 py-1 shadow-lg backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-saffron shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-ivory truncate">
            Evidence Graph
          </span>
          <span className="rounded-full bg-slate-800 px-1.5 py-0.2 font-mono text-[9px] text-muted-foreground shrink-0">
            {graphData.nodes.length}N · {graphData.edges.length}E
          </span>
        </div>

        {onToggleFocus && (
          <button
            onClick={onToggleFocus}
            className={cn(
              "flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium shadow-lg backdrop-blur-md transition-colors",
              isFocused
                ? "border-primary bg-primary/20 text-primary font-bold"
                : "border-border/80 bg-slate-900/90 text-muted-foreground hover:text-ivory"
            )}
          >
            <Focus className="h-3 w-3" />
            <span className="truncate">{isFocused ? "Focused" : "Focus"}</span>
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5 rounded-lg border border-border/80 bg-slate-900/90 p-1 shadow-lg backdrop-blur-md">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-slate-800 hover:text-ivory"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-slate-800 hover:text-ivory"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <div className="my-0.5 h-px bg-border/60" />
        <button
          onClick={handleReset}
          title="Reset Graph Position"
          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-slate-800 hover:text-ivory"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* SVG Canvas for Edges and Nodes */}
      <svg
        viewBox="0 0 920 620"
        className="h-full w-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.15s ease-out",
        }}
      >
        <defs>
          <marker
            id="arrowhead-red"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
          </marker>
          <marker
            id="arrowhead-slate"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
          </marker>
          <marker
            id="arrowhead-green"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
          </marker>
        </defs>

        {/* Render Edges */}
        {graphData.edges.map((edge) => {
          const sourceNode = getNodePos(edge.source);
          const targetNode = getNodePos(edge.target);
          if (!sourceNode || !targetNode) return null;

          const isHighlighted =
            edge.source === selectedNodeId ||
            edge.target === selectedNodeId ||
            edge.source === hoveredNodeId ||
            edge.target === hoveredNodeId;

          const midX = (sourceNode.x + targetNode.x) / 2;
          const midY = (sourceNode.y + targetNode.y) / 2;

          const markerId =
            edge.color === "#ef4444"
              ? "url(#arrowhead-red)"
              : edge.color === "#10b981"
              ? "url(#arrowhead-green)"
              : "url(#arrowhead-slate)";

          return (
            <g key={edge.id} className="transition-all duration-300">
              {/* Edge Line */}
              <line
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={isHighlighted ? "#38bdf8" : edge.color || "#475569"}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                strokeDasharray={edge.label === "PREPARES FOR" ? "4 3" : undefined}
                markerEnd={markerId}
                className="opacity-75"
              />

              {/* Edge Label Pill Backdrop */}
              <rect
                x={midX - 40}
                y={midY - 11}
                width="80"
                height="15"
                rx="4"
                fill="#030712"
                stroke={isHighlighted ? "#38bdf8" : "#334155"}
                strokeWidth="0.8"
                opacity="0.95"
              />

              {/* Edge Relationship Label */}
              <text
                x={midX}
                y={midY}
                dominantBaseline="middle"
                textAnchor="middle"
                className={cn(
                  "fill-slate-400 font-mono text-[8px] uppercase tracking-wider transition-colors",
                  isHighlighted && "fill-cyan font-bold"
                )}
              >
                {edge.label}
              </text>
            </g>
          );
        })}

        {/* Render Nodes */}
        {positionedNodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          const isHovered = node.id === hoveredNodeId;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node);
              }}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              className="cursor-pointer group"
            >
              {/* Node Outer Halo on Selection */}
              {isSelected && (
                <rect
                  x="-72"
                  y="-26"
                  width="144"
                  height="52"
                  rx="10"
                  fill="none"
                  stroke={node.color}
                  strokeWidth="2"
                  className="animate-pulse opacity-80"
                />
              )}

              {/* Node Card Box */}
              <rect
                x="-68"
                y="-22"
                width="136"
                height="44"
                rx="8"
                fill="#0f172a"
                stroke={isSelected ? "#ffffff" : node.color}
                strokeWidth={isSelected ? 2 : 1.2}
                className={cn(
                  "transition-all duration-200 shadow-xl",
                  isHovered && "filter brightness-125"
                )}
              />

              {/* Icon & Label */}
              <text
                x="-58"
                y="-2"
                className="fill-white text-[11px] font-bold"
                textAnchor="start"
              >
                {NODE_TYPE_ICONS[node.type]} {node.label}
              </text>

              {/* Sublabel */}
              {node.sublabel && (
                <text
                  x="-58"
                  y="12"
                  className="fill-slate-400 text-[9px] font-mono"
                  textAnchor="start"
                >
                  {node.sublabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Bottom Graph Legend Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-wrap items-center justify-between border-t border-border/80 bg-slate-950/85 px-3 py-1.5 text-[11px] text-muted-foreground backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-bold text-saffron">HIERARCHY: Explainable Decision Graph</span>
          <span className="hidden sm:inline">Click node to inspect supporting evidence</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-conflict" /> Conflict
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan" /> Entity
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-saffron" /> Source
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Evidence
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary" /> Verification
          </span>
        </div>
      </div>
    </div>
  );
}
