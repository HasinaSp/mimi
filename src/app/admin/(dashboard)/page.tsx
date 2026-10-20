import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Icon, icons } from "@/components/ui/icon";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { serviceLabel } from "@/lib/services";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  await requireAdmin();

  const [newCount, inProgressCount, totalRequests, publishedCount, draftCount, recent] = await Promise.all([
    prisma.collaborationRequest.count({ where: { status: "NEW" } }),
    prisma.collaborationRequest.count({ where: { status: "IN_PROGRESS" } }),
    prisma.collaborationRequest.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.project.count({ where: { published: false } }),
    prisma.collaborationRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Nouvelles demandes", value: newCount, href: "/admin/demandes?status=NEW", accent: "bg-coral-500" },
    { label: "Demandes en cours", value: inProgressCount, href: "/admin/demandes?status=IN_PROGRESS", accent: "bg-amber-400" },
    { label: "Total des demandes", value: totalRequests, href: "/admin/demandes", accent: "bg-plum-500" },
    { label: "Projets publiés", value: publishedCount, href: "/admin/projets", accent: "bg-sage-500", sub: `${draftCount} brouillon(s)` },
  ];

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de votre activité."
        actions={
          <Link href="/admin/projets/nouveau" className="btn-primary">
            <Icon path={icons.plus} className="size-4" /> Nouveau projet
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card relative overflow-hidden p-5 transition hover:-translate-y-0.5">
            <span className={`absolute inset-y-0 left-0 w-1.5 ${s.accent}`} />
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-2 font-display text-4xl text-plum-800">{s.value}</p>
            {s.sub && <p className="mt-1 text-xs text-muted">{s.sub}</p>}
          </Link>
        ))}
      </div>

      <section className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-sand-300 px-6 py-4">
          <h2 className="text-xl">Dernières demandes</h2>
          <Link href="/admin/demandes" className="text-sm font-semibold text-coral-600 hover:underline">
            Tout voir
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">Aucune demande pour le moment.</p>
        ) : (
          <ul className="divide-y divide-sand-200">
            {recent.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/demandes/${r.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-4 hover:bg-sand-50">
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-plum-800">{r.fullName}</span>
                    <span className="block truncate text-sm text-muted">{r.services.map(serviceLabel).join(", ")}</span>
                  </span>
                  <span className="text-xs text-muted">{formatDate(r.createdAt, { day: "numeric", month: "short" })}</span>
                  <StatusBadge status={r.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
