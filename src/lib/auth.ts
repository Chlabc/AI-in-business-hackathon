import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { DEMO_REP_ID } from "@/data/seed";
import { findDemoAccount } from "@/data/users";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { authSecretKey } from "@/lib/auth-secret";
import type { Role, SessionUser } from "@/lib/auth-types";

export { SESSION_COOKIE };
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

export async function signSession(user: SessionUser): Promise<string> {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
    repId: user.repId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SEC}s`)
    .sign(authSecretKey());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, authSecretKey());
    const email = String(payload.email ?? "");
    const role = payload.role as Role;
    if (!email || (role !== "employee" && role !== "manager")) return null;
    const account = findDemoAccount(email);
    if (!account || account.role !== role) return null;
    return {
      email: account.email,
      name: account.name,
      role: account.role,
      repId: account.repId,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) throw new AuthError("Unauthorized", 401);
  return user;
}

export async function requireRole(role: Role): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== role) throw new AuthError("Forbidden", 403);
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function jsonAuthError(error: unknown): NextResponse | null {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return null;
}

/** Employee → their repId; manager → optional query/body override or demo AE. */
export function repIdForViewer(
  user: SessionUser,
  requested?: string | null,
): string {
  if (user.role === "employee") {
    return user.repId ?? DEMO_REP_ID;
  }
  return requested?.trim() || DEMO_REP_ID;
}

export function sessionCookieOptions(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}
