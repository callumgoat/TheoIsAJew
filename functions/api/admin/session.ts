import { json, readSession, type Env } from "../../_lib/auth";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const s = await readSession(ctx.env, ctx.request);
  if (!s) return json({ authenticated: false }, { status: 200 });
  return json({ authenticated: true, user: s.user, expiresAt: s.expiresAt }, { status: 200 });
};
