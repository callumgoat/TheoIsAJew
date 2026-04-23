import { useEffect, useMemo, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

function formatReviewDate(iso: string): string {
  try {
    const parts = iso.split("-");
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    const date = day
      ? new Date(Number(year), Number(month) - 1, Number(day))
      : new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: day ? "numeric" : undefined,
    });
  } catch {
    return iso;
  }
}

type Review = {
  id?: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  date?: string;
  imageUrl?: string;
};

// Fallback reviews shown if the KV fetch fails (e.g. local dev without
// wrangler) or the dashboard hasn't been populated yet.
const FALLBACK_REVIEWS: Review[] = [
  {
    name: "Sarah M.",
    location: "West Bridgford, Nottingham",
    rating: 5,
    service: "Pressure washing",
    text: "Couldn't believe the difference — our driveway looks brand new. Turned up on time, polite, and the price was exactly what was quoted. Already booked them in for the patio.",
  },
  {
    name: "James P.",
    location: "Littleover, Derby",
    rating: 5,
    service: "Window cleaning",
    text: "Quick to reply on WhatsApp and gave me a quote the same evening from a couple of photos. Windows are spotless and the frames were done too. Highly recommend.",
  },
  {
    name: "Hannah R.",
    location: "Mapperley, Nottingham",
    rating: 5,
    service: "Patio + sanding",
    text: "Years of moss and grime gone in an afternoon. They re-sanded the joints afterwards and tidied up perfectly. Genuinely lovely lads, fair price.",
  },
];

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setPerPage(w >= 1024 ? 3 : w >= 768 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews", { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { reviews?: Review[] } | null) => {
        if (cancelled || !data?.reviews) return;
        if (data.reviews.length > 0) setReviews(data.reviews);
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(reviews.length / perPage));

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages - 1));
  }, [totalPages]);

  const visible = useMemo(() => {
    const start = page * perPage;
    return reviews.slice(start, start + perPage);
  }, [reviews, page, perPage]);

  const showControls = reviews.length > perPage;

  const go = (dir: -1 | 1) => {
    setPage((p) => (p + dir + totalPages) % totalPages);
  };

  return (
    <div className="relative">
      {showControls && (
        <button
          type="button"
          aria-label="Previous reviews"
          onClick={() => go(-1)}
          className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-background/95 p-2 shadow-md transition hover:bg-accent hover:text-accent-foreground sm:-left-4"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div
        className="flex w-full items-stretch justify-center gap-6"
        role="region"
        aria-label="Customer reviews"
      >
        {visible.map((r, idx) => (
          <article
            key={r.id ?? `${r.name}-${page}-${idx}`}
            className="relative flex w-full max-w-md flex-1 flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden"
          >
            {r.imageUrl && (
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={r.imageUrl}
                  alt={`Work for ${r.name}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="relative flex flex-1 flex-col p-6">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/15" />
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">"{r.text}"</p>
              <div className="mt-5 border-t border-border pt-4">
                <p className="font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {r.location}
                  {r.service ? ` · ${r.service}` : ""}
                  {r.date ? ` · ${formatReviewDate(r.date)}` : ""}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {showControls && (
        <button
          type="button"
          aria-label="Next reviews"
          onClick={() => go(1)}
          className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-background/95 p-2 shadow-md transition hover:bg-accent hover:text-accent-foreground sm:-right-4"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {showControls && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to reviews page ${i + 1}`}
              aria-current={i === page ? "true" : undefined}
              onClick={() => setPage(i)}
              className={`h-2 rounded-full transition-all ${
                i === page ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
