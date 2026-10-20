import { z } from "zod";
import { ServiceType } from "@/generated/prisma/enums";

const serviceEnum = z.enum(ServiceType);

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || undefined)
    .optional();

export const collaborationSchema = z.object({
  fullName: z.string().trim().min(2, "Merci d'indiquer votre nom.").max(120),
  email: z.email("Adresse email invalide.").trim().toLowerCase(),
  phone: optionalText(40),
  company: optionalText(120),
  services: z.array(serviceEnum).min(1, "Choisissez au moins un service."),
  budget: optionalText(60),
  deadline: optionalText(60),
  message: z
    .string()
    .trim()
    .min(20, "Décrivez votre besoin en quelques phrases (20 caractères minimum).")
    .max(5000),
  consent: z.literal("on", { error: "Merci d'accepter d'être recontacté(e)." }),
});

export type CollaborationInput = z.infer<typeof collaborationSchema>;

const optionalUrl = z
  .string()
  .trim()
  .transform((v) => v || undefined)
  .pipe(z.url("URL invalide (https://…)").optional())
  .optional();

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Titre requis.").max(150),
  slug: z
    .string()
    .trim()
    .max(80)
    .regex(/^[a-z0-9-]*$/, "Uniquement lettres minuscules, chiffres et tirets.")
    .optional(),
  summary: z.string().trim().min(10, "Résumé trop court.").max(300),
  description: z.string().trim().min(20, "Description trop courte.").max(20000),
  service: serviceEnum,
  client: optionalText(120),
  coverImage: optionalUrl,
  gallery: z.array(z.url("Une des URL de la galerie est invalide.")).max(20),
  tags: z.array(z.string().max(40)).max(15),
  link: optionalUrl,
  completedAt: z
    .string()
    .trim()
    .transform((v) => (v ? new Date(v) : undefined))
    .optional(),
  published: z.boolean(),
  featured: z.boolean(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
  values?: Record<string, unknown>;
};
