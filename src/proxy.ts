// Vérification optimiste : redirige vers /admin/login si aucune session.
// Les pages et Server Actions revérifient la session côté serveur (voir src/lib/dal.ts).
export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/admin/:path*"],
};
