/**
 * BHOO-MITRA AI — 3D Motion Animated Hamburger / Toggle Symbol
 *
 * Provides a 3D perspective-transformed, animated hamburger icon with
 * interactive depth lighting, micro-rotation, and spring motion effects.
 * Designed to remain static on scroll in top headers and sidebars.
 */

import React from "react";
import { cn } from "@/lib/utils";

interface Animated3DHamburgerProps {
  active?: boolean;
  onClick?: () => void;
  className?: string;
  title?: string;
}

export function Animated3DHamburger({
  active = false,
  onClick,
  className,
  title = "Toggle Navigation Menu",
}: Animated3DHamburgerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn(
        "group relative flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-surface/90 shadow-md backdrop-blur-md transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_15px_color-mix(in_oklab,var(--cyan)_40%,transparent)] active:scale-95",
        active && "border-cyan/60 bg-primary/10 shadow-[0_0_18px_color-mix(in_oklab,var(--cyan)_50%,transparent)]",
        className
      )}
      style={{ perspective: "600px" }}
    >
      {/* 3D Container with preserve-3d */}
      <div
        className={cn(
          "relative flex h-4 w-4.5 flex-col justify-between transition-transform duration-500 ease-out group-hover:[transform:rotateX(15deg)_rotateY(20deg)_translateZ(4px)]",
          active && "[transform:rotateY(180deg)]"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Top 3D Bar */}
        <span
          className={cn(
            "h-[2px] w-full rounded-full bg-ivory transition-all duration-300 group-hover:bg-cyan shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
            active && "translate-y-[7px] rotate-45 bg-cyan"
          )}
        />

        {/* Middle 3D Bar */}
        <span
          className={cn(
            "h-[2px] w-3/4 rounded-full bg-primary transition-all duration-300 group-hover:w-full group-hover:bg-cyan shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
            active && "opacity-0 scale-x-0"
          )}
        />

        {/* Bottom 3D Bar */}
        <span
          className={cn(
            "h-[2px] w-full rounded-full bg-ivory transition-all duration-300 group-hover:bg-cyan shadow-[0_1px_3px_rgba(0,0,0,0.4)]",
            active && "-translate-y-[7px] -rotate-45 bg-cyan"
          )}
        />
      </div>

      {/* 3D Spatial Pulse Ring */}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl border border-cyan/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          active && "opacity-100 animate-pulse"
        )}
        aria-hidden
      />
    </button>
  );
}
