"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export async function login(_prev: { error?: string; email?: string }, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou mot de passe incorrect.", email: String(formData.get("email") ?? "") };
    }
    throw error; // laisse passer la redirection de Next.js
  }
  return {};
}

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
}
