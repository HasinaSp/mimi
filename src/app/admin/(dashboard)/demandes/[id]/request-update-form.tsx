"use client";

import { useActionState, useState } from "react";
import { updateRequest } from "@/lib/actions/requests";
import { REQUEST_STATUSES } from "@/lib/request-status";
import type { FormState } from "@/lib/validation";

export function RequestUpdateForm({ id, status, adminNotes }: { id: string; status: string; adminNotes: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateRequest, {});
  const [notify, setNotify] = useState(false);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={id} />
      {state.message && (
        <p role="status" className={state.ok ? "rounded-xl bg-sage-100 px-4 py-3 text-sm text-sage-700" : "rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"}>
          {state.message}
        </p>
      )}
      <div>
        <label htmlFor="status" className="label">
          Statut
        </label>
        <select id="status" name="status" defaultValue={status} className="input">
          {REQUEST_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="adminNotes" className="label">
          Notes internes
        </label>
        <textarea id="adminNotes" name="adminNotes" rows={5} defaultValue={adminNotes} className="input" placeholder="Visibles uniquement par vous" />
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="notifyClient" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="size-4 accent-plum-600" />
        Notifier le client par email du changement de statut
      </label>
      {notify && (
        <div>
          <label htmlFor="clientMessage" className="label">
            Message personnalisé (optionnel)
          </label>
          <textarea id="clientMessage" name="clientMessage" rows={4} className="input" placeholder="Ajouté à l'email envoyé au client" />
        </div>
      )}
      <button type="submit" className="btn-secondary w-full" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
