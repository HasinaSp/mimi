import type { Metadata } from "next";
import { Suspense } from "react";
import { Icon, icons } from "@/components/ui/icon";
import { isServiceType } from "@/lib/services";
import { site, whatsappLink } from "@/lib/site";
import { CollaborationForm } from "./collaboration-form";

export const metadata: Metadata = {
  title: "Demande de prestation",
  description: `Décrivez votre besoin et ${site.name} vous recontacte sous 24 à 48 h.`,
};

const PROMISES = [
  "Réponse sous 24 à 48 h ouvrées",
  "Devis gratuit et sans engagement",
  "Échange en visio ou WhatsApp",
];

export default function CollaborationPage({ searchParams }: PageProps<"/collaboration">) {
  return (
    <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_1.6fr]">
      <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit">
        <p className="eyebrow">Collaboration</p>
        <h1 className="text-4xl sm:text-5xl">Travaillons ensemble</h1>
        <p className="text-lg leading-relaxed text-muted">
          Parlez-moi de votre projet : je vous propose une solution adaptée à vos besoins et à votre budget.
        </p>
        <ul className="space-y-3">
          {PROMISES.map((p) => (
            <li key={p} className="flex items-center gap-3 text-ink/80">
              <span className="flex size-7 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                <Icon path={icons.check} className="size-4" />
              </span>
              {p}
            </li>
          ))}
        </ul>
        <div className="rounded-card border border-sand-300 bg-sand-50 p-5 text-sm text-muted">
          Vous préférez échanger directement ?{" "}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-leaf-700 hover:underline">
            Écrivez-moi sur WhatsApp
          </a>{" "}
          ou par{" "}
          <a href={`mailto:${site.contact.email}`} className="font-semibold text-leaf-700 hover:underline">
            email
          </a>
          .
        </div>
      </aside>

      <Suspense fallback={<div className="card h-[40rem] animate-pulse" />}>
        <FormWithDefaults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function FormWithDefaults({ searchParams }: { searchParams: PageProps<"/collaboration">["searchParams"] }) {
  const { service } = await searchParams;
  return <CollaborationForm defaultService={isServiceType(service) ? service : undefined} />;
}
