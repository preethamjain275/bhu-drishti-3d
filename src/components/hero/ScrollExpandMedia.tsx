"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

interface ScrollExpandMediaProps {
  children: (progress: MotionValue<number>) => React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
  floatingHUD?: React.ReactNode;
}

/**
 * ScrollExpandMedia — Cinematic Scroll Expansion Container for Bhoo-Mitra AI / SIH26013.
 * Smoothly expands a high-altitude drone aerial viewport into an immersive, full-width 3D Urban Digital Twin.
 *
 * 0%: Small cinematic aerial viewport with telemetry reticles.
 * 25%: Viewport begins expanding with camera descent parallax.
 * 50%: 3D urban environment & building extrusions become prominent.
 * 75%: Parcel boundaries, cadastral vectors, and source layers emerge.
 * 100%: Full-width/full-height interactive 3D Urban Digital Twin command center.
 */
export function ScrollExpandMedia({
  children,
  className,
  headerContent,
  floatingHUD,
}: ScrollExpandMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Dynamic transformations based on scroll progress
  const mediaWidth = useTransform(scrollYProgress, [0, 0.4, 0.85, 1], ["80%", "92%", "98%", "100%"]);
  const mediaHeight = useTransform(scrollYProgress, [0, 0.4, 0.85, 1], ["540px", "680px", "820px", "900px"]);
  const mediaScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 0.98, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.8, 1], ["28px", "16px", "8px"]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.25, 0.45], [1, 0.4, 0]);
  const headerTranslateY = useTransform(scrollYProgress, [0, 0.35], ["0px", "-40px"]);
  const hudOpacity = useTransform(scrollYProgress, [0.15, 0.4, 0.95], [0, 1, 1]);

  return (
    <div ref={containerRef} className={cn("relative min-h-[220vh] w-full", className)}>
      {/* Sticky Viewport Container */}
      <div className="sticky top-16 z-10 flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-start overflow-hidden px-2 sm:px-4 py-4 md:py-6">
        
        {/* Animated Initial Header Content (Fades smoothly as user scrolls) */}
        {headerContent && (
          <motion.div
            style={{ opacity: headerOpacity, y: headerTranslateY }}
            className="pointer-events-auto z-20 w-full max-w-5xl text-center mb-4 sm:mb-6"
          >
            {headerContent}
          </motion.div>
        )}

        {/* Cinematic Expanding Media Container */}
        <motion.div
          style={{
            width: mediaWidth,
            height: mediaHeight,
            scale: mediaScale,
            borderRadius,
          }}
          className="relative mx-auto flex flex-col overflow-hidden border border-teal-500/30 bg-slate-950/90 shadow-[0_0_50px_rgba(20,184,166,0.15)] backdrop-blur-2xl transition-all duration-150"
        >
          {/* Internal media renderer passing real-time scroll progress */}
          {children(scrollYProgress)}

          {/* Floating Telemetry & Multi-Source HUD Overlay */}
          {floatingHUD && (
            <motion.div
              style={{ opacity: hudOpacity }}
              className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-between items-end px-4 md:px-6"
            >
              {floatingHUD}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
