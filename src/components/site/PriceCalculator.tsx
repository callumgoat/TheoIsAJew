import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

type Service = "pressure" | "window" | "lawn";

// Clamp helper to keep numeric inputs within a safe, sane range so a stray
// huge number can never produce Infinity / NaN values downstream.
const MAX_VALUE = 100_000;
const toSafeNumber = (raw: string): number => {
  const n = parseFloat(raw);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, MAX_VALUE);
};

export function PriceCalculator() {
  const [service, setService] = useState<Service>("pressure");
  // Use string state for number inputs so users can type "0.5", clear the
  // field, etc. without React fighting the input value.
  const [sqm, setSqm] = useState("20");
  const [large, setLarge] = useState("0");
  const [medium, setMedium] = useState("0");
  const [small, setSmall] = useState("0");
  const [snow, setSnow] = useState(false);
  const [sanding, setSanding] = useState(false);
  const [shown, setShown] = useState<number | null>(null);

  const total = useMemo(() => {
    const sqmN = toSafeNumber(sqm);
    if (service === "pressure") {
      const rate = 2.5 + (snow ? 0.5 : 0) + (sanding ? 0.5 : 0);
      return rate * sqmN;
    }
    if (service === "window") {
      return toSafeNumber(large) * 10 + toSafeNumber(medium) * 5 + toSafeNumber(small) * 2.5;
    }
    return 0.25 * sqmN;
  }, [service, sqm, large, medium, small, snow, sanding]);

  const services: { id: Service; label: string }[] = [
    { id: "pressure", label: "Pressure Washing" },
    { id: "window", label: "Window Cleaning" },
    { id: "lawn", label: "Lawn Mowing" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Calculator className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display text-xl font-bold">Instant Price Calculator</h3>
          <p className="text-sm text-muted-foreground">Estimate your job in seconds</p>
        </div>
      </div>

      <div className="mb-5">
        <Label className="mb-2 block text-sm font-medium">Select Service</Label>
        <div className="grid grid-cols-3 gap-2">
          {services.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setService(s.id);
                setShown(null);
              }}
              className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                service === s.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {(service === "pressure" || service === "lawn") && (
        <div className="mb-5">
          <Label htmlFor="sqm" className="mb-2 block text-sm font-medium">Square Meters</Label>
          <Input
            id="sqm"
            type="number"
            inputMode="decimal"
            min={0}
            max={MAX_VALUE}
            value={sqm}
            onChange={(e) => setSqm(e.currentTarget.value)}
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>
      )}

      {service === "pressure" && (
        <div className="mb-5 space-y-2 rounded-lg bg-muted/50 p-4">
          <p className="text-sm font-medium">Add-ons</p>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={snow}
              onChange={(e) => setSnow(e.currentTarget.checked)}
            />
            Stone Snow Washing (+£0.50/sqm)
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sanding}
              onChange={(e) => setSanding(e.currentTarget.checked)}
            />
            Sanding (+£0.50/sqm)
          </label>
        </div>
      )}

      {service === "window" && (
        <div className="mb-5 grid grid-cols-3 gap-3">
          <div>
            <Label className="mb-1 block text-xs">Large (£10)</Label>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX_VALUE}
              value={large}
              onChange={(e) => setLarge(e.currentTarget.value)}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">Medium (£5)</Label>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX_VALUE}
              value={medium}
              onChange={(e) => setMedium(e.currentTarget.value)}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
          <div>
            <Label className="mb-1 block text-xs">Small (£2.50)</Label>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX_VALUE}
              value={small}
              onChange={(e) => setSmall(e.currentTarget.value)}
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        </div>
      )}

      <Button
        variant="hero"
        size="lg"
        className="w-full"
        type="button"
        onClick={() => setShown(total)}
      >
        Calculate Price
      </Button>

      <div className="mt-5 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-5 text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Estimated Price</p>
        <p className="mt-1 font-display text-4xl font-bold text-primary">
          £{(shown ?? 0).toFixed(2)}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Final price confirmed after a free no-obligation quote.
        </p>
      </div>
    </div>
  );
}
