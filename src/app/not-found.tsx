import Link from "next/link";
import { LogoMark } from "@/components/site/logo";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-24 text-center">
      <LogoMark className="size-14" />
      <p className="eyebrow">Erreur 404</p>
      <h1 className="text-4xl">Page introuvable</h1>
      <p className="max-w-md text-muted">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
      <Link href="/" className="btn-primary">
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
