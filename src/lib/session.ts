// Signed admin session cookie helpers (Web Crypto; works on Workers).
export const SESSION_COOKIE = "bv_admin";
export type AdminSession = { id: string; name: string; avatar: string | null; exp: number };

const enc = new TextEncoder();
const b64url = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf as ArrayBuffer))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64url = (s: string) => atob(s.replace(/-/g, "+").replace(/_/g, "/"));

async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

export async function signSession(s: AdminSession, secret: string) {
  const body = b64url(enc.encode(JSON.stringify(s)));
  return `${body}.${await hmac(secret, body)}`;
}

export async function verifySession(token: string | undefined, secret: string): Promise<AdminSession | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = await hmac(secret, body);
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    const s = JSON.parse(fromB64url(body)) as AdminSession;
    return s.exp > Date.now() ? s : null;
  } catch {
    return null;
  }
}

export function adminIds(raw: string | undefined) {
  return (raw ?? "").split(/[\s,]+/).filter(Boolean);
}
