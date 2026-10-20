# Charte graphique — Miora Dinasoa

**Positionnement :** assistante virtuelle polyvalente — professionnelle, fiable, chaleureuse et créative.
L'identité associe un **prune profond** (confiance, élégance, sérieux) à un **corail doux** (chaleur, énergie, passage à l'action), sur un fond **sable** apaisant.

## Logo

Monogramme **« MD »** blanc en serif sur un carré arrondi prune, ponctué d'un **point corail** (le « petit plus » de l'assistante).
Fichiers : `src/components/site/logo.tsx` (composant) et `src/app/icon.svg` (favicon).

## Couleurs

| Rôle | Nom | Hex | Usage |
| --- | --- | --- | --- |
| Primaire | Prune 700 | `#4A2358` | Titres, fonds forts, bouton secondaire |
| Primaire foncé | Prune 900 | `#2A1333` | Pied de page, back-office |
| Accent | Corail 500 | `#E07A5F` | Boutons d'action (CTA), surlignages |
| Accent foncé | Corail 600 | `#C9634B` | Survol, liens, sur-titres |
| Secondaire | Sauge 500 | `#7FA48A` | Validation, disponibilité, succès |
| Fond | Sable 100 | `#FAF6F1` | Fond de page |
| Fond alterné | Sable 200 | `#F4ECE3` | Sections alternées |
| Texte | Encre | `#231B26` | Texte courant |
| Texte secondaire | Gris prune | `#6E6273` | Descriptions, légendes |

Toutes les nuances (50 → 900) sont définies dans `src/app/globals.css` (`@theme`) et disponibles en classes Tailwind : `bg-plum-700`, `text-coral-600`, `border-sand-300`, etc.

## Typographies (Google Fonts, chargées via `next/font`)

- **Fraunces** — titres. Serif moderne et douce : élégance, personnalité.
- **Plus Jakarta Sans** — textes et interface. Sans-serif géométrique, très lisible.

## Éléments d'interface

- Coins très arrondis (cartes `1.25rem`, boutons en pilule).
- Ombres douces teintées prune (`shadow-soft`).
- Icônes linéaires fines (trait 1.7px).
- Classes utilitaires prêtes à l'emploi : `btn-primary`, `btn-secondary`, `btn-ghost`, `card`, `eyebrow`, `input`, `label`.

## Ton éditorial

Vouvoiement, phrases courtes, orienté bénéfices client (« gagnez du temps », « je m'occupe du reste »).
