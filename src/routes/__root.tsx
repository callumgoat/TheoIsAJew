import { Outlet, Link, createRootRoute, HeadContent } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CJ Servicing — Exterior Cleaning in Nottingham & Derby" },
      {
        name: "description",
        content:
          "Affordable, reliable pressure washing, window cleaning & lawn mowing across Nottingham and Derby. Same-day quotes — call 07554639668.",
      },
      { name: "author", content: "CJ Servicing" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "CJ Servicing — Exterior Cleaning in Nottingham & Derby" },
      { name: "twitter:title", content: "CJ Servicing — Exterior Cleaning in Nottingham & Derby" },
      { property: "og:description", content: "Affordable, reliable exterior cleaning in Nottingham & Derby. Free same-day quotes." },
      { name: "twitter:description", content: "Affordable, reliable exterior cleaning in Nottingham & Derby. Free same-day quotes." },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
