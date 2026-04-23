import { clearSessionCookieHeader, destroySession, json, type Env } from "../../_lib/auth";

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  await destroySession(ctx.env, ctx.request);
  return json(
    { ok: true },
    { status: 200, headers: { "set-cookie": clearSessionCookieHeader() } },
  );
};
