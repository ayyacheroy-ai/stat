"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "./constants";

/**
 * Fake authentication, isolated on purpose: this whole module is the only
 * place that knows "logging in" today just means setting a cookie. Any
 * input works — there's no real backend, no password check. When a real
 * auth provider exists, only this file (and the login form that calls it)
 * needs to change; the proxy and the rest of the app just check for a
 * session and don't care how it got there.
 */

export async function login() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, "1", {
    path: "/",
    sameSite: "lax",
  });
  redirect("/matches");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}
