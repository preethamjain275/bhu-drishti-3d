import { cn } from "@/lib/utils";

/** Illustrative spatial preview: deterministic demo geometry per seed. */
function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

export function MiniMap({ seed, className, dense = false }: { seed: number; className?: string; dense?: boolean }) {
  const r = rng(seed);
  const cols = dense ? 6 : 4;
  const parcels: string[] = [];
  for (let x = 0; x < cols; x++)
    for (let y = 0; y < 3; y++) {
      const j = () => (r() - 0.5) * 8;
      const x0 = 20 + x * (160 / cols), y0 = 20 + y * 30, w = 160 / cols - 4;
      parcels.push(`${x0 + j()},${y0 + j()} ${x0 + w + j()},${y0 + j()} ${x0 + w + j()},${y0 + 26 + j()} ${x0 + j()},${y0 + 26 + j()}`);
    }
  const pts = Array.from({ length: 10 }, () => [20 + r() * 160, 20 + r() * 90]);
  return (
    <svg viewBox="0 0 200 130" role="img" aria-label="Illustrative map preview" className={cn("rounded-lg bg-surface spatial-grid-fine", className)}>
      <rect x="14" y="14" width="172" height="102" fill="none" className="stroke-primary/40" strokeDasharray="3 3" />
      <path d={`M0 ${60 + r() * 20} C 60 ${40 + r() * 40}, 140 ${60 + r() * 40}, 200 ${50 + r() * 30}`} className="stroke-ivory/30" strokeWidth="3" fill="none" />
      {parcels.map((p, i) => (
        <polygon key={i} points={p} className={i % 5 === 2 ? "fill-saffron/15 stroke-saffron/70" : "fill-primary/10 stroke-primary/70"} strokeWidth="0.8" />
      ))}
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" className="fill-cyan" />)}
    </svg>
  );
}

/** Raw points → geometry → parcel grid → aligned layer. Pure SVG/CSS, reduced-motion safe. */
export function IngestionVisual({ stage }: { stage: number }) {
  const labels = ["Raw points", "Geometry", "Parcel grid", "Aligned layer"];
  return (
    <div className="grid grid-cols-4 gap-2">
      {labels.map((l, i) => (
        <div key={l} className={cn("rounded-lg border p-2 transition-all duration-500", i <= stage ? "border-primary/50 bg-primary/5" : "border-border opacity-40")}>
          <svg viewBox="0 0 60 40" className="h-12 w-full" aria-hidden>
            {i === 0 && [8, 20, 33, 47, 14, 40, 26, 52].map((x, k) => <circle key={k} cx={x} cy={8 + ((k * 13) % 26)} r="1.5" className="fill-cyan" />)}
            {i === 1 && <polyline points="8,30 20,10 38,14 52,32 8,30" className="fill-none stroke-cyan" />}
            {i >= 2 && [0, 1, 2].map((c) => [0, 1].map((rr) => (
              <rect key={`${c}${rr}`} x={6 + c * 17} y={6 + rr * 15} width="15" height="13" transform={i === 3 ? "" : `rotate(${(c - rr) * 3} 30 20)`} className={i === 3 ? "fill-verified/15 stroke-verified" : "fill-primary/10 stroke-primary"} strokeWidth="0.7" />
            )))}
          </svg>
          <p className="label-technical mt-1 text-center">{l}</p>
        </div>
      ))}
    </div>
  );
}
