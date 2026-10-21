import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectCover } from "@/components/site/project-card";
import { Icon, icons } from "@/components/ui/icon";
import { getPublishedProject } from "@/lib/queries";
import { serviceLabel } from "@/lib/services";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/projets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return { title: "Projet introuvable" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: project.coverImage ? { images: [project.coverImage] } : undefined,
  };
}

export default function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  return (
    <div className="container-page py-12">
      <Link href="/projets" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-leaf-700">
        <Icon path={icons.arrowLeft} className="size-4" /> Tous les projets
      </Link>
      <Suspense fallback={<div className="aspect-[16/7] animate-pulse rounded-card bg-sand-200" />}>
        <ProjectDetail params={params} />
      </Suspense>
    </div>
  );
}

async function ProjectDetail({ params }: { params: PageProps<"/projets/[slug]">["params"] }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) notFound();

  const meta = [
    { label: "Service", value: serviceLabel(project.service) },
    project.client && { label: "Client", value: project.client },
    project.completedAt && { label: "Date", value: formatDate(project.completedAt, { month: "long", year: "numeric" }) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="space-y-10">
      <header className="max-w-3xl space-y-4">
        <p className="eyebrow">{serviceLabel(project.service)}</p>
        <h1 className="text-4xl sm:text-5xl">{project.title}</h1>
        <p className="text-lg leading-relaxed text-muted">{project.summary}</p>
      </header>

      <div className="relative aspect-[16/8] overflow-hidden rounded-card bg-sand-200 shadow-soft">
        <ProjectCover project={project} sizes="(min-width: 1152px) 1152px, 100vw" />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="prose-simple max-w-none text-base">
          {project.description.split(/\n{2,}/).map((para, i) => (
            <p key={i} className="whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>

        <aside className="card h-fit space-y-5 p-6">
          <dl className="space-y-4">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs font-semibold tracking-wider text-muted uppercase">{m.label}</dt>
                <dd className="mt-1 font-medium text-neutral-800">{m.value}</dd>
              </div>
            ))}
          </dl>
          {project.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <li key={t} className="rounded-full bg-petal-50 px-3 py-1 text-xs font-medium text-neutral-700">
                  {t}
                </li>
              ))}
            </ul>
          )}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full">
              Voir le résultat <Icon path={icons.external} className="size-4" />
            </a>
          )}
          <Link href="/collaboration" className="btn-primary w-full">
            Un projet similaire ?
          </Link>
        </aside>
      </div>

      {project.gallery.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-2xl">Galerie</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.gallery.map((src, i) => (
              <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand-200">
                <Image src={src} alt={`${project.title} — visuel ${i + 1}`} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
