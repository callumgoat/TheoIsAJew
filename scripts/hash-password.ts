/**
 * Generates a PBKDF2-SHA256 hash + salt for the admin password.
 *
 * Usage:
 *   bun run scripts/hash-password.ts "<password>"
 *
 * Paste the output into your Cloudflare Pages encrypted env vars
 * (ADMIN_PASSWORD_HASH, ADMIN_PASSWORD_SALT) or your local `.dev.vars`.
 *
 * IMPORTANT: never commit the resulting hash or the password itself.
 */

const ITERATIONS = 210_000;
const KEY_LEN_BITS = 256;

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  // btoa is available in Bun.
  return btoa(bin);
}

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error('Usage: bun run scripts/hash-password.ts "<password>"');
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("Refusing: password must be at least 12 characters.");
    process.exit(1);
  }

  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_LEN_BITS,
  );

  console.log("Paste these values (WITHOUT surrounding quotes) into Cloudflare Pages secrets:\n");
  console.log(`ADMIN_PASSWORD_HASH=${toBase64(bits)}`);
  console.log(`ADMIN_PASSWORD_SALT=${toBase64(salt.buffer)}`);
  console.log(`\n# iterations=${ITERATIONS} algo=PBKDF2-SHA256 keyLen=${KEY_LEN_BITS}bit`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
