import Link from "next/link";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("size-10", className)}>
      <rect width="40" height="40" rx="12" fill="#4a2358" />
      <text
        x="50%"
        y="54%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="18"
        fill="#ffffff"
      >
        MD
      </text>
      <circle cx="32" cy="9" r="3.5" fill="#e07a5f" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} — accueil`}>
      <LogoMark className="transition group-hover:rotate-[-4deg]" />
      <span className="leading-tight">
        <span className={cn("block font-display text-lg", light ? "text-white" : "text-plum-800")}>
          {site.name}
        </span>
        <span className={cn("block text-[11px] tracking-[0.14em] uppercase", light ? "text-coral-200" : "text-muted")}>
          {site.role}
        </span>
      </span>
    </Link>
  );
}
