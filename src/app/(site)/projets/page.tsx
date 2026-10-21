import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProjectCard, ProjectGridSkeleton } from "@/components/site/project-card";
import { getPublishedProjects } from "@/lib/queries";
import { SERVICES, isServiceType } from "@/lib/services";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projets",
  description: "Découvrez les projets réalisés par Miora Dinasoa : community management, SEO, design web, vidéo et plus.",
};

export default function ProjectsPage({ searchParams }: PageProps<"/projets">) {
  return (
    <div className="container-page space-y-10 py-16">
      <header className="max-w-2xl space-y-3">
        <p className="eyebrow">Portfolio</p>
        <h1 className="text-4xl sm:text-5xl">Mes projets</h1>
        <p className="text-lg leading-relaxed text-muted">
          Une sélection de missions réalisées pour des entrepreneurs, des PME et des créateurs.
        </p>
      </header>

      <Suspense fallback={<ProjectGridSkeleton count={6} />}>
        <FilteredProjects searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function FilteredProjects({ searchParams }: { searchParams: PageProps<"/projets">["searchParams"] }) {
  const { service } = await searchParams;
  const active = isServiceType(service) ? service : undefined;
  const projects = await getPublishedProjects(active);

  return (
    <div className="space-y-10">
      <nav className="flex flex-wrap gap-2" aria-label="Filtrer par service">
        <FilterChip href="/projets" active={!active}>
          Tous
        </FilterChip>
        {SERVICES.map((s) => (
          <FilterChip key={s.value} href={`/projets?service=${s.value}`} active={active === s.value}>
            {s.label}
          </FilterChip>
        ))}
      </nav>

      {projects.length === 0 ? (
        <p className="rounded-card border border-dashed border-sand-400 p-12 text-center text-muted">
          Aucun projet publié dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition",
        active ? "border-neutral-700 bg-neutral-700 text-white" : "border-sand-400 bg-white text-ink/75 hover:border-petal-300 hover:text-neutral-700",
      )}
    >
      {children}
    </Link>
  );
}
