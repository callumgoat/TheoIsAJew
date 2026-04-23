import { json, requireSession, type Env } from "../../_lib/auth";

const KV_PREFIX = "igpost:";

function isValidId(id: string): boolean {
  return /^[a-f0-9]{32}$/.test(id);
}

// DELETE /api/posts/:id — admin only.
export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  const session = await requireSession(ctx.env, ctx.request);
  if (session instanceof Response) return session;

  const id = String(ctx.params.id ?? "");
  if (!isValidId(id)) return json({ error: "invalid_id" }, { status: 400 });

  await ctx.env.REVIEWS.delete(`${KV_PREFIX}${id}`);
  return json({ ok: true });
};
