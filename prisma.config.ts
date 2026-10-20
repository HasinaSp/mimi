import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Les commandes CLI (migrate, studio…) utilisent la connexion directe (non poolée)
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
