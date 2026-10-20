/** Informations publiques du site — modifiables via les variables d'environnement */
export const site = {
  name: "Miora Dinasoa",
  role: "Assistante virtuelle polyvalente",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Miora Dinasoa, assistante virtuelle polyvalente : community management, gestion administrative, SEO, design web, relation client, montage vidéo et développement web.",
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@exemple.com",
    // Numéro au format international sans « + » ni espaces, ex : 261340000000
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "261340000000",
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/in/miora-dinasoa",
  },
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
