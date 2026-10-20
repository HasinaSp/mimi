"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon, icons } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/#services", label: "Services" },
  { href: "/projets", label: "Projets" },
  { href: "/#contact", label: "Contact" },
];

/** Navigation desktop (sans état actif) — utilisée aussi comme fallback de Suspense */
export function DesktopNav({ pathname = "" }: { pathname?: string }) {
  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
      {NAV.map((item) => {
        const active = item.href === pathname || (item.href === "/projets" && pathname.startsWith("/projets"));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              active ? "bg-plum-100 text-plum-800" : "text-ink/75 hover:text-plum-700",
            )}
          >
            {item.label}
          </Link>
        );
      })}
      <Link href="/collaboration" className="btn-primary ml-2">
        Travaillons ensemble
      </Link>
    </nav>
  );
}

export function ActiveDesktopNav() {
  return <DesktopNav pathname={usePathname()} />;
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="rounded-full p-2 text-plum-800 md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      >
        <Icon path={open ? icons.close : icons.menu} className="size-6" />
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-full border-y border-sand-300 bg-sand-50 md:hidden" aria-label="Navigation mobile">
          <div className="container-page flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 font-medium text-ink/80 hover:bg-plum-50"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/collaboration" onClick={() => setOpen(false)} className="btn-primary mt-2">
              Travaillons ensemble
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
