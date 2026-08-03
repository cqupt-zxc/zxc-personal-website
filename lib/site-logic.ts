import { createHmac, timingSafeEqual } from "node:crypto";

export const privateCookieName = "private_archive_access";

function privateAccessSignature(expiresAt: string, secret: string) {
  return createHmac("sha256", secret).update(expiresAt).digest("base64url");
}

export function createPrivateAccessToken(secret: string, now = Date.now(), ttlMs = 12 * 60 * 60 * 1000) {
  if (!secret) throw new Error("PRIVATE_ARCHIVE_PASSWORD is required");
  const expiresAt = String(now + ttlMs);
  return `${expiresAt}.${privateAccessSignature(expiresAt, secret)}`;
}

export function verifyPrivateAccessToken(token: string | undefined, secret: string | undefined, now = Date.now()) {
  if (!token || !secret) return false;
  const [expiresAt, signature, extra] = token.split(".");
  if (!expiresAt || !signature || extra || !/^\d+$/.test(expiresAt) || Number(expiresAt) < now) return false;
  const expected = privateAccessSignature(expiresAt, secret);
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return suppliedBuffer.length === expectedBuffer.length && timingSafeEqual(suppliedBuffer, expectedBuffer);
}

export function isAdminEmail(email: string | undefined, allowlist: string | undefined) {
  if (!email || !allowlist) return false;
  return allowlist.split(",").map((item) => item.trim().toLowerCase()).includes(email.toLowerCase());
}

export function selectedRepositoryNames(names: string[]) {
  return [...new Set(names.map((name) => name.trim()).filter(Boolean))];
}
