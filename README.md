# Portfolio — Miora Dinasoa

Site vitrine + back-office de **Miora Dinasoa**, assistante virtuelle polyvalente
(community management, gestion administrative, SEO, design web, relation client, montage vidéo, développement web).

**Stack :** Next.js 16 (App Router, Cache Components) · Auth.js / NextAuth v5 · Prisma 7 (PostgreSQL — Neon ou Supabase) · Tailwind CSS v4 · Vercel.

## Fonctionnalités

**Site public**
- Accueil : présentation, services, méthode de travail, projets à la une, contact.
- `/projets` : tous les projets publiés, filtrables par service ; `/projets/[slug]` : détail (description, galerie, tags, lien).
- Section contact : WhatsApp, email, LinkedIn.
- `/collaboration` : formulaire de demande de prestation (validation, anti-spam honeypot, accusé de réception par email).

**Back-office (`/admin`)** — protégé par identifiant / mot de passe
- Tableau de bord : statistiques et dernières demandes.
- Demandes : liste filtrable par statut, fiche détaillée, changement de statut, notes internes, notification du client par email, suppression.
- Projets : création, modification, suppression, publication / brouillon, mise à la une.

**Notifications email** — au choix via `EMAIL_PROVIDER` : SMTP Gmail, SMTP Brevo, API Resend ou API Brevo.
- Nouvelle demande → email à Miora + accusé de réception au client.
- Changement de statut → email optionnel au client.

## Démarrage en local

```bash
npm install
cp .env.example .env          # puis remplir les variables
npm run db:migrate            # crée les tables
npm run db:seed               # crée le compte admin + 3 projets d'exemple
npm run dev
```

- Site : http://localhost:3000
- Back-office : http://localhost:3000/admin (identifiants `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

Sans `EMAIL_PROVIDER`, les emails sont affichés dans le terminal.

## Base de données gratuite

**Neon** (recommandé avec Vercel) : créer un projet sur https://neon.tech, copier la connection string *pooled* dans `DATABASE_URL` et la *direct* (sans `-pooler`) dans `DIRECT_URL`.

**Supabase** : Project Settings → Database → Connection string. `DATABASE_URL` = Transaction pooler (port 6543), `DIRECT_URL` = Session pooler / direct (port 5432).

## Emails

| Fournisseur | Variables | Remarques |
| --- | --- | --- |
| Gmail SMTP | `EMAIL_PROVIDER=smtp`, `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_USER`, `SMTP_PASSWORD` | Activer la validation en 2 étapes puis créer un **mot de passe d'application**. ~500 emails/jour. |
| Brevo SMTP | `EMAIL_PROVIDER=smtp`, `SMTP_HOST=smtp-relay.brevo.com`, `SMTP_PORT=587`, identifiants SMTP Brevo | 300 emails/jour gratuits. |
| Brevo API | `EMAIL_PROVIDER=brevo`, `BREVO_API_KEY` | Expéditeur `MAIL_FROM` à valider dans Brevo. |
| Resend | `EMAIL_PROVIDER=resend`, `RESEND_API_KEY` | 3 000 emails/mois gratuits ; domaine à vérifier pour écrire aux clients. |

## Déploiement sur Vercel

1. Importer le dépôt GitHub sur https://vercel.com/new.
2. Ajouter les variables d'environnement de `.env.example` (au minimum `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_*`, et les variables email).
   Astuce : l'intégration Neon de la marketplace Vercel remplit automatiquement l'URL de la base.
3. Appliquer les migrations sur la base de production depuis votre poste (avec les URL de prod dans `.env`) :
   ```bash
   npm run db:deploy
   npm run db:seed
   ```
4. Déployer. Le script `build` exécute `prisma generate` automatiquement.

## Structure

```
prisma/                     schéma, migrations, seed
src/app/(site)/             pages publiques (accueil, projets, collaboration)
src/app/admin/login/        connexion
src/app/admin/(dashboard)/  back-office (tableau de bord, demandes, projets)
src/auth.ts                 configuration NextAuth (Credentials + JWT)
src/proxy.ts                protection des routes /admin (ex-« middleware »)
src/lib/                    Prisma, emails, notifications, validation, services
src/components/             composants du site et du back-office
docs/CHARTE_GRAPHIQUE.md    couleurs, typographies, logo
```

## Pistes pour la suite

- Upload d'images directement depuis le back-office (Vercel Blob ou Cloudinary) — actuellement par URL.
- Photo de Miora et section « À propos » / témoignages clients.
- Limitation de débit du formulaire (Upstash) si le spam devient un problème.
- Réinitialisation du mot de passe admin par email.
