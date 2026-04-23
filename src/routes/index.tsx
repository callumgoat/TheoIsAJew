import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Mail, CheckCircle2, Clock, MapPin, Star, ArrowRight, Droplets, Sparkles, Scissors } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { PriceCalculator } from "@/components/site/PriceCalculator";
import { BeforeAfterGallery } from "@/components/site/BeforeAfterGallery";
import { Testimonials } from "@/components/site/Testimonials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CJ Servicing — Exterior Cleaning in Nottingham & Derby" },
      {
        name: "description",
        content:
          "Professional pressure washing, window cleaning and lawn mowing across Nottingham & Derby. Same-day quotes. Call 07554639668.",
      },
      { property: "og:title", content: "CJ Servicing — Exterior Cleaning in Nottingham & Derby" },
      {
        property: "og:description",
        content: "Affordable, reliable, high-quality exterior cleaning. Same-day quotes — call 07554639668.",
      },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-20 min-h-screen">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={heroImg}
            alt="Pressure washing a stone driveway in Nottingham"
            width={1600}
            height={1024}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-right sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/30" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Same-day quotes • Nottingham & Derby
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
              Professional Exterior <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">Cleaning Services</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Affordable, reliable, high-quality cleaning across Nottingham &amp; Derby.
              Fast response via phone or email — same day quotes available.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl">
                <a href="tel:07554639668">
                  <Phone className="h-5 w-5" />
                  Call Now — 07554639668
                </a>
              </Button>
              <Button asChild variant="cta" size="xl">
                <Link to="/contact">
                  Get a Free Quote <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" /> Quotes within hours</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-accent" /> 5★ local reputation</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Services</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Transparent pricing, exceptional results</h2>
            <p className="mt-3 text-muted-foreground">Pick a service below or use our instant calculator.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <ServiceCard
              icon={<Droplets className="h-6 w-6" />}
              title="Pressure Washing"
              price="£2.50 / sqm"
              features={["Driveways & patios", "+£0.50 Stone Snow Washing", "+£0.50 Sanding"]}
            />
            <ServiceCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Window Cleaning"
              price="From £2.50"
              features={["Large windows £10", "Medium £5", "Small £2.50"]}
              featured
            />
            <ServiceCard
              icon={<Scissors className="h-6 w-6" />}
              title="Lawn Mowing"
              price="£0.25 / sqm"
              features={["Neat, even cuts", "Edges trimmed", "Clippings removed"]}
            />
          </div>
        </div>
      </section>

      {/* CALCULATOR + TRUST */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Why CJ Servicing</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Local. Reliable. Fairly priced.</h2>
            <p className="mt-4 text-muted-foreground">
              We're a friendly local business serving Nottingham and Derby with a no-nonsense approach:
              honest quotes, careful work, and quick replies.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Free, no-obligation quotes — usually same day",
                "Clear per-square-metre pricing — no surprises",
                "Photos welcome by email or WhatsApp for instant estimates",
                "Tidy job, every time",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg">
                <a href="tel:07554639668"><Phone className="h-4 w-4" /> Call 07554639668</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="mailto:enquiries@cjservicing.com"><Mail className="h-4 w-4" /> Email Photos</a>
              </Button>
            </div>
          </div>

          <PriceCalculator />
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Real Results</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Before &amp; after</h2>
            <p className="mt-3 text-muted-foreground">Drag the slider on each photo to see the difference.</p>
          </div>
          <div className="mt-12">
            <BeforeAfterGallery />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">What customers say</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">5★ local reputation</h2>
            <p className="mt-3 text-muted-foreground">A few kind words from recent jobs across Nottingham &amp; Derby.</p>
          </div>
          <div className="mt-12">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* AREAS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <MapPin className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-3 font-display text-3xl font-bold">Serving Nottingham &amp; Derby</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Covering all surrounding areas. Not sure if we cover yours? Just give us a quick call.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[image:var(--gradient-hero)] py-16 text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to transform your property?</h2>
          <p className="max-w-xl opacity-90">Most quotes answered within hours. Call now or send us photos.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="cta" size="xl">
              <a href="tel:07554639668"><Phone className="h-5 w-5" /> Call Now</a>
            </Button>
            <Button
              asChild
              size="xl"
              className="border border-primary-foreground/30 bg-background/10 text-primary-foreground hover:bg-background/20"
            >
              <a href="mailto:enquiries@cjservicing.com"><Mail className="h-5 w-5" /> Email Us Photos</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceCard({
  icon, title, price, features, featured,
}: { icon: React.ReactNode; title: string; price: string; features: string[]; featured?: boolean }) {
  return (
    <div
      className={`group relative flex flex-col rounded-2xl border bg-card p-6 transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] ${
        featured ? "border-primary shadow-[var(--shadow-card)]" : "border-border shadow-[var(--shadow-card)]"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          Most popular
        </span>
      )}
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>
      <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
      <p className="mt-1 text-2xl font-bold text-primary">{price}</p>
      <ul className="mt-4 flex-1 space-y-2 text-sm text-muted-foreground">
        {features.map((f) => (
          <li key={f} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent" />{f}</li>
        ))}
      </ul>
      <Button asChild variant="hero" className="mt-6 w-full">
        <Link to="/contact">Book This Service</Link>
      </Button>
    </div>
  );
}
