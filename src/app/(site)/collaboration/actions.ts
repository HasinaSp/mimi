"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyNewRequest } from "@/lib/notifications";
import { collaborationSchema, type FormState } from "@/lib/validation";

export async function submitCollaborationRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  // Champ piège anti-spam : invisible pour les humains
  if (formData.get("website")) return { ok: true };

  const values = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? "",
    company: formData.get("company") ?? "",
    services: formData.getAll("services"),
    budget: formData.get("budget") ?? "",
    deadline: formData.get("deadline") ?? "",
    message: formData.get("message"),
    consent: formData.get("consent") ?? undefined,
  };

  const parsed = collaborationSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Merci de corriger les champs indiqués.",
      errors: z.flattenError(parsed.error).fieldErrors,
      values,
    };
  }

  const { fullName, email, phone, company, services, budget, deadline, message } = parsed.data;
  const data = { fullName, email, phone, company, services, budget, deadline, message };

  try {
    const request = await prisma.collaborationRequest.create({ data });
    await notifyNewRequest(request);
  } catch (error) {
    console.error("[collaboration] échec de l'enregistrement", error);
    return {
      ok: false,
      message: "Une erreur est survenue. Réessayez ou contactez-moi directement par email.",
      values,
    };
  }

  return { ok: true, message: "Merci ! Votre demande a bien été envoyée." };
}
