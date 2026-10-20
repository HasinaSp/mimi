import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Data Access Layer : à appeler dans chaque page / action du back-office */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");
  return session.user;
}
