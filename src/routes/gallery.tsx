import { createFileRoute } from "@tanstack/react-router";
import { InstagramGallery } from "@/components/site/InstagramGallery";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — CJ Servicing | Before & After Photos" },
      { name: "description", content: "See our before and after cleaning results from projects across Nottingham & Derby." },
      { property: "og:title", content: "Gallery — CJ Servicing" },
      { property: "og:description", content: "Before and after photos of our professional exterior cleaning work." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <>
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold sm:text-5xl">Gallery</h1>
            <p className="mt-3 text-muted-foreground">See the quality of our work across Nottingham & Derby</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <InstagramGallery />
        </div>
      </section>
    </>
  );
}
