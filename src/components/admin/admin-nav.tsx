"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, icons } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: icons.home, exact: true },
  { href: "/admin/demandes", label: "Demandes", icon: icons.inbox },
  { href: "/admin/projets", label: "Projets", icon: icons.folder },
];

export function ActiveAdminNav() {
  return <AdminNav pathname={usePathname()} />;
}

/** Rendu sans état actif tant que l'URL n'est pas connue (fallback de Suspense) */
export function AdminNav({ pathname = "" }: { pathname?: string }) {
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Back-office">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              active ? "bg-white/15 text-white" : "text-plum-200 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon path={item.icon} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
