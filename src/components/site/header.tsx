import { Suspense } from "react";
import { Logo } from "@/components/site/logo";
import { ActiveDesktopNav, DesktopNav, MobileNav } from "@/components/site/header-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sand-300/70 bg-sand-100/85 backdrop-blur-md">
      <div className="container-page relative flex h-18 items-center justify-between gap-4 py-3">
        <Logo />
        <Suspense fallback={<DesktopNav />}>
          <ActiveDesktopNav />
        </Suspense>
        <MobileNav />
      </div>
    </header>
  );
}
