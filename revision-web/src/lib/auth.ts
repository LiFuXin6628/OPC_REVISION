import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

export const sessionCookie = "revision_session";
export const sessionLifetime = 60 * 60 * 8;
const issuer = "revision-web";
const audience = "revision-admin";

export function signingKey() {
  const key = new TextEncoder().encode(process.env.JWT_SECRET ?? "");
  return key.length >= 32 ? key : null;
}

export function createSession(username: string, key: Uint8Array) {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(`${sessionLifetime}s`)
    .sign(key);
}

export async function isAdmin(token?: string) {
  const key = signingKey();
  if (!token || !key) return false;

  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"], issuer, audience, requiredClaims: ["sub", "iat", "exp"],
    });
    return payload.role === "admin" && payload.sub === process.env.ADMIN_USERNAME;
  } catch {
    return false;
  }
}

