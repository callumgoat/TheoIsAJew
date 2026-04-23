import { createFileRoute } from "@tanstack/react-router";
import { PriceCalculator } from "@/components/site/PriceCalculator";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Instant Calculator — CJ Servicing" },
      { name: "description", content: "Transparent prices for pressure washing, windows and lawn mowing. Use the calculator for an instant estimate." },
      { property: "og:title", content: "Pricing & Calculator — CJ Servicing" },
      { property: "og:description", content: "Instant estimates for exterior cleaning across Nottingham & Derby." },
    ],
  }),
  component: PricingPage,
});

const rows = [
  { service: "Pressure Washing", base: "£2.50 / sqm", notes: "+£0.50/sqm Stone Snow Washing • +£0.50/sqm Sanding" },
  { service: "Window Cleaning — Large", base: "£10 / window", notes: "Frames & sills wiped" },
  { service: "Window Cleaning — Medium", base: "£5 / window", notes: "Streak-free finish" },
  { service: "Window Cleaning — Small", base: "£2.50 / window", notes: "Pure water reach-and-wash" },
  { service: "Lawn Mowing", base: "£0.25 / sqm", notes: "Edges trimmed, clippings removed" },
];

function PricingPage() {
  return (
    <>
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Pricing</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">Simple, transparent prices</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Use the calculator for an instant estimate, then call or email for a confirmed quote.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
            <table className="w-full text-sm">
              <thead className="bg-primary/5 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.service} className="border-t border-border">
                    <td className="px-5 py-4">
                      <div className="font-semibold">{r.service}</div>
                      <div className="text-xs text-muted-foreground">{r.notes}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-primary">{r.base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PriceCalculator />
        </div>
      </section>
    </>
  );
}
