import "server-only";
import type { CollaborationRequest } from "@/generated/prisma/client";
import { adminEmail, emailLayout, sendMail } from "@/lib/mail";
import { statusMeta } from "@/lib/request-status";
import { serviceLabel } from "@/lib/services";
import { site } from "@/lib/site";
import { escapeHtml } from "@/lib/utils";

const p = (text: string) => `<p style="margin:0 0 14px;line-height:1.6;">${text}</p>`;

/** Nouvelle demande : notification à Miora + accusé de réception au client */
export async function notifyNewRequest(request: CollaborationRequest) {
  const services = request.services.map(serviceLabel).join(", ");
  const rows: [string, string | null | undefined][] = [
    ["Nom", request.fullName],
    ["Email", request.email],
    ["Téléphone", request.phone],
    ["Entreprise", request.company],
    ["Services", services],
    ["Budget", request.budget],
    ["Délai", request.deadline],
  ];
  const table = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6B6B6B;font-size:13px;white-space:nowrap;">${k}</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(v!)}</td></tr>`,
    )
    .join("");

  const adminUrl = `${site.url}/admin/demandes/${request.id}`;

  await Promise.all([
    sendMail({
      to: adminEmail(),
      replyTo: request.email,
      subject: `Nouvelle demande de prestation — ${request.fullName}`,
      text: `Nouvelle demande de ${request.fullName} (${request.email})\nServices : ${services}\n\n${request.message}\n\n${adminUrl}`,
      html: emailLayout(
        "Nouvelle demande de prestation",
        `<table role="presentation" style="margin-bottom:16px;">${table}</table>
         <div style="background:#F5F4F0;border-radius:12px;padding:16px;font-size:14px;line-height:1.6;white-space:pre-line;">${escapeHtml(request.message)}</div>
         <p style="margin:24px 0 0;"><a href="${adminUrl}" style="display:inline-block;background:#F19598;color:#171717;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold;font-size:14px;">Ouvrir dans le back-office</a></p>`,
      ),
    }),
    sendMail({
      to: request.email,
      replyTo: adminEmail(),
      subject: `J'ai bien reçu votre demande — ${site.name}`,
      text: `Bonjour ${request.fullName},\n\nMerci pour votre message ! J'ai bien reçu votre demande concernant : ${services}. Je reviens vers vous sous 24 à 48 h ouvrées.\n\nÀ très vite,\n${site.name}`,
      html: emailLayout(
        "Merci pour votre demande !",
        p(`Bonjour ${escapeHtml(request.fullName)},`) +
          p(`J'ai bien reçu votre demande concernant : <strong>${escapeHtml(services)}</strong>.`) +
          p("Je l'étudie avec attention et je reviens vers vous sous <strong>24 à 48 h ouvrées</strong>.") +
          p(`À très vite,<br/>${escapeHtml(site.name)}`),
      ),
    }),
  ]);
}

/** Informe le client d'un changement de statut de sa demande */
export async function notifyStatusChange(request: CollaborationRequest, customMessage?: string) {
  const status = statusMeta(request.status).label.toLowerCase();
  const intro: Record<string, string> = {
    IN_PROGRESS: "Votre demande est en cours d'étude.",
    ACCEPTED: "Bonne nouvelle : votre demande a été acceptée ! Je vous recontacte très vite pour lancer la mission.",
    DECLINED: "Après étude, je ne suis malheureusement pas en mesure de donner suite à votre demande pour le moment.",
    COMPLETED: "La mission liée à votre demande est terminée. Merci pour votre confiance !",
  };
  const body = intro[request.status] ?? `Le statut de votre demande est désormais : ${status}.`;

  return sendMail({
    to: request.email,
    replyTo: adminEmail(),
    subject: `Votre demande : ${status} — ${site.name}`,
    text: `Bonjour ${request.fullName},\n\n${body}${customMessage ? `\n\n${customMessage}` : ""}\n\n${site.name}`,
    html: emailLayout(
      "Mise à jour de votre demande",
      p(`Bonjour ${escapeHtml(request.fullName)},`) +
        p(escapeHtml(body)) +
        (customMessage ? p(escapeHtml(customMessage).replace(/\n/g, "<br/>")) : "") +
        p(`Bien à vous,<br/>${escapeHtml(site.name)}`),
    ),
  });
}
