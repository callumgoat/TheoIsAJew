import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { QuoteForm } from "@/components/site/QuoteForm";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact CJ Servicing — Call 07554639668 for a Quote" },
      { name: "description", content: "Call 07554639668 or email enquiries@cjservicing.com for a free quote on exterior cleaning in Nottingham & Derby." },
      { property: "og:title", content: "Contact CJ Servicing" },
      { property: "og:description", content: "Free quotes — usually same day. Call 07554639668 or email enquiries@cjservicing.com." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Contact Us</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">Get in touch</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Phone is the fastest way to reach us — most quotes are answered within hours.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <ContactCard
              icon={<Phone className="h-6 w-6" />}
              label="Call us (fastest)"
              value="07554639668"
              hint="Best for immediate quotes and bookings"
              cta={
                <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
                  <a href="tel:07554639668"><Phone className="h-4 w-4" /> Call 07554639668</a>
                </Button>
              }
            />
            <ContactCard
              icon={<Mail className="h-6 w-6" />}
              label="Email us"
              value="enquiries@cjservicing.com"
              hint="Send photos for an accurate quote"
              cta={
                <Button asChild variant="cta" size="lg" className="w-full sm:w-auto">
                  <a href="mailto:enquiries@cjservicing.com"><Mail className="h-4 w-4" /> Email Photos</a>
                </Button>
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBox icon={<MapPin className="h-5 w-5" />} title="Service Area" text="Nottingham & Derby and surrounding areas" />
              <InfoBox icon={<Clock className="h-5 w-5" />} title="Response Time" text="Most quotes within hours — same day where possible" />
            </div>
          </div>

          <QuoteForm />
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon, label, value, hint, cta,
}: { icon: React.ReactNode; label: string; value: string; hint: string; cta: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="font-display text-xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{hint}</p>
        </div>
      </div>
      {cta}
    </div>
  );
}

function InfoBox({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground">{icon}</span>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
