import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Logo « Mi » sur fond transparent (public/logo.png) */
export function LogoMark({ className }: { className?: string }) {
  return <Image src="/logo.png" alt="" width={512} height={512} priority className={cn("size-10", className)} />;
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} — accueil`}>
      <LogoMark className="transition group-hover:rotate-[-4deg]" />
      <span className="leading-tight">
        <span className={cn("block font-display text-lg", light ? "text-white" : "text-neutral-800")}>
          {site.name}
        </span>
        <span className={cn("block text-[11px] tracking-[0.14em] uppercase", light ? "text-petal-200" : "text-muted")}>
          {site.role}
        </span>
      </span>
    </Link>
  );
}
