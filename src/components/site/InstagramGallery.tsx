import { useEffect, useRef, useState } from "react";
import { Loader2, Instagram } from "lucide-react";

interface IgPost {
  id: string;
  embedHtml: string;
  permalink: string;
}

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

const EMBED_SCRIPT_SRC = "https://www.instagram.com/embed.js";

function loadInstagramScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.instgrm?.Embeds?.process) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${EMBED_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      // If already loaded.
      if (window.instgrm?.Embeds?.process) resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = EMBED_SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.body.appendChild(s);
  });
}

export function InstagramGallery() {
  const [posts, setPosts] = useState<IgPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/posts", { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
      .then((data: { posts?: IgPost[] }) => {
        if (cancelled) return;
        setPosts(data.posts ?? []);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // After posts render, ask Instagram to hydrate the blockquotes.
  useEffect(() => {
    if (!posts || posts.length === 0) return;
    let cancelled = false;
    loadInstagramScript().then(() => {
      if (cancelled) return;
      // Small delay lets React finish DOM insertion.
      requestAnimationFrame(() => {
        try {
          window.instgrm?.Embeds?.process();
        } catch {
          /* ignore */
        }
      });
    });
    return () => {
      cancelled = true;
    };
  }, [posts]);

  if (posts === null && !error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !posts || posts.length === 0) {
    // Silent empty state — gallery page still shows before/after content.
    return null;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-center gap-2 text-muted-foreground">
        <Instagram className="h-5 w-5" />
        <span className="text-sm font-medium uppercase tracking-wider">Recent work on Instagram</span>
      </div>
      <div
        ref={containerRef}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {posts.map((p) => (
          <div
            key={p.id}
            className="w-full"
            // eslint-disable-next-line react/no-danger -- content comes from admin-only API and is sanitised server-side
            dangerouslySetInnerHTML={{ __html: p.embedHtml }}
          />
        ))}
      </div>
    </div>
  );
}
