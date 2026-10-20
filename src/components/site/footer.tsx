import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { Icon, icons } from "@/components/ui/icon";
import { SERVICES } from "@/lib/services";
import { site, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-plum-900 text-plum-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed text-plum-200">
            Je vous libère des tâches chronophages pour que vous puissiez vous concentrer sur l&apos;essentiel :
            développer votre activité.
          </p>
        </div>

        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold tracking-wider text-white uppercase">Services</h2>
          <ul className="space-y-2 text-sm text-plum-200">
            {SERVICES.map((s) => (
              <li key={s.value}>
                <Link href={`/projets?service=${s.value}`} className="hover:text-coral-300">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold tracking-wider text-white uppercase">Contact</h2>
          <ul className="space-y-3 text-sm text-plum-200">
            <li>
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2 hover:text-coral-300">
                <Icon path={icons.mail} /> {site.contact.email}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-coral-300">
                <Icon path={icons.whatsapp} /> WhatsApp
              </a>
            </li>
            <li>
              <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-coral-300">
                <Icon path={icons.linkedin} /> LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-plum-300 sm:flex-row">
          <p>© {site.name}. Tous droits réservés.</p>
          <Link href="/admin" className="hover:text-coral-300">
            Espace admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
