"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, FieldError } from "@/components/ui/field";
import { Icon, icons } from "@/components/ui/icon";
import { SERVICES } from "@/lib/services";
import type { FormState } from "@/lib/validation";
import { submitCollaborationRequest } from "./actions";

const BUDGETS = ["Moins de 200 €", "200 € – 500 €", "500 € – 1 000 €", "1 000 € – 3 000 €", "Plus de 3 000 €", "À définir ensemble"];
const DEADLINES = ["Urgent (moins d'une semaine)", "Sous 2 à 4 semaines", "Dans 1 à 3 mois", "Mission récurrente", "Flexible"];

export function CollaborationForm({ defaultService }: { defaultService?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitCollaborationRequest, {});

  if (state.ok) {
    return (
      <div className="card flex flex-col items-center gap-4 p-10 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-sage-100 text-sage-700">
          <Icon path={icons.check} className="size-8" />
        </span>
        <h2 className="text-2xl">Merci, votre demande est envoyée !</h2>
        <p className="max-w-md text-muted">
          Vous allez recevoir un email de confirmation. Je reviens vers vous sous 24 à 48 h ouvrées.
        </p>
        <Link href="/projets" className="btn-ghost mt-2">
          Découvrir mes projets
        </Link>
      </div>
    );
  }

  const v = (state.values ?? {}) as Record<string, string | string[] | undefined>;
  const selected = new Set((v.services as string[] | undefined) ?? (defaultService ? [defaultService] : []));
  const e = state.errors ?? {};

  return (
    <form action={action} className="card space-y-8 p-6 sm:p-10" noValidate>
      {state.message && !state.ok && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      {/* Honeypot anti-spam */}
      <div className="hidden" aria-hidden="true">
        <label>
          Site web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset className="space-y-5">
        <legend className="mb-4 font-display text-xl text-plum-800">Vos coordonnées</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nom complet *" name="fullName" errors={e.fullName}>
            <input id="fullName" name="fullName" className="input" autoComplete="name" defaultValue={v.fullName as string} required />
          </Field>
          <Field label="Email *" name="email" errors={e.email}>
            <input id="email" name="email" type="email" className="input" autoComplete="email" defaultValue={v.email as string} required />
          </Field>
          <Field label="Téléphone / WhatsApp" name="phone" errors={e.phone}>
            <input id="phone" name="phone" type="tel" className="input" autoComplete="tel" defaultValue={v.phone as string} />
          </Field>
          <Field label="Entreprise" name="company" errors={e.company}>
            <input id="company" name="company" className="input" autoComplete="organization" defaultValue={v.company as string} />
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1 font-display text-xl text-plum-800">Services souhaités *</legend>
        <p className="mb-4 text-sm text-muted">Sélectionnez un ou plusieurs services.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <label
              key={s.value}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-sand-400 bg-white px-4 py-3 text-sm transition has-checked:border-plum-500 has-checked:bg-plum-50"
            >
              <input
                type="checkbox"
                name="services"
                value={s.value}
                defaultChecked={selected.has(s.value)}
                className="size-4 accent-plum-600"
              />
              <Icon path={s.icon} className="size-4 text-coral-600" />
              <span className="font-medium text-plum-800">{s.label}</span>
            </label>
          ))}
        </div>
        <FieldError errors={e.services} />
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-4 font-display text-xl text-plum-800">Votre projet</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Budget estimé" name="budget" errors={e.budget}>
            <select id="budget" name="budget" className="input" defaultValue={(v.budget as string) ?? ""}>
              <option value="">Sélectionner…</option>
              {BUDGETS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </Field>
          <Field label="Délai souhaité" name="deadline" errors={e.deadline}>
            <select id="deadline" name="deadline" className="input" defaultValue={(v.deadline as string) ?? ""}>
              <option value="">Sélectionner…</option>
              {DEADLINES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Décrivez votre besoin *" name="message" errors={e.message}>
          <textarea
            id="message"
            name="message"
            rows={6}
            className="input resize-y"
            placeholder="Contexte, objectifs, outils utilisés, volume de travail…"
            defaultValue={v.message as string}
            required
          />
        </Field>
      </fieldset>

      <div className="space-y-5 border-t border-sand-300 pt-6">
        <label className="flex items-start gap-3 text-sm text-ink/80">
          <input type="checkbox" name="consent" defaultChecked={v.consent === "on"} className="mt-0.5 size-4 accent-plum-600" />
          <span>J&apos;accepte que mes informations soient utilisées pour être recontacté(e) au sujet de ma demande. *</span>
        </label>
        <FieldError errors={e.consent} />
        <button type="submit" className="btn-primary w-full py-3 text-base sm:w-auto sm:px-8" disabled={pending}>
          {pending ? "Envoi en cours…" : "Envoyer ma demande"}
          {!pending && <Icon path={icons.arrowRight} className="size-4" />}
        </button>
      </div>
    </form>
  );
}
