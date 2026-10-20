import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { PageHeader } from "@/components/admin/page-header";
import { Icon, icons } from "@/components/ui/icon";
import { deleteProject, toggleProjectFlag } from "@/lib/actions/projects";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { serviceLabel } from "@/lib/services";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Projets" };

export default async function AdminProjectsPage({ searchParams }: PageProps<"/admin/projets">) {
  await requireAdmin();
  const { saved } = await searchParams;
  const projects = await prisma.project.findMany({ orderBy: [{ createdAt: "desc" }] });

  return (
    <>
      <PageHeader
        title="Projets"
        description="Publiez, modifiez ou supprimez les projets de votre portfolio."
        actions={
          <Link href="/admin/projets/nouveau" className="btn-primary">
            <Icon path={icons.plus} className="size-4" /> Nouveau projet
          </Link>
        }
      />

      {saved && <p className="mb-6 rounded-xl bg-sage-100 px-4 py-3 text-sm text-sage-700">Projet enregistré avec succès.</p>}

      <div className="card overflow-x-auto">
        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="mb-4 text-muted">Aucun projet pour le moment.</p>
            <Link href="/admin/projets/nouveau" className="btn-primary">
              Ajouter mon premier projet
            </Link>
          </div>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-sand-300 bg-sand-50 text-xs tracking-wider text-muted uppercase">
              <tr>
                <th className="px-5 py-3 font-semibold">Projet</th>
                <th className="px-5 py-3 font-semibold">Service</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
                <th className="px-5 py-3 font-semibold">À la une</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-sand-50">
                  <td className="px-5 py-4">
                    <Link href={`/admin/projets/${p.id}`} className="font-medium text-plum-800 hover:text-coral-600">
                      {p.title}
                    </Link>
                    <span className="block text-xs text-muted">
                      {p.client ? `${p.client} · ` : ""}
                      {formatDate(p.completedAt ?? p.createdAt, { month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-muted">{serviceLabel(p.service)}</td>
                  <td className="px-5 py-4">
                    <form action={toggleProjectFlag}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="field" value="published" />
                      <button
                        type="submit"
                        title="Cliquer pour changer"
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-semibold transition",
                          p.published ? "bg-sage-100 text-sage-700 hover:bg-sage-300" : "bg-stone-200 text-stone-600 hover:bg-stone-300",
                        )}
                      >
                        {p.published ? "Publié" : "Brouillon"}
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-4">
                    <form action={toggleProjectFlag}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="field" value="featured" />
                      <button type="submit" title={p.featured ? "Retirer de la une" : "Mettre à la une"} className="rounded-full p-1 hover:bg-coral-50">
                        <Icon path={icons.star} className={cn("size-5", p.featured ? "fill-coral-500 text-coral-500" : "text-sand-400")} />
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {p.published && (
                        <Link href={`/projets/${p.slug}`} target="_blank" className="rounded-lg p-2 text-muted hover:bg-plum-50 hover:text-plum-700" title="Voir sur le site">
                          <Icon path={icons.eye} className="size-4" />
                        </Link>
                      )}
                      <Link href={`/admin/projets/${p.id}`} className="rounded-lg p-2 text-muted hover:bg-plum-50 hover:text-plum-700" title="Modifier">
                        <Icon path={icons.edit} className="size-4" />
                      </Link>
                      <form action={deleteProject}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmSubmit message={`Supprimer « ${p.title} » ?`} className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600">
                          <Icon path={icons.trash} className="size-4" />
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
