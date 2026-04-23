import { json, requireSession, type Env } from "../_lib/auth";

export interface IgPost {
  id: string;
  embedHtml: string; // the sanitised <blockquote class="instagram-media">...</blockquote>
  permalink: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

const KV_PREFIX = "igpost:";
const MAX_EMBED_LENGTH = 20_000; // plenty for an Instagram embed blockquote

/**
 * Extract and sanitise the Instagram embed blockquote.
 *
 * Accepts the full embed snippet (with `<script>` tag) OR just the blockquote.
 * Returns the blockquote HTML only — the `<script>` is loaded once on the page.
 */
function sanitiseInstagramEmbed(input: unknown): { ok: true; html: string; permalink: string } | { ok: false; error: string } {
  if (typeof input !== "string") return { ok: false, error: "embed_required" };
  const raw = input.trim();
  if (!raw || raw.length > MAX_EMBED_LENGTH) return { ok: false, error: "embed_invalid_length" };

  // Extract the Instagram blockquote. Non-greedy match.
  const blockRe = /<blockquote\b[^>]*class="instagram-media"[\s\S]*?<\/blockquote>/i;
  const m = raw.match(blockRe);
  if (!m) return { ok: false, error: "not_instagram_embed" };

  let html = m[0];

  // Reject if there are any nested <script>/<iframe>/<object>/<embed>/<style>/event-handler attributes.
  // The official Instagram embed blockquote contains none of these.
  if (/<script\b/i.test(html)) return { ok: false, error: "script_not_allowed_in_blockquote" };
  if (/<iframe\b/i.test(html)) return { ok: false, error: "iframe_not_allowed" };
  if (/<object\b/i.test(html)) return { ok: false, error: "object_not_allowed" };
  if (/<embed\b/i.test(html)) return { ok: false, error: "embed_tag_not_allowed" };
  if (/\son\w+\s*=/i.test(html)) return { ok: false, error: "event_handler_not_allowed" };
  if (/javascript:/i.test(html)) return { ok: false, error: "javascript_url_not_allowed" };

  // Pull the permalink (data-instgrm-permalink attribute).
  const permRe = /data-instgrm-permalink="([^"]+)"/i;
  const pm = html.match(permRe);
  let permalink = "";
  if (pm) {
    const candidate = pm[1].replace(/&amp;/g, "&");
    try {
      const u = new URL(candidate);
      if (u.protocol === "https:" && /(^|\.)instagram\.com$/i.test(u.hostname)) {
        permalink = u.toString();
      }
    } catch {
      /* ignore */
    }
  }
  if (!permalink) return { ok: false, error: "missing_instagram_permalink" };

  // Strip control chars.
  html = html.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "");

  return { ok: true, html, permalink };
}

function newId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += bytes[i].toString(16).padStart(2, "0");
  return s;
}

async function loadAllPosts(env: Env): Promise<IgPost[]> {
  const out: IgPost[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.REVIEWS.list({ prefix: KV_PREFIX, cursor });
    for (const k of page.keys) {
      const raw = await env.REVIEWS.get(k.name);
      if (!raw) continue;
      try {
        out.push(JSON.parse(raw) as IgPost);
      } catch {
        /* skip */
      }
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  out.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.createdAt - b.createdAt);
  return out;
}

// GET /api/posts — public.
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const posts = await loadAllPosts(ctx.env);
  const publicList = posts.map((p) => ({
    id: p.id,
    embedHtml: p.embedHtml,
    permalink: p.permalink,
  }));
  return new Response(JSON.stringify({ posts: publicList }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60, s-maxage=60",
      "x-content-type-options": "nosniff",
    },
  });
};

// POST /api/posts — admin only.
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const session = await requireSession(ctx.env, ctx.request);
  if (session instanceof Response) return session;

  let body: { embedHtml?: unknown; order?: unknown };
  try {
    body = (await ctx.request.json()) as typeof body;
  } catch {
    return json({ error: "invalid_json" }, { status: 400 });
  }

  const result = sanitiseInstagramEmbed(body.embedHtml);
  if (!result.ok) return json({ error: result.error }, { status: 400 });

  const now = Date.now();
  const post: IgPost = {
    id: newId(),
    embedHtml: result.html,
    permalink: result.permalink,
    order: typeof body.order === "number" && Number.isFinite(body.order) ? body.order : now,
    createdAt: now,
    updatedAt: now,
  };
  await ctx.env.REVIEWS.put(`${KV_PREFIX}${post.id}`, JSON.stringify(post));
  return json({ post }, { status: 201 });
};
