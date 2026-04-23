import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";

export function QuoteForm() {
  const [service, setService] = useState("Pressure Washing");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "");
    const phone = String(form.get("phone") || "");
    const postcode = String(form.get("postcode") || "");
    const details = String(form.get("details") || "");
    const subject = encodeURIComponent(`Quote request — ${service}`);
    const body = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nPostcode: ${postcode}\nService: ${service}\n\nDetails:\n${details}`,
    );
    window.location.href = `mailto:enquiries@cjservicing.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
    >
      <h3 className="font-display text-xl font-bold">Request a Free Quote</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Most quotes answered within hours — same day where possible.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input id="name" name="name" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="postcode">Postcode</Label>
          <Input id="postcode" name="postcode" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="service">Service</Label>
          <select
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option>Pressure Washing</option>
            <option>Window Cleaning</option>
            <option>Lawn Mowing</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="details">Job Details</Label>
        <Textarea
          id="details"
          name="details"
          rows={4}
          placeholder="Approx area, condition, access notes…"
          className="mt-1.5"
        />
      </div>

      <Button type="submit" variant="cta" size="lg" className="mt-6 w-full">
        <Send className="h-4 w-4" /> Send Quote Request
      </Button>

      {sent && (
        <p className="mt-3 text-center text-sm text-accent-foreground">
          Opening your email app… you can also email us directly.
        </p>
      )}

      <a
        href="mailto:enquiries@cjservicing.com"
        className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <Mail className="h-4 w-4" /> Or email photos to enquiries@cjservicing.com
      </a>
    </form>
  );
}
