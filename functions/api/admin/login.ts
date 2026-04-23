import {
  checkLoginRateLimit,
  clearLoginFailures,
  clientIp,
  createSession,
  json,
  recordLoginFailure,
  sessionCookieHeader,
  verifyPassword,
  type Env,
} from "../../_lib/auth";

interface LoginBody {
  username?: unknown;
  password?: unknown;
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const ip = clientIp(ctx.request);

  const rl = await checkLoginRateLimit(ctx.env, ip);
  if (!rl.allowed) {
    return json(
      { error: "rate_limited", retryAfter: rl.retryAfter },
      { status: 429, headers: { "retry-after": String(rl.retryAfter ?? 60) } },
    );
  }

  let body: LoginBody;
  try {
    body = (await ctx.request.json()) as LoginBody;
  } catch {
    return json({ error: "invalid_json" }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  // Reject obviously oversized payloads early.
  if (username.length > 128 || password.length > 256) {
    await recordLoginFailure(ctx.env, ip);
    return json({ error: "invalid_credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(ctx.env, username, password);
  if (!ok) {
    await recordLoginFailure(ctx.env, ip);
    // Add a small artificial delay to further blunt brute force timing.
    await new Promise((r) => setTimeout(r, 250));
    return json({ error: "invalid_credentials" }, { status: 401 });
  }

  await clearLoginFailures(ctx.env, ip);
  const { token } = await createSession(ctx.env, username);
  return json(
    { ok: true },
    {
      status: 200,
      headers: { "set-cookie": sessionCookieHeader(token) },
    },
  );
};
