import "server-only";
import nodemailer from "nodemailer";
import { site } from "@/lib/site";
import { escapeHtml } from "@/lib/utils";

/**
 * Envoi d'emails transactionnels.
 * Fournisseur choisi via EMAIL_PROVIDER :
 *  - "smtp"   : Gmail (mot de passe d'application) ou Brevo SMTP via nodemailer
 *  - "resend" : API Resend (RESEND_API_KEY)
 *  - "brevo"  : API Brevo (BREVO_API_KEY)
 *  - absent   : les emails sont simplement affichés dans la console (dev)
 */

export type MailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

type Provider = "smtp" | "resend" | "brevo" | "console";

function provider(): Provider {
  const p = process.env.EMAIL_PROVIDER?.toLowerCase();
  return p === "smtp" || p === "resend" || p === "brevo" ? p : "console";
}

function from() {
  return process.env.MAIL_FROM ?? `${site.name} <${process.env.SMTP_USER ?? "onboarding@resend.dev"}>`;
}

/** Sépare « Nom <email> » en { name, email } (format attendu par Brevo) */
function parseAddress(address: string) {
  const match = address.match(/^\s*(.*?)\s*<(.+)>\s*$/);
  return match ? { name: match[1] || undefined, email: match[2] } : { email: address.trim() };
}

let transporter: nodemailer.Transporter | undefined;

async function sendSmtp(mail: MailInput) {
  transporter ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: Number(process.env.SMTP_PORT ?? 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
  await transporter.sendMail({ from: from(), ...mail });
}

async function sendResend(mail: MailInput) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: from(),
      to: [mail.to],
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      reply_to: mail.replyTo,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

async function sendBrevo(mail: MailInput) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY ?? "",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: parseAddress(from()),
      to: [{ email: mail.to }],
      subject: mail.subject,
      htmlContent: mail.html,
      textContent: mail.text,
      replyTo: mail.replyTo ? { email: mail.replyTo } : undefined,
    }),
  });
  if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
}

/** Envoie un email. Ne lève jamais d'erreur : renvoie false en cas d'échec. */
export async function sendMail(mail: MailInput): Promise<boolean> {
  try {
    switch (provider()) {
      case "smtp":
        await sendSmtp(mail);
        break;
      case "resend":
        await sendResend(mail);
        break;
      case "brevo":
        await sendBrevo(mail);
        break;
      default:
        console.info(`[mail:console] À: ${mail.to} | Sujet: ${mail.subject}\n${mail.text}`);
    }
    return true;
  } catch (error) {
    console.error("[mail] Échec de l'envoi", error);
    return false;
  }
}

export function adminEmail() {
  return process.env.ADMIN_NOTIFICATION_EMAIL ?? site.contact.email;
}

/** Gabarit HTML aux couleurs de la charte graphique */
export function emailLayout(title: string, bodyHtml: string) {
  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#FAF6F1;font-family:Helvetica,Arial,sans-serif;color:#231B26;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #EDE3D8;">
          <tr><td style="background:#4A2358;padding:24px 32px;">
            <span style="font-family:Georgia,serif;font-size:22px;color:#ffffff;">${escapeHtml(site.name)}</span>
            <span style="display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#F2B8A6;margin-top:4px;">${escapeHtml(site.role)}</span>
          </td></tr>
          <tr><td style="padding:32px;">
            <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px;color:#4A2358;">${escapeHtml(title)}</h1>
            ${bodyHtml}
          </td></tr>
          <tr><td style="padding:16px 32px;background:#F4ECE3;font-size:12px;color:#6E6273;">
            ${escapeHtml(site.name)} · <a href="${site.url}" style="color:#C9634B;">${site.url.replace(/^https?:\/\//, "")}</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
