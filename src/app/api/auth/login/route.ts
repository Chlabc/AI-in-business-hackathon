import { NextResponse } from "next/server";
import {
  DEMO_ACCOUNTS,
  findDemoAccount,
  defaultPathForRole,
} from "@/data/users";
import { sessionCookieOptions, signSession } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: string; name?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  const requestedRole = body.role?.trim();

  // Sign in as yourself: pick a side, and we attach your name to that side's
  // demo profile so the seeded history and every role guard still apply.
  const account =
    findDemoAccount(email) ??
    (requestedRole === "employee" || requestedRole === "manager"
      ? DEMO_ACCOUNTS.find((a) => a.role === requestedRole)
      : undefined);

  if (!account) {
    return NextResponse.json(
      { error: "Choose whether you're a rep or a manager." },
      { status: 401 },
    );
  }

  const name = body.name?.trim() ?? "";
  if (name.length > 40) {
    return NextResponse.json(
      { error: "That name is too long — 40 characters max." },
      { status: 400 },
    );
  }

  const user = {
    email: account.email,
    name: name || account.name,
    role: account.role,
    repId: account.repId,
  };
  const token = await signSession(user);
  const res = NextResponse.json({
    user,
    redirectTo: defaultPathForRole(account.role),
  });
  const cookie = sessionCookieOptions(token);
  res.cookies.set(cookie.name, cookie.value, {
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    secure: cookie.secure,
    path: cookie.path,
    maxAge: cookie.maxAge,
  });
  return res;
}
