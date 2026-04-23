import { useState } from "react";
import before1 from "@/assets/before-1.jpg";
import after1 from "@/assets/after-1.jpg";
import before2 from "@/assets/before-2.jpg";
import after2 from "@/assets/after-2.jpg";
import before3 from "@/assets/before-3.jpg";
import after3 from "@/assets/after-3.jpg";

type Pair = { before: string; after: string; label: string };

const pairs: Pair[] = [
  { before: before1, after: after1, label: "Block-paved driveway — Nottingham" },
  { before: before2, after: after2, label: "Rear patio clean — Derby" },
  { before: before3, after: after3, label: "Garden patio path restoration" },
];

function Slider({ pair }: { pair: Pair }) {
  const [pos, setPos] = useState(70); // Start at 70% to show people on mobile

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.currentTarget.value);
    setPos(Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : 0);
  };

  // Avoid divide-by-zero on the inner image when pos === 0. Clamp the
  // denominator so width stays a finite percentage.
  const safePos = Math.max(pos, 0.0001);
  const innerWidth = `${(100 / safePos) * 100}%`;

  return (
    <div className="group">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)] select-none">
        <img
          src={pair.after}
          alt={`After: ${pair.label}`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          <img
            src={pair.before}
            alt={`Before: ${pair.label}`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ width: innerWidth, maxWidth: "none" }}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>

        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow">
          Before
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow">
          After
        </span>

        <div
          className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.2)] pointer-events-auto"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-foreground shadow-lg pointer-events-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6 3 12l6 6" />
              <path d="m15 6 6 6-6 6" />
            </svg>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={handleChange}
          aria-label={`Reveal slider for ${pair.label}`}
          className="absolute inset-y-0 cursor-ew-resize opacity-0 pointer-events-auto"
          style={{ left: 0, width: '100%', height: '100%', zIndex: 5 }}
        />
      </div>
      <p className="mt-3 text-center text-sm font-medium text-muted-foreground">{pair.label}</p>
    </div>
  );
}

export function BeforeAfterGallery() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {pairs.map((p) => (
        <Slider key={p.label} pair={p} />
      ))}
    </div>
  );
}
