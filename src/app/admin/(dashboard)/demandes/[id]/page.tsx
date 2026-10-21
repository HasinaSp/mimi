import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { StatusBadge } from "@/components/admin/status-badge";
import { Icon, icons } from "@/components/ui/icon";
import { deleteRequest } from "@/lib/actions/requests";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { serviceLabel } from "@/lib/services";
import { formatDate } from "@/lib/utils";
import { RequestUpdateForm } from "./request-update-form";

export default async function RequestDetailPage({ params }: PageProps<"/admin/demandes/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const request = await prisma.collaborationRequest.findUnique({ where: { id } });
  if (!request) notFound();

  const phoneDigits = request.phone?.replace(/[^\d]/g, "");
  const details = [
    { label: "Email", value: <a href={`mailto:${request.email}`} className="text-leaf-700 hover:underline">{request.email}</a> },
    request.phone && {
      label: "Téléphone",
      value: (
        <span className="flex flex-wrap gap-3">
          <a href={`tel:${request.phone}`} className="text-leaf-700 hover:underline">{request.phone}</a>
          {phoneDigits && (
            <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer" className="text-leaf-700 hover:underline">
              WhatsApp
            </a>
          )}
        </span>
      ),
    },
    request.company && { label: "Entreprise", value: request.company },
    { label: "Budget", value: request.budget ?? "—" },
    { label: "Délai", value: request.deadline ?? "—" },
    { label: "Reçue le", value: formatDate(request.createdAt, { dateStyle: "long", timeStyle: "short" }) },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  return (
    <>
      <Link href="/admin/demandes" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-leaf-700">
        <Icon path={icons.arrowLeft} className="size-4" /> Retour aux demandes
      </Link>

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <h1 className="text-3xl">{request.fullName}</h1>
        <StatusBadge status={request.status} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="mb-4 text-lg">Services demandés</h2>
            <ul className="flex flex-wrap gap-2">
              {request.services.map((s) => (
                <li key={s} className="rounded-full bg-petal-50 px-3 py-1 text-sm font-medium text-neutral-700">
                  {serviceLabel(s)}
                </li>
              ))}
            </ul>
          </section>
          <section className="card p-6">
            <h2 className="mb-4 text-lg">Message</h2>
            <p className="leading-relaxed whitespace-pre-line text-ink/85">{request.message}</p>
          </section>
          <section className="card p-6">
            <h2 className="mb-4 text-lg">Coordonnées</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="text-xs font-semibold tracking-wider text-muted uppercase">{d.label}</dt>
                  <dd className="mt-1 text-sm">{d.value}</dd>
                </div>
              ))}
            </dl>
            <a
              href={`mailto:${request.email}?subject=${encodeURIComponent("Votre demande de prestation")}`}
              className="btn-primary mt-6"
            >
              <Icon path={icons.mail} className="size-4" /> Répondre par email
            </a>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card p-6">
            <h2 className="mb-4 text-lg">Suivi</h2>
            <RequestUpdateForm id={request.id} status={request.status} adminNotes={request.adminNotes ?? ""} />
          </section>
          <form action={deleteRequest} className="text-right">
            <input type="hidden" name="id" value={request.id} />
            <ConfirmSubmit message="Supprimer définitivement cette demande ?" className="inline-flex items-center gap-2 text-sm text-red-600 hover:underline">
              <Icon path={icons.trash} className="size-4" /> Supprimer la demande
            </ConfirmSubmit>
          </form>
        </aside>
      </div>
    </>
  );
}
