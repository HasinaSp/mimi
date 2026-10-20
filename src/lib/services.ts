import type { ServiceType } from "@/generated/prisma/enums";

export type Service = {
  value: ServiceType;
  label: string;
  short: string;
  description: string;
  icon: string; // chemin SVG (viewBox 0 0 24 24, trait)
};

export const SERVICES: Service[] = [
  {
    value: "COMMUNITY_MANAGEMENT",
    label: "Community management",
    short: "Réseaux sociaux",
    description:
      "Stratégie éditoriale, création de contenus et animation de vos communautés sur Facebook, Instagram, LinkedIn et TikTok.",
    icon: "M7 8h10M7 12h6m-9 8 3.5-3H19a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h0",
  },
  {
    value: "GESTION_ADMINISTRATIVE",
    label: "Gestion administrative",
    short: "Administratif",
    description:
      "Gestion d'agenda, courriers, devis et factures, classement et suivi de dossiers : je m'occupe de la paperasse à votre place.",
    icon: "M9 12h6m-6 4h6M8 3h8l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm7 0v4h4",
  },
  {
    value: "SEO",
    label: "SEO",
    short: "Référencement",
    description:
      "Audit, optimisation on-page, recherche de mots-clés et rédaction pour gagner en visibilité sur Google.",
    icon: "m21 21-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm-3-6 2 2 4-4",
  },
  {
    value: "DESIGN_WEB",
    label: "Design web",
    short: "UI / UX",
    description:
      "Maquettes modernes et identités visuelles cohérentes, pensées pour vos utilisateurs et votre image de marque.",
    icon: "M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm4 15h8m-4-4v4M8 8h3v4H8z",
  },
  {
    value: "RELATION_CLIENT",
    label: "Relation client",
    short: "Service client",
    description:
      "Réponse aux emails, chat et appels, suivi des commandes et fidélisation : vos clients sont entre de bonnes mains.",
    icon: "M3 12a9 9 0 1 1 18 0v4a2 2 0 0 1-2 2h-1v-6h3M3 12v4a2 2 0 0 0 2 2h1v-6H3m15 6a4 4 0 0 1-4 3h-2",
  },
  {
    value: "MONTAGE_VIDEO",
    label: "Montage vidéo",
    short: "Vidéo",
    description:
      "Montage de reels, vidéos YouTube et contenus promotionnels dynamiques, avec sous-titres et habillage graphique.",
    icon: "M15 10.5 20 7v10l-5-3.5M4 6h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z",
  },
  {
    value: "DEVELOPPEMENT_WEB",
    label: "Développement web",
    short: "Sites web",
    description:
      "Création de sites vitrines et landing pages rapides, responsives et faciles à mettre à jour.",
    icon: "m8 9-3 3 3 3m8-6 3 3-3 3m-5 3 2-12",
  },
];

const byValue = new Map(SERVICES.map((s) => [s.value, s]));

export function getService(value: string) {
  return byValue.get(value as ServiceType);
}

export function serviceLabel(value: string) {
  return getService(value)?.label ?? value;
}

export function isServiceType(value: unknown): value is ServiceType {
  return typeof value === "string" && byValue.has(value as ServiceType);
}
