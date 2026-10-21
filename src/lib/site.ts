/**
 * URL publique du site : NEXT_PUBLIC_SITE_URL, sinon le domaine fourni par Vercel
 * (domaine de prod, puis URL du déploiement en preview), sinon localhost.
 */
function siteUrl() {
  const vercelHost =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL;
  // `||` et non `??` : une variable définie mais vide sur Vercel ne doit pas donner une URL vide
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");
  return url.replace(/\/+$/, "");
}

/** Informations publiques du site — modifiables via les variables d'environnement */
export const site = {
  name: "Miora Dinasoa",
  role: "Assistante virtuelle polyvalente",
  url: siteUrl(),
  description:
    "Miora Dinasoa, assistante virtuelle polyvalente : community management, gestion administrative, SEO, design web, relation client, montage vidéo et développement web.",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@exemple.com",
    // Numéro au format international sans « + » ni espaces, ex : 261340000000
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "261340000000",
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/miora-dinasoa",
  },
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
