import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { RequestStatus } from "@/generated/prisma/enums";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { REQUEST_STATUSES } from "@/lib/request-status";
import { serviceLabel } from "@/lib/services";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Demandes" };

export default async function RequestsPage({ searchParams }: PageProps<"/admin/demandes">) {
  await requireAdmin();
  const { status } = await searchParams;
  const active = Object.values(RequestStatus).find((s) => s === status);

  const [requests, counts] = await Promise.all([
    prisma.collaborationRequest.findMany({
      where: active ? { status: active } : undefined,
      orderBy: { createdAt: "desc" },
    }),
    prisma.collaborationRequest.groupBy({ by: ["status"], _count: true }),
  ]);
  const countOf = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;
  const total = counts.reduce((sum, c) => sum + c._count, 0);

  return (
    <>
      <PageHeader title="Demandes de prestation" description="Gérez les demandes envoyées depuis le formulaire du site." />

      <nav className="mb-6 flex flex-wrap gap-2">
        <Tab href="/admin/demandes" active={!active} label="Toutes" count={total} />
        {REQUEST_STATUSES.map((s) => (
          <Tab key={s.value} href={`/admin/demandes?status=${s.value}`} active={active === s.value} label={s.label} count={countOf(s.value)} />
        ))}
      </nav>

      <div className="card overflow-x-auto">
        {requests.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">Aucune demande.</p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-sand-300 bg-sand-50 text-xs tracking-wider text-muted uppercase">
              <tr>
                <th className="px-5 py-3 font-semibold">Client</th>
                <th className="px-5 py-3 font-semibold">Services</th>
                <th className="px-5 py-3 font-semibold">Budget</th>
                <th className="px-5 py-3 font-semibold">Reçue le</th>
                <th className="px-5 py-3 font-semibold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-sand-50">
                  <td className="px-5 py-4">
                    <Link href={`/admin/demandes/${r.id}`} className="font-medium text-neutral-800 hover:text-leaf-700">
                      {r.fullName}
                    </Link>
                    <span className="block text-xs text-muted">{r.company ?? r.email}</span>
                  </td>
                  <td className="max-w-xs px-5 py-4 text-muted">{r.services.map(serviceLabel).join(", ")}</td>
                  <td className="px-5 py-4 text-muted">{r.budget ?? "—"}</td>
                  <td className="px-5 py-4 whitespace-nowrap text-muted">{formatDate(r.createdAt)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={r.status} />
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

function Tab({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition",
        active ? "border-neutral-700 bg-neutral-700 text-white" : "border-sand-400 bg-white text-ink/70 hover:border-petal-300",
      )}
    >
      {label}
      <span className={cn("rounded-full px-1.5 text-xs", active ? "bg-white/20" : "bg-sand-200")}>{count}</span>
    </Link>
  );
}
