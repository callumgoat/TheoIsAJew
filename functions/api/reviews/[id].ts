import { json, requireSession, type Env } from "../../_lib/auth";

const KV_PREFIX = "review:";
const MAX_NAME = 80;
const MAX_LOCATION = 120;
const MAX_SERVICE = 80;
const MAX_TEXT = 1200;
const MAX_IMAGE_URL = 500;
const MAX_DATE = 10;

function sanitiseString(input: unknown, max: number): string {
  if (typeof input !== "string") return "";
  return input.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "").trim().slice(0, max);
}

function sanitiseRating(input: unknown): number {
  const n = typeof input === "number" ? input : Number(input);
  if (!Number.isFinite(n)) return 5;
  return Math.max(1, Math.min(5, Math.round(n)));
}

function sanitiseImageUrl(input: unknown): string {
  const s = sanitiseString(input, MAX_IMAGE_URL);
  if (!s) return "";
  try {
    const u = new URL(s);
    return u.protocol === "https:" ? s : "";
  } catch {
    return "";
  }
}

function sanitiseDate(input: unknown): string {
  const s = sanitiseString(input, MAX_DATE);
  return /^\d{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12]\d|3[01]))?$/.test(s) ? s : "";
}

function isValidId(id: string): boolean {
  return /^[a-f0-9]{32}$/.test(id);
}

interface StoredReview {
  id: string;
  name: string;
  location: string;
  service: string;
  rating: number;
  text: string;
  date?: string;
  imageUrl?: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

// PUT /api/reviews/:id — admin only.
export const onRequestPut: PagesFunction<Env> = async (ctx) => {
  const session = await requireSession(ctx.env, ctx.request);
  if (session instanceof Response) return session;

  const id = String(ctx.params.id ?? "");
  if (!isValidId(id)) return json({ error: "invalid_id" }, { status: 400 });

  const raw = await ctx.env.REVIEWS.get(`${KV_PREFIX}${id}`);
  if (!raw) return json({ error: "not_found" }, { status: 404 });
  const existing = JSON.parse(raw) as StoredReview;

  let body: Record<string, unknown>;
  try {
    body = (await ctx.request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, { status: 400 });
  }

  const updated: StoredReview = {
    ...existing,
    name: body.name !== undefined ? sanitiseString(body.name, MAX_NAME) || existing.name : existing.name,
    location:
      body.location !== undefined ? sanitiseString(body.location, MAX_LOCATION) : existing.location,
    service:
      body.service !== undefined ? sanitiseString(body.service, MAX_SERVICE) : existing.service,
    text: body.text !== undefined ? sanitiseString(body.text, MAX_TEXT) || existing.text : existing.text,
    rating: body.rating !== undefined ? sanitiseRating(body.rating) : existing.rating,
    date: body.date !== undefined
      ? (sanitiseDate(body.date) || undefined)
      : existing.date,
    imageUrl: body.imageUrl !== undefined
      ? (sanitiseImageUrl(body.imageUrl) || undefined)
      : existing.imageUrl,
    order:
      typeof body.order === "number" && Number.isFinite(body.order)
        ? (body.order as number)
        : existing.order,
    updatedAt: Date.now(),
  };

  await ctx.env.REVIEWS.put(`${KV_PREFIX}${id}`, JSON.stringify(updated));
  return json({ review: updated });
};

// DELETE /api/reviews/:id — admin only.
export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  const session = await requireSession(ctx.env, ctx.request);
  if (session instanceof Response) return session;

  const id = String(ctx.params.id ?? "");
  if (!isValidId(id)) return json({ error: "invalid_id" }, { status: 400 });

  await ctx.env.REVIEWS.delete(`${KV_PREFIX}${id}`);
  return json({ ok: true });
};
