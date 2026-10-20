import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { Icon, icons } from "@/components/ui/icon";
import { deleteProject } from "@/lib/actions/projects";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Modifier le projet" };

export default async function EditProjectPage({ params }: PageProps<"/admin/projets/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <>
      <PageHeader
        title="Modifier le projet"
        description={project.title}
        actions={
          <>
            {project.published && (
              <Link href={`/projets/${project.slug}`} target="_blank" className="btn-ghost">
                <Icon path={icons.eye} className="size-4" /> Voir
              </Link>
            )}
            <form action={deleteProject}>
              <input type="hidden" name="id" value={project.id} />
              <ConfirmSubmit message="Supprimer définitivement ce projet ?" className="btn-danger">
                <Icon path={icons.trash} className="size-4" /> Supprimer
              </ConfirmSubmit>
            </form>
          </>
        }
      />
      <ProjectForm project={project} />
    </>
  );
}
