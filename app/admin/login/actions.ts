"use server";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, createSessionToken } from "@/lib/auth";

/** Compara em tempo constante — evita vazar por timing quantos caracteres bateram. */
function passwordMatches(submitted: string, expected: string): boolean {
  if (!expected) return false;
  const a = Buffer.from(submitted);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD ?? "";

  if (!passwordMatches(password, expected)) {
    redirect("/admin/login?error=1");
  }

  const token = await createSessionToken();
  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias — igual à expiração do token em lib/auth.ts
  });
  redirect("/admin");
}
