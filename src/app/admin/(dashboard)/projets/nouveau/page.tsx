import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/page-header";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdmin } from "@/lib/dal";

export const metadata: Metadata = { title: "Nouveau projet" };

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Nouveau projet" description="Ajoutez une réalisation à votre portfolio." />
      <ProjectForm />
    </>
  );
}
