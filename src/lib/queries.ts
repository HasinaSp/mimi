import "server-only";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ServiceType } from "@/generated/prisma/enums";

// Requêtes publiques : exécutées à chaque requête (contenu toujours à jour
// après une modification dans le back-office).

export async function getPublishedProjects(service?: ServiceType) {
  await connection();
  return prisma.project.findMany({
    where: { published: true, ...(service ? { service } : {}) },
    orderBy: [{ featured: "desc" }, { completedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getFeaturedProjects(limit = 3) {
  await connection();
  return prisma.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { completedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getPublishedProject(slug: string) {
  await connection();
  return prisma.project.findFirst({ where: { slug, published: true } });
}
