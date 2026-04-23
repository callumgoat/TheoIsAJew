import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";
import logoUrl from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="flex h-9 w-9 overflow-hidden rounded-lg">
              <img src={logoUrl} alt="CJ Servicing" className="h-full w-full object-cover" decoding="async" />
            </span>
            CJ Servicing
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Affordable, reliable exterior cleaning across Nottingham &amp; Derby.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing &amp; Calculator</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact &amp; Quote</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Get in Touch</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" />
              <a href="tel:07554639668" className="hover:text-foreground">07554639668</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" />
              <a href="mailto:enquiries@cjservicing.com" className="hover:text-foreground">enquiries@cjservicing.com</a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              Nottingham &amp; Derby
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CJ Servicing. DM, Call, or Email to Book.
      </div>
    </footer>
  );
}
