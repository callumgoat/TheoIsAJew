import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, ImageIcon, Instagram, Loader2, LogOut, Pencil, Plus, Save, ShieldCheck, Star, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin")({
  // Hide from search engines and previews.
  head: () => ({
    meta: [
      { title: "Admin" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: AdminPage,
});

interface Review {
  id: string;
  name: string;
  location: string;
  service: string;
  rating: number;
  text: string;
  date?: string;
  imageUrl?: string;
  order?: number;
}

interface ReviewDraft {
  name: string;
  location: string;
  service: string;
  rating: number;
  text: string;
  date: string;
  imageUrl: string;
}

const EMPTY_DRAFT: ReviewDraft = {
  name: "",
  location: "",
  service: "Pressure Washing",
  rating: 5,
  text: "",
  date: "",
  imageUrl: "",
};

const SERVICES = ["Pressure Washing", "Window Cleaning", "Lawn Mowing"] as const;

const ADMIN_HEADERS: HeadersInit = { "x-cj-admin": "1", "content-type": "application/json" };

function formatDate(iso: string): string {
  try {
    // Accept YYYY-MM or YYYY-MM-DD
    const parts = iso.split("-");
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    const date = day
      ? new Date(Number(year), Number(month) - 1, Number(day))
      : new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: day ? "numeric" : undefined,
    });
  } catch {
    return iso;
  }
}

async function api<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: "same-origin",
    ...init,
    headers: { ...(init?.headers || {}) },
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* noop */
  }
  if (!res.ok) {
    const errVal =
      data && typeof data === "object" && "error" in data
        ? (data as Record<string, unknown>).error
        : null;
    const msg = typeof errVal === "string" && errVal ? errVal : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

function AdminPage() {
  const [authState, setAuthState] = useState<"checking" | "out" | "in">("checking");

  useEffect(() => {
    let cancelled = false;
    api<{ authenticated: boolean }>("/api/admin/session")
      .then((r) => {
        if (!cancelled) setAuthState(r.authenticated ? "in" : "out");
      })
      .catch(() => {
        if (!cancelled) setAuthState("out");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (authState === "checking") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (authState === "out") return <LoginForm onSuccess={() => setAuthState("in")} />;
  return <Dashboard onLogout={() => setAuthState("out")} />;
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  useEffect(() => {
    if (retryAfter === null || retryAfter <= 0) return;
    const id = setInterval(() => setRetryAfter((r) => (r && r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [retryAfter]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 429) {
        const data = (await res.json().catch(() => ({}))) as { retryAfter?: number };
        setRetryAfter(data.retryAfter ?? 60);
        setError("Too many attempts. Please wait.");
        return;
      }
      if (!res.ok) {
        setError("Invalid username or password.");
        setPassword("");
        return;
      }
      onSuccess();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const blocked = retryAfter !== null && retryAfter > 0;

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
        autoComplete="off"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Admin sign in</h1>
            <p className="text-xs text-muted-foreground">Authorised personnel only.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="admin-user">Username</Label>
            <Input
              id="admin-user"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={128}
              required
              disabled={submitting || blocked}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="admin-pass">Password</Label>
            <Input
              id="admin-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={256}
              required
              disabled={submitting || blocked}
              className="mt-1"
            />
          </div>

          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {error}
              {blocked && retryAfter !== null && ` Retry in ${retryAfter}s.`}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={submitting || blocked}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ReviewDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<{ reviews: Review[] }>("/api/reviews");
      setReviews(data.reviews);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const startEdit = (r: Review) => {
    setCreating(false);
    setEditingId(r.id);
    setDraft({
      name: r.name,
      location: r.location,
      service: r.service,
      rating: r.rating,
      text: r.text,
      date: r.date ?? "",
      imageUrl: r.imageUrl ?? "",
    });
  };

  const startCreate = () => {
    setEditingId(null);
    setCreating(true);
    setDraft(EMPTY_DRAFT);
  };

  const cancel = () => {
    setEditingId(null);
    setCreating(false);
    setDraft(EMPTY_DRAFT);
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);
    // Optimistic update — reflect the change in the list immediately.
    if (editingId) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, ...draft } : r,
        ),
      );
    }
    const capturedEditingId = editingId;
    const capturedCreating = creating;
    cancel();
    try {
      if (capturedEditingId) {
        await api(`/api/reviews/${capturedEditingId}`, {
          method: "PUT",
          headers: ADMIN_HEADERS,
          body: JSON.stringify(draft),
        });
      } else if (capturedCreating) {
        await api(`/api/reviews`, {
          method: "POST",
          headers: ADMIN_HEADERS,
          body: JSON.stringify(draft),
        });
        // For creates we need the server-assigned id, so refresh.
        await refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
      // Roll back by re-fetching on error.
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    // Optimistic removal — disappears instantly.
    setReviews((prev) => prev.filter((r) => r.id !== id));
    try {
      await api(`/api/reviews/${id}`, { method: "DELETE", headers: ADMIN_HEADERS });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
      // Roll back on error.
      await refresh();
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: ADMIN_HEADERS,
        credentials: "same-origin",
      });
    } finally {
      onLogout();
    }
  };

  const editorOpen = creating || editingId !== null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Admin</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="reviews">
            <Star className="h-4 w-4" /> Reviews
          </TabsTrigger>
          <TabsTrigger value="posts">
            <Instagram className="h-4 w-4" /> Gallery posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <div className="mb-4 flex justify-end">
            <Button onClick={startCreate} disabled={editorOpen}>
              <Plus className="h-4 w-4" /> Add review
            </Button>
          </div>

          {editorOpen && (
            <ReviewEditor
              draft={draft}
              setDraft={setDraft}
              onSave={save}
              onCancel={cancel}
              saving={saving}
              mode={creating ? "create" : "edit"}
            />
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No reviews yet. Click <span className="font-medium text-foreground">Add review</span> to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      {r.imageUrl && (
                        <img
                          src={r.imageUrl}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-lg object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-semibold">{r.name}</p>
                          <span className="flex gap-0.5 text-accent">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-current" />
                            ))}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {r.location || "—"} · {r.service || "—"}
                          {r.date ? ` · ${formatDate(r.date)}` : ""}
                        </p>
                        <p className="mt-2 line-clamp-3 text-sm text-foreground/80">{r.text}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(r)} disabled={editorOpen}>
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => remove(r.id)} disabled={editorOpen}>
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="posts">
          <PostsManager onError={setError} />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function ReviewEditor({
  draft,
  setDraft,
  onSave,
  onCancel,
  saving,
  mode,
}: {
  draft: ReviewDraft;
  setDraft: (d: ReviewDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  mode: "create" | "edit";
}) {
  const update = <K extends keyof ReviewDraft>(key: K, value: ReviewDraft[K]) =>
    setDraft({ ...draft, [key]: value });

  const valid = useMemo(() => draft.name.trim().length > 0 && draft.text.trim().length > 0, [draft]);

  return (
    <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{mode === "create" ? "New review" : "Edit review"}</h2>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}>
          <X className="h-4 w-4" /> Cancel
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="rv-name">Name</Label>
          <Input
            id="rv-name"
            value={draft.name}
            onChange={(e) => update("name", e.target.value)}
            maxLength={80}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="rv-location">Location</Label>
          <Input
            id="rv-location"
            value={draft.location}
            onChange={(e) => update("location", e.target.value)}
            maxLength={120}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="rv-service">Service</Label>
          <Select value={draft.service} onValueChange={(v) => update("service", v)}>
            <SelectTrigger id="rv-service" className="mt-1">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {SERVICES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="rv-rating">Rating (1–5)</Label>
          <Input
            id="rv-rating"
            type="number"
            min={1}
            max={5}
            step={1}
            value={draft.rating}
            onChange={(e) => update("rating", Math.max(1, Math.min(5, Number(e.target.value) || 5)))}
            className="mt-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="rv-text">Review text</Label>
          <Textarea
            id="rv-text"
            value={draft.text}
            onChange={(e) => update("text", e.target.value)}
            maxLength={1200}
            rows={5}
            required
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted-foreground">{draft.text.length}/1200 characters</p>
        </div>
        <div>
          <Label htmlFor="rv-date">
            <CalendarDays className="mr-1 inline h-3.5 w-3.5" />
            Date (YYYY-MM-DD or YYYY-MM)
          </Label>
          <Input
            id="rv-date"
            value={draft.date}
            onChange={(e) => update("date", e.target.value)}
            placeholder="e.g. 2024-03-15"
            maxLength={10}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="rv-image">
            <ImageIcon className="mr-1 inline h-3.5 w-3.5" />
            Image URL (https://)
          </Label>
          <Input
            id="rv-image"
            value={draft.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
            maxLength={500}
            className="mt-1"
          />
          {draft.imageUrl && (
            <img
              src={draft.imageUrl}
              alt="Preview"
              className="mt-2 h-20 w-20 rounded-lg object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={saving || !valid}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Instagram posts manager
// ---------------------------------------------------------------------------

interface IgPostRow {
  id: string;
  embedHtml: string;
  permalink: string;
}

function PostsManager({ onError }: { onError: (msg: string | null) => void }) {
  const [posts, setPosts] = useState<IgPostRow[] | null>(null);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  const refresh = useCallback(async () => {
    try {
      // cache: "no-store" so the admin always gets live data, bypassing the
      // 60-second public cache that the gallery page benefits from.
      const data = await api<{ posts: IgPostRow[] }>("/api/posts", { cache: "no-store" });
      setPosts(data.posts ?? []);
    } catch (e) {
      onError(e instanceof Error ? e.message : "Failed to load posts.");
    }
  }, [onError]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async () => {
    const embedHtml = draft.trim();
    if (!embedHtml) return;
    setAdding(true);
    onError(null);

    const tempId = `temp-${Date.now()}`;
    const permMatch = embedHtml.match(/data-instgrm-permalink="([^"]+)"/i);
    const permalink = permMatch ? permMatch[1].replace(/&amp;/g, "&") : "";
    // Show the post immediately in the list before the request completes.
    setPosts((prev) => [...(prev ?? []), { id: tempId, embedHtml, permalink }]);
    setDraft("");

    try {
      const result = await api<{ post: IgPostRow }>("/api/posts", {
        method: "POST",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({ embedHtml }),
      });
      // Swap the temporary placeholder for the real entry returned by the API.
      // No extra GET request needed — state is already up to date.
      setPosts((prev) =>
        (prev ?? []).map((p) => (p.id === tempId ? result.post : p))
      );
    } catch (e) {
      onError(e instanceof Error ? e.message : "Failed to add post.");
      // Roll back by removing the optimistic entry.
      setPosts((prev) => (prev ?? []).filter((p) => p.id !== tempId));
    } finally {
      setAdding(false);
    }
  };

  const remove = async (id: string) => {
    if (id.startsWith("temp-")) return;
    if (!confirm("Delete this Instagram post?")) return;
    setPosts((prev) => (prev ?? []).filter((p) => p.id !== id));
    try {
      await api(`/api/posts/${id}`, { method: "DELETE", headers: ADMIN_HEADERS });
    } catch (e) {
      onError(e instanceof Error ? e.message : "Failed to delete post.");
      await refresh();
    }
  };

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-border bg-card p-5">
        <Label htmlFor="ig-embed">Instagram embed code</Label>
        <Textarea
          id="ig-embed"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={'Paste the full embed code from Instagram (starts with <blockquote class="instagram-media" ...>)'}
          rows={6}
          className="mt-1 font-mono text-xs"
          disabled={adding}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          On Instagram open the post → ⋯ menu → <span className="font-medium">Embed</span> → Copy Embed Code. Paste the entire block here.
        </p>
        <div className="mt-4 flex justify-end">
          <Button onClick={add} disabled={adding || !draft.trim()}>
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add post
          </Button>
        </div>
      </div>

      {posts === null ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No Instagram posts yet. Paste an embed code above to add one.
        </div>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Instagram className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  {p.permalink ? (
                    <a
                      href={p.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-sm font-medium text-primary hover:underline"
                    >
                      {p.permalink}
                    </a>
                  ) : (
                    <p className="truncate text-sm font-medium">Instagram post</p>
                  )}
                  <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{p.id}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => remove(p.id)}
                  disabled={p.id.startsWith("temp-")}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
