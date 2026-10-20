import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/site/logo";
import { site } from "@/lib/site";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-plum-800 via-plum-700 to-coral-600 px-4 py-16">
      <div className="w-full max-w-sm rounded-[1.75rem] bg-white p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <LogoMark className="size-14" />
          <h1 className="text-2xl">Back-office</h1>
          <p className="text-sm text-muted">{site.name}</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-muted hover:text-plum-700">
            ← Retour au site
          </Link>
        </p>
      </div>
    </main>
  );
}
