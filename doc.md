# NeoTerra — Documentation

Projet de jeu de plateau (web) inspiré de Trivial Pursuit, basé sur **Vite** + **Phaser 3**.

## Prérequis

- Node.js (LTS conseillé)
- npm (fourni avec Node)

## Installation

```bash
npm install
```

## Lancer en développement

```bash
npm run dev
```

- Vite affiche ensuite une URL du type `http://localhost:5173/` (ou un autre port si déjà utilisé).
- Ouvre cette URL dans ton navigateur.

> Important : ne lance pas le projet en ouvrant `index.html` en double-cliquant (mode `file://`). Phaser/Vite ont besoin d’un serveur.

## Build (production)

```bash
npm run build
```

Le build est généré dans `dist/`.

## Prévisualiser le build

```bash
npm run preview
```

## Déploiement (GitHub Pages)

Le projet contient un script :

```bash
npm run deploy
```

Ce script publie le contenu de `dist/` sur la branche GitHub Pages.

Notes :

- Ce script suppose l’outil `gh-pages`. S’il n’est pas installé dans le projet, installe-le puis relance :
  ```bash
  npm install --save-dev gh-pages
  ```
- Pour un déploiement dans un sous-dossier (ex: `/NeoTerra/`), Vite doit connaître la `base`. Le code Phaser utilise `import.meta.env.BASE_URL` pour préfixer les assets.

## Utilisation (flux)

- Page d’accueil avec le bouton **Jouer**.
- Au clic sur **Jouer** : affichage de la section `#game` et initialisation de Phaser.
- Dans la section `#game` :
  - Bouton **Lancer le dé** + dé cliquable (animation CSS)
  - Bouton **Partie terminée** (affiche l’écran de fin)
- Écran de fin (`#endSection`) : bouton **Recommencer**.

## Structure du projet

- `index.html` : structure de la page (accueil, `#game`, `#endSection`)
- `src/main.js` : point d’entrée JS (initialise les sections et le dé)
- `src/gamesection.js` : logique du bouton **Jouer** + lancement de Phaser
- `src/game.js` : scène Phaser + chargement de la tilemap et assets
- `src/rollDice.js` : lancer de dé (random 1–6) + animation/rotation du cube
- `src/endSection.js` : logique de fin de partie (afficher/masquer sections)
- `src/style.css` : styles globaux (accueil + UI + dé)
- `public/assets/` : assets statiques servis par Vite
  - `Map.tmj` : tilemap
  - `questions.json` : banque de questions
  - `images/pieces/` : pions

## Assets

Les assets sont servis depuis `public/` (Vite les expose à la racine) :

- `public/assets/Map.tmj`
- `public/assets/questions.json`
- `public/assets/images/pieces/*.png`

Dans Phaser (`src/game.js`), les chemins sont construits avec :

- `const base = import.meta.env.BASE_URL || "/";`

…puis `${base}assets/...`.

## Dépannage

- **"pm run dev" ne marche pas** : la commande est `npm run dev`.
- **Port déjà utilisé** : Vite choisit automatiquement un autre port (ex: 5174, 5175…).
- **Écran vide / assets non chargés** : vérifie que tu lances via `npm run dev` (pas `file://`) et que les fichiers existent dans `public/assets/`.

## TODO

Voir `TODO.md`.
