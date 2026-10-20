import Link from "next/link";
import { Icon, icons } from "@/components/ui/icon";
import { site, whatsappLink } from "@/lib/site";

const CHANNELS = [
  {
    label: "WhatsApp",
    value: "Réponse rapide",
    href: whatsappLink(`Bonjour ${site.name}, je vous contacte depuis votre site.`),
    icon: icons.whatsapp,
    external: true,
  },
  {
    label: "Email",
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
    icon: icons.mail,
    external: false,
  },
  {
    label: "LinkedIn",
    value: "Voir mon profil",
    href: site.contact.linkedin,
    icon: icons.linkedin,
    external: true,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-plum-700 px-6 py-14 text-white sm:px-12">
          <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-coral-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-plum-400/30 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-5">
              <p className="eyebrow text-coral-300!">Contact</p>
              <h2 className="text-3xl text-white sm:text-4xl">Parlons de votre projet</h2>
              <p className="max-w-md leading-relaxed text-plum-100">
                Une question, un besoin ponctuel ou un accompagnement sur le long terme ? Écrivez-moi par le canal
                de votre choix, ou remplissez le formulaire de demande de prestation.
              </p>
              <Link href="/collaboration" className="btn-primary">
                Demander une prestation <Icon path={icons.arrowRight} className="size-4" />
              </Link>
            </div>

            <ul className="grid gap-4">
              {CHANNELS.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur transition hover:bg-white/20"
                  >
                    <span className="flex size-12 items-center justify-center rounded-xl bg-white text-plum-700">
                      <Icon path={c.icon} className="size-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{c.label}</span>
                      <span className="block truncate text-sm text-plum-200">{c.value}</span>
                    </span>
                    <Icon path={icons.arrowRight} className="size-5 text-coral-300 transition group-hover:translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

