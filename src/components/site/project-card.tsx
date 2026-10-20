import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/generated/prisma/client";
import { Icon, icons } from "@/components/ui/icon";
import { getService } from "@/lib/services";

export function ProjectCover({ project, sizes }: { project: Pick<Project, "title" | "coverImage" | "service">; sizes: string }) {
  const service = getService(project.service);
  if (project.coverImage) {
    return <Image src={project.coverImage} alt={project.title} fill sizes={sizes} className="object-cover" />;
  }
  // Visuel par défaut quand aucune image n'est fournie
  return (
    <div className="flex size-full items-center justify-center bg-gradient-to-br from-plum-600 via-plum-700 to-coral-500">
      {service && <Icon path={service.icon} className="size-14 text-white/85" />}
    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const service = getService(project.service);
  return (
    <Link
      href={`/projets/${project.slug}`}
      className="group card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-sand-200">
        <div className="size-full transition duration-500 group-hover:scale-105">
          <ProjectCover project={project} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        </div>
        {project.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-plum-700">
            ★ À la une
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <span className="eyebrow">{service?.label}</span>
        <h3 className="text-xl leading-snug">{project.title}</h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{project.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-coral-600">
          Voir le projet
          <Icon path={icons.arrowRight} className="size-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function ProjectGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-[16/10] animate-pulse bg-sand-200" />
          <div className="space-y-3 p-6">
            <div className="h-3 w-24 animate-pulse rounded bg-sand-200" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-sand-200" />
            <div className="h-3 w-full animate-pulse rounded bg-sand-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
