"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { RequestStatus } from "@/generated/prisma/enums";
import { requireAdmin } from "@/lib/dal";
import { notifyStatusChange } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import type { FormState } from "@/lib/validation";

const updateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(RequestStatus),
  adminNotes: z.string().max(10000).optional(),
  notifyClient: z.boolean(),
  clientMessage: z.string().max(5000).optional(),
});

export async function updateRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    adminNotes: formData.get("adminNotes") ?? undefined,
    notifyClient: formData.get("notifyClient") === "on",
    clientMessage: formData.get("clientMessage") ?? undefined,
  });
  if (!parsed.success) return { ok: false, message: "Données invalides." };

  const { id, status, adminNotes, notifyClient, clientMessage } = parsed.data;
  const previous = await prisma.collaborationRequest.findUnique({ where: { id }, select: { status: true } });
  if (!previous) return { ok: false, message: "Demande introuvable." };

  const request = await prisma.collaborationRequest.update({
    where: { id },
    data: { status, adminNotes: adminNotes?.trim() || null },
  });

  let message = "Demande mise à jour.";
  if (notifyClient && previous.status !== status) {
    const sent = await notifyStatusChange(request, clientMessage?.trim() || undefined);
    message += sent ? " Le client a été notifié par email." : " ⚠️ L'email au client n'a pas pu être envoyé.";
  }

  refresh();
  return { ok: true, message };
}

export async function deleteRequest(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.collaborationRequest.delete({ where: { id } }).catch(() => null);
  redirect("/admin/demandes");
}
