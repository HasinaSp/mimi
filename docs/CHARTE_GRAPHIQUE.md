# Charte graphique — Miora Dinasoa

**Positionnement :** assistante virtuelle polyvalente — professionnelle, fiable, chaleureuse et créative.
L'identité est tirée du **logo « Mi »** : un **rose pétale** doux et rond, deux **feuilles vertes** (croissance, fraîcheur) et un fond **crème**. Aucune autre couleur d'accent.

## Logo

Lettres **« Mi »** dessinées à la main en rose, avec deux feuilles vertes au-dessus du point du « i ».

| Fichier | Usage |
| --- | --- |
| `public/logo.png` | Logo sur fond transparent (en-tête, pied de page, back-office) via `src/components/site/logo.tsx` |
| `src/app/icon.png` | Favicon (fond transparent) |
| `src/app/apple-icon.png` | Icône d'écran d'accueil iOS (fond crème) |

Le logo fonctionne sur le fond crème comme sur le graphite foncé du pied de page.

## Couleurs

Couleurs relevées sur le logo :

| Couleur | Hex | Classe Tailwind |
| --- | --- | --- |
| Rose pétale (« Mi ») | `#F19598` | `petal-400` |
| Vert feuille (feuilles) | `#96AE22` | `leaf-500` |
| Crème (fond) | `#F5F4F0` | `sand-100` |

| Rôle | Nuance | Hex | Usage |
| --- | --- | --- | --- |
| Principale | Pétale 400 | `#F19598` | Boutons d'action (texte graphite), pastilles, icônes au survol |
| Principale claire | Pétale 50 → 200 | `#FEF5F5` → `#FAD0D1` | Fonds de badges, onglet actif, surlignage, halos, textes clairs sur fond foncé |
| Principale foncée | Pétale 700 / 800 | `#A43F45` / `#7F3136` | Mot mis en avant dans le titre, statut « Nouvelle » |
| Accent | Feuille 500 | `#96AE22` | Pastille « disponible », coches, étoiles « à la une », cases à cocher |
| Accent clair | Feuille 100 → 300 | `#EBF2C9` → `#BFD35E` | Badges de succès, liens au survol sur fond foncé |
| Accent foncé | Feuille 700 | `#5E6E15` | Liens, sur-titres, icônes, contour de focus (lisible sur fond clair) |
| Fond | Crème 100 | `#F5F4F0` | Fond de page (celui du logo) |
| Fond alterné | Crème 200 | `#EDEBE5` | Sections alternées |
| Structure | Graphite (`neutral` 700 → 900) | `#404040` → `#171717` | Titres, bouton secondaire, pied de page, back-office, section contact |
| Texte | Encre | `#262626` | Texte courant |
| Texte secondaire | Gris | `#6B6B6B` | Descriptions, légendes |

Accessibilité : le rose et le vert du logo sont clairs, donc jamais de texte blanc dessus (contraste insuffisant) : on écrit en graphite. Pour du texte coloré sur fond clair, utiliser Feuille 700 ou Pétale 700.

Toutes les nuances sont définies dans `src/app/globals.css` (`@theme`) : `bg-petal-400`, `text-leaf-700`, `bg-sand-100`, `bg-neutral-900`, etc.

## Typographies (Google Fonts, chargées via `next/font`)

- **Fraunces** — titres. Serif moderne et douce : élégance, personnalité.
- **Plus Jakarta Sans** — textes et interface. Sans-serif géométrique, très lisible.

## Éléments d'interface

- Coins très arrondis (cartes `1.25rem`, boutons en pilule), en écho aux formes rondes du logo.
- Ombres douces teintées rose (`shadow-soft`).
- Icônes linéaires fines (trait 1.7px).
- Classes utilitaires prêtes à l'emploi : `btn-primary`, `btn-secondary`, `btn-ghost`, `card`, `eyebrow`, `input`, `label`.

## Ton éditorial

Vouvoiement, phrases courtes, orienté bénéfices client (« gagnez du temps », « je m'occupe du reste »).
