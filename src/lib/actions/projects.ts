"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { slugify, splitList } from "@/lib/utils";
import { projectSchema, type FormState } from "@/lib/validation";

/** Garantit un slug unique en ajoutant -2, -3… si nécessaire */
async function uniqueSlug(base: string, excludeId?: string) {
  const root = base || "projet";
  let slug = root;
  for (let i = 2; ; i++) {
    const existing = await prisma.project.findUnique({ where: { slug }, select: { id: true } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${root}-${i}`;
  }
}

export async function saveProject(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const id = (formData.get("id") as string | null) || undefined;
  const values = {
    title: formData.get("title") ?? "",
    slug: formData.get("slug") ?? "",
    summary: formData.get("summary") ?? "",
    description: formData.get("description") ?? "",
    service: formData.get("service") ?? "",
    client: formData.get("client") ?? "",
    coverImage: formData.get("coverImage") ?? "",
    gallery: splitList(String(formData.get("gallery") ?? "")),
    tags: splitList(String(formData.get("tags") ?? "")),
    link: formData.get("link") ?? "",
    completedAt: formData.get("completedAt") ?? "",
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  };

  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Merci de corriger les champs indiqués.",
      errors: z.flattenError(parsed.error).fieldErrors,
      values: { ...values, gallery: values.gallery.join("\n"), tags: values.tags.join(", ") },
    };
  }

  const { slug: rawSlug, ...data } = parsed.data;
  const slug = await uniqueSlug(slugify(rawSlug || data.title), id);
  const record = {
    ...data,
    slug,
    client: data.client ?? null,
    coverImage: data.coverImage ?? null,
    link: data.link ?? null,
    completedAt: data.completedAt ?? null,
  };

  if (id) {
    await prisma.project.update({ where: { id }, data: record });
  } else {
    await prisma.project.create({ data: record });
  }

  redirect("/admin/projets?saved=1");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.project.delete({ where: { id } }).catch(() => null);
  redirect("/admin/projets");
}

export async function toggleProjectFlag(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const field = formData.get("field");
  if (!id || (field !== "published" && field !== "featured")) return;

  const project = await prisma.project.findUnique({ where: { id }, select: { published: true, featured: true } });
  if (!project) return;
  await prisma.project.update({ where: { id }, data: { [field]: !project[field] } });
  refresh();
}
