import { Link } from "@tanstack/react-router";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoUrl from "@/assets/logo.png";

const PHONE = "07554639668";

export function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/gallery", label: "Gallery" },
    { to: "/pricing", label: "Pricing" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 overflow-hidden rounded-lg shadow-[var(--shadow-elegant)]"
          >
            <img src={logoUrl} alt="CJ Servicing" className="h-full w-full object-cover" decoding="async" />
          </span>
          <span>CJ Servicing</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${PHONE}`}
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <Phone className="h-4 w-4 text-accent" />
            {PHONE}
          </a>
          <Button asChild variant="cta" size="sm">
            <Link to="/contact">Get a Quote</Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col p-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`tel:${PHONE}`}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[image:var(--gradient-hero)] px-3 py-3 text-base font-semibold text-primary-foreground"
            >
              <Phone className="h-5 w-5" />
              Call {PHONE}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
