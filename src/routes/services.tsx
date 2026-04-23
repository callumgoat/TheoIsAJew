import { createFileRoute, Link } from "@tanstack/react-router";
import { Droplets, Sparkles, Scissors, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — CJ Servicing | Pressure Washing, Windows, Lawns" },
      { name: "description", content: "Pressure washing £2.50/sqm, window cleaning from £2.50, lawn mowing £0.25/sqm in Nottingham & Derby." },
      { property: "og:title", content: "Services — CJ Servicing" },
      { property: "og:description", content: "Pressure washing, window cleaning and lawn mowing across Nottingham & Derby." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Droplets,
    title: "Pressure Washing",
    price: "£2.50 per sqm",
    desc: "Restore driveways, patios, paths and decking. We lift years of grime, moss and algae for a fresh-looking surface.",
    features: [
      "Driveways, patios, paths, decking",
      "Add-on: Stone Snow Washing +£0.50/sqm",
      "Add-on: Sanding +£0.50/sqm",
      "Free pre-treatment for stubborn moss",
    ],
  },
  {
    icon: Sparkles,
    title: "Window Cleaning",
    price: "From £2.50 per window",
    desc: "Streak-free, spot-free windows inside or out. Pure water reach-and-wash for safe upper-floor cleaning.",
    features: [
      "Large windows: £10",
      "Medium windows: £5",
      "Small windows: £2.50",
      "Frames & sills wiped down",
    ],
  },
  {
    icon: Scissors,
    title: "Lawn Mowing",
    price: "£0.25 per sqm",
    desc: "Sharp, even cuts that keep your lawn healthy. Edges trimmed and clippings removed for a tidy finish.",
    features: ["Neat, even cuts", "Edge trimming included", "Clippings removed", "Regular schedules available"],
  },
];

function ServicesPage() {
  return (
    <>
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Services</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">Everything your property needs — outside</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Clear, per-square-metre pricing. No call-out fees. Free quotes across Nottingham &amp; Derby.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6">
          {services.map((s) => (
            <article key={s.title} className="grid gap-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8 md:grid-cols-[auto_1fr_auto] md:items-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-7 w-7" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold">{s.title}</h2>
                <p className="text-primary font-semibold">{s.price}</p>
                <p className="mt-2 text-muted-foreground">{s.desc}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2 md:w-44">
                <Button asChild variant="hero">
                  <Link to="/contact">Book This Service</Link>
                </Button>
                <Button asChild variant="outline">
                  <a href="tel:07554639668"><Phone className="h-4 w-4" /> Call</a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
