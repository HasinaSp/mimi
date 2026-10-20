import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ActiveAdminNav, AdminNav } from "@/components/admin/admin-nav";
import { LogoMark } from "@/components/site/logo";
import { Icon, icons } from "@/components/ui/icon";
import { logout } from "@/lib/actions/auth";
import { requireAdmin } from "@/lib/dal";

export const metadata: Metadata = {
  title: { default: "Back-office", template: "%s · Back-office" },
  robots: { index: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-sand-50 lg:flex-row">
      <aside className="bg-plum-900 p-4 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:p-6">
        <div className="mb-4 flex items-center justify-between lg:mb-10">
          <Link href="/admin" className="flex items-center gap-3">
            <LogoMark className="size-9" />
            <span className="font-display text-lg text-white">Back-office</span>
          </Link>
        </div>
        <Suspense fallback={<AdminNav />}>
          <ActiveAdminNav />
        </Suspense>
        <div className="mt-4 hidden space-y-1 border-t border-white/10 pt-4 lg:mt-auto lg:block">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-plum-200 hover:bg-white/10 hover:text-white">
            <Icon path={icons.external} /> Voir le site
          </Link>
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-plum-200 hover:bg-white/10 hover:text-white">
              <Icon path={icons.logout} /> Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <Suspense fallback={<div className="p-8 text-sm text-muted">Chargement…</div>}>
          <AuthGate>{children}</AuthGate>
        </Suspense>
      </div>
    </div>
  );
}

async function AuthGate({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-sand-300 bg-white px-4 py-3 sm:px-8">
        <p className="text-sm text-muted">
          Connectée en tant que <span className="font-medium text-plum-800">{user.name ?? user.email}</span>
        </p>
        <form action={logout} className="lg:hidden">
          <button type="submit" className="text-sm font-medium text-plum-700">
            Déconnexion
          </button>
        </form>
      </div>
      <div className="p-4 sm:p-8">{children}</div>
    </>
  );
}
