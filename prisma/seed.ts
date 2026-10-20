import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL }),
});

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Définissez ADMIN_EMAIL et ADMIN_PASSWORD dans .env");
  if (password.length < 10) throw new Error("ADMIN_PASSWORD doit contenir au moins 10 caractères");

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash: await bcrypt.hash(password, 12) },
    create: { email, name: process.env.ADMIN_NAME ?? "Miora Dinasoa", passwordHash: await bcrypt.hash(password, 12) },
  });
  console.log(`✔ Compte admin prêt : ${email}`);

  // Projets d'exemple (uniquement si la base est vide) — à remplacer depuis le back-office
  if ((await prisma.project.count()) === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: "Stratégie Instagram pour une boutique de cosmétiques",
          slug: "strategie-instagram-cosmetiques",
          summary: "Refonte de la ligne éditoriale et animation quotidienne : +45 % d'abonnés en 3 mois.",
          description:
            "Audit du compte existant, définition d'une ligne éditoriale et d'une charte visuelle cohérente.\n\nCréation d'un calendrier de publication, de visuels Canva et de reels hebdomadaires. Animation de la communauté et reporting mensuel.",
          service: "COMMUNITY_MANAGEMENT",
          client: "Boutique Beauté (exemple)",
          tags: ["Instagram", "Canva", "Reels"],
          completedAt: new Date("2026-03-01"),
          published: true,
          featured: true,
        },
        {
          title: "Site vitrine pour un cabinet de conseil",
          slug: "site-vitrine-cabinet-conseil",
          summary: "Conception et développement d'un site moderne, rapide et optimisé pour le référencement.",
          description:
            "Maquettes sur Figma validées avec le client, puis intégration responsive.\n\nOptimisation SEO technique (balises, performances, sitemap) et formation du client à la mise à jour des contenus.",
          service: "DEVELOPPEMENT_WEB",
          client: "Cabinet Conseil (exemple)",
          tags: ["Next.js", "SEO", "Responsive"],
          completedAt: new Date("2026-05-15"),
          published: true,
          featured: true,
        },
        {
          title: "Montage de vidéos YouTube pour une créatrice",
          slug: "montage-videos-youtube",
          summary: "Montage hebdomadaire, sous-titres et miniatures pour une chaîne lifestyle.",
          description:
            "Dérushage, montage rythmé, ajout de sous-titres et d'habillages animés.\n\nCréation des miniatures et déclinaison en formats courts pour TikTok et Instagram.",
          service: "MONTAGE_VIDEO",
          tags: ["CapCut", "Premiere Pro", "YouTube"],
          completedAt: new Date("2026-07-10"),
          published: true,
        },
      ],
    });
    console.log("✔ Projets d'exemple ajoutés");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
