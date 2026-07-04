import { SignJWT, jwtVerify } from "jose";

/**
 * Sessão de admin única e simples: sem cadastro, sem e-mail — só uma
 * senha (ADMIN_PASSWORD) comparada em tempo constante, e um cookie
 * assinado com jose (compatível com Edge Runtime, usado no middleware).
 */
export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_DURATION = "7d";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET não configurado — ver .env.example"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
