import Link from "next/link";
import { Suspense } from "react";
import { ContactSection } from "@/components/site/contact-section";
import { ProjectCard, ProjectGridSkeleton } from "@/components/site/project-card";
import { SectionHeading } from "@/components/site/section-heading";
import { LogoMark } from "@/components/site/logo";
import { Icon, icons } from "@/components/ui/icon";
import { getFeaturedProjects } from "@/lib/queries";
import { SERVICES } from "@/lib/services";
import { site } from "@/lib/site";

const STEPS = [
  { title: "Échange", text: "Un premier appel pour comprendre vos besoins, vos outils et vos priorités." },
  { title: "Proposition", text: "Je vous envoie une proposition claire : missions, délais et tarif." },
  { title: "Réalisation", text: "Je prends le relais avec des points d'étape réguliers et transparents." },
  { title: "Suivi", text: "On ajuste ensemble et je reste disponible pour la suite de vos projets." },
];

const STRENGTHS = ["Réactive et organisée", "100 % à distance", "Discrétion garantie", "Réponse sous 24 h"];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-[-10%] size-[36rem] rounded-full bg-coral-200/40 blur-3xl" />
        <div className="pointer-events-none absolute top-40 left-[-15%] size-[30rem] rounded-full bg-plum-200/40 blur-3xl" />

        <div className="container-page relative grid items-center gap-14 py-16 sm:py-24 lg:grid-cols-[1.15fr_1fr]">
          <div className="space-y-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-plum-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-plum-700">
              <span className="size-2 rounded-full bg-sage-500" /> Disponible pour de nouveaux projets
            </p>
            <h1 className="text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
              Déléguez l&apos;essentiel,{" "}
              <span className="relative whitespace-nowrap text-coral-600">
                gagnez du temps
                <svg viewBox="0 0 220 12" className="absolute -bottom-2 left-0 w-full" aria-hidden="true">
                  <path d="M2 9c50-6 120-8 216-3" stroke="#f2b8a6" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </span>{" "}
              pour ce qui compte.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              Je suis <strong className="text-plum-700">{site.name}</strong>, {site.role.toLowerCase()}. Réseaux
              sociaux, administratif, site web ou relation client : je vous accompagne avec rigueur et créativité.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/collaboration" className="btn-primary px-6 py-3 text-base">
                Demander une prestation <Icon path={icons.arrowRight} className="size-4" />
              </Link>
              <Link href="/projets" className="btn-ghost px-6 py-3 text-base">
                Voir mes projets
              </Link>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-ink/70">
              {STRENGTHS.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <Icon path={icons.check} className="size-4 text-sage-500" /> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Composition visuelle */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="card relative rotate-2 p-7">
              <div className="flex items-center gap-4">
                <LogoMark className="size-14" />
                <div>
                  <p className="font-display text-xl text-plum-800">{site.name}</p>
                  <p className="text-sm text-muted">{site.role}</p>
                </div>
              </div>
              <ul className="mt-6 grid grid-cols-2 gap-2.5">
                {SERVICES.map((s) => (
                  <li key={s.value} className="flex items-center gap-2 rounded-xl bg-sand-100 px-3 py-2.5 text-xs font-medium text-plum-800">
                    <Icon path={s.icon} className="size-4 text-coral-600" />
                    {s.short}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card absolute -bottom-8 -left-6 hidden -rotate-3 items-center gap-3 px-5 py-4 sm:flex">
              <span className="flex size-10 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                <Icon path={icons.clock} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-plum-800">+ de temps pour vous</span>
                <span className="block text-xs text-muted">je m&apos;occupe du reste</span>
              </span>
            </div>
            <div className="absolute -top-5 -right-3 flex size-20 rotate-12 flex-col items-center justify-center rounded-full bg-coral-500 text-center text-white shadow-soft">
              <span className="font-display text-2xl leading-none">7</span>
              <span className="text-[10px] font-semibold tracking-wide uppercase">expertises</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-24 bg-white/60 py-20">
        <div className="container-page space-y-12">
          <SectionHeading
            eyebrow="Services"
            title="Une seule interlocutrice, de nombreuses compétences"
            description="Je m'adapte à vos besoins, ponctuels ou réguliers, pour vous faire gagner du temps et de la sérénité."
            align="center"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <article
                key={s.value}
                className={`card group p-7 transition hover:-translate-y-1 hover:border-plum-200 ${i === SERVICES.length - 1 ? "lg:col-start-2" : ""}`}
              >
                <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-plum-50 text-plum-600 transition group-hover:bg-coral-500 group-hover:text-white">
                  <Icon path={s.icon} className="size-6" />
                </span>
                <h3 className="mb-2 text-xl">{s.label}</h3>
                <p className="text-sm leading-relaxed text-muted">{s.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Méthode */}
      <section className="py-20">
        <div className="container-page space-y-12">
          <SectionHeading eyebrow="Méthode" title="Comment je travaille" />
          <ol className="grid gap-5 md:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative rounded-card border border-sand-300 bg-sand-50 p-6">
                <span className="font-display text-4xl text-coral-400">0{i + 1}</span>
                <h3 className="mt-3 mb-2 text-lg">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Projets récents */}
      <section className="bg-white/60 py-20">
        <div className="container-page space-y-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Portfolio" title="Projets récents" description="Un aperçu des missions que j'ai menées pour mes clients." />
            <Link href="/projets" className="btn-ghost">
              Tous les projets <Icon path={icons.arrowRight} className="size-4" />
            </Link>
          </div>
          <Suspense fallback={<ProjectGridSkeleton />}>
            <FeaturedProjects />
          </Suspense>
        </div>
      </section>

      <ContactSection />
    </>
  );
}

async function FeaturedProjects() {
  const projects = await getFeaturedProjects(3);
  if (projects.length === 0) {
    return <p className="rounded-card border border-dashed border-sand-400 p-10 text-center text-muted">Les premiers projets arrivent bientôt.</p>;
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
