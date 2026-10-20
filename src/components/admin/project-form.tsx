"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Field } from "@/components/ui/field";
import type { Project } from "@/generated/prisma/client";
import { saveProject } from "@/lib/actions/projects";
import { SERVICES } from "@/lib/services";
import { slugify } from "@/lib/utils";
import type { FormState } from "@/lib/validation";

function toInputDate(date: Date | string | null | undefined) {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
}

export function ProjectForm({ project }: { project?: Project }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProject, {});
  const e = state.errors ?? {};
  const v = (state.values ?? {}) as Record<string, string | boolean | undefined>;
  const initial = (key: keyof Project, fallback = "") =>
    (v[key] as string | undefined) ?? ((project?.[key] as string | null | undefined) ?? fallback);

  const [title, setTitle] = useState(initial("title"));
  const [cover, setCover] = useState(initial("coverImage"));

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1fr_340px]">
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="space-y-6">
        {state.message && !state.ok && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </p>
        )}

        <section className="card space-y-5 p-6">
          <Field label="Titre *" name="title" errors={e.title}>
            <input id="title" name="title" className="input" value={title} onChange={(ev) => setTitle(ev.target.value)} required />
          </Field>
          <Field label="Slug (URL)" name="slug" errors={e.slug} hint={`/projets/${initial("slug") || slugify(title) || "…"}`}>
            <input id="slug" name="slug" className="input" defaultValue={initial("slug")} placeholder="Généré automatiquement depuis le titre" />
          </Field>
          <Field label="Résumé *" name="summary" errors={e.summary} hint="Affiché sur les cartes (300 caractères max).">
            <textarea id="summary" name="summary" rows={2} maxLength={300} className="input" defaultValue={initial("summary")} required />
          </Field>
          <Field label="Description *" name="description" errors={e.description} hint="Séparez les paragraphes par une ligne vide.">
            <textarea id="description" name="description" rows={10} className="input" defaultValue={initial("description")} required />
          </Field>
        </section>

        <section className="card space-y-5 p-6">
          <h2 className="text-lg">Médias</h2>
          <Field label="Image de couverture (URL)" name="coverImage" errors={e.coverImage} hint="Lien https vers une image (Cloudinary, Imgur, Google Drive public…).">
            <input id="coverImage" name="coverImage" type="url" className="input" value={cover} onChange={(ev) => setCover(ev.target.value)} placeholder="https://…" />
          </Field>
          {/^https:\/\//.test(cover) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="Aperçu de la couverture" className="aspect-[16/9] w-full rounded-xl border border-sand-300 object-cover" />
          )}
          <Field label="Galerie (une URL par ligne)" name="gallery" errors={e.gallery}>
            <textarea
              id="gallery"
              name="gallery"
              rows={4}
              className="input font-mono text-xs"
              defaultValue={(v.gallery as string | undefined) ?? project?.gallery.join("\n") ?? ""}
            />
          </Field>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="card space-y-5 p-6">
          <h2 className="text-lg">Publication</h2>
          <label className="flex items-center justify-between gap-3 text-sm font-medium text-plum-800">
            Publié sur le site
            <input type="checkbox" name="published" defaultChecked={(v.published as boolean | undefined) ?? project?.published ?? true} className="size-5 accent-plum-600" />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm font-medium text-plum-800">
            Mis à la une
            <input type="checkbox" name="featured" defaultChecked={(v.featured as boolean | undefined) ?? project?.featured ?? false} className="size-5 accent-coral-500" />
          </label>
          <button type="submit" className="btn-primary w-full" disabled={pending}>
            {pending ? "Enregistrement…" : project ? "Enregistrer les modifications" : "Créer le projet"}
          </button>
          <Link href="/admin/projets" className="btn-ghost w-full">
            Annuler
          </Link>
        </section>

        <section className="card space-y-5 p-6">
          <h2 className="text-lg">Informations</h2>
          <Field label="Service *" name="service" errors={e.service}>
            <select id="service" name="service" className="input" defaultValue={initial("service")} required>
              <option value="">Sélectionner…</option>
              {SERVICES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Client" name="client" errors={e.client}>
            <input id="client" name="client" className="input" defaultValue={initial("client")} />
          </Field>
          <Field label="Date de réalisation" name="completedAt" errors={e.completedAt}>
            <input
              id="completedAt"
              name="completedAt"
              type="date"
              className="input"
              defaultValue={(v.completedAt as string | undefined) ?? toInputDate(project?.completedAt)}
            />
          </Field>
          <Field label="Lien vers le résultat" name="link" errors={e.link}>
            <input id="link" name="link" type="url" className="input" defaultValue={initial("link")} placeholder="https://…" />
          </Field>
          <Field label="Tags" name="tags" errors={e.tags} hint="Séparés par des virgules.">
            <input id="tags" name="tags" className="input" defaultValue={(v.tags as string | undefined) ?? project?.tags.join(", ") ?? ""} />
          </Field>
        </section>
      </aside>
    </form>
  );
}
