# Site vitrine — Noa Hauquin

Site d'une page en HTML/CSS simple, sans framework ni bibliothèque, en français et en anglais.
Le JavaScript n'ajoute que des effets : sans lui, le site reste complet.

| Fichier | Rôle |
| --- | --- |
| `index.html` | Version française |
| `en.html` | Version anglaise (même structure, à garder synchronisée) |
| `style.css` | Mise en forme, animations, mode sombre et version imprimable |
| `main.js` | Effets : apparitions, compteurs, titre animé, inclinaison 3D, barre de lecture, menu actif |
| `globe.js` | Globe 3D des destinations (points de la Terre + moteur de rendu sur `<canvas>`) |
| `img/` | Photo, icône d'onglet, image d'aperçu de partage, QR code du site |
| `CV-Noa-Hauquin.pdf` | CV téléchargeable |

## Voir le site

Double-clique sur `index.html` : il s'ouvre dans ton navigateur.

## Modifier

- **Couleurs** : en haut de `style.css`, dans `:root` (et juste en dessous pour le mode sombre).
- **Un texte** : modifie-le dans `index.html` **et** dans `en.html`.
- **Le CV** : remplace `CV-Noa-Hauquin.pdf` par la nouvelle version, sous le même nom.

## Globe et carte des destinations

Le globe 3D (`globe.js`) et la carte plate de secours (SVG intégré dans `index.html` et `en.html`)
sont générés à partir des données libres Natural Earth (paquet `world-atlas`).
Les destinations affichées sur le globe viennent des boutons de la liste `destination-list`
(attributs `data-lat` / `data-lon`) : pour en ajouter une, ajoute un bouton dans les deux pages.

La carte plate s'affiche si le JavaScript est désactivé et à l'impression.

## Mise en ligne

Les aperçus de partage (LinkedIn, WhatsApp…) pointent vers `https://noa7-65.github.io/Mon-site/`,
l'adresse du site une fois GitHub Pages activé sur la branche `main`.
