# edu-eval-app

Mon projet Edu Eval (frontend Next.js + backend Symfony).

Structure:
- `backend-symfony/`: API Symfony
- `frontend-nextjs/`: application Next.js

![CI](https://github.com/Saimperfile80/edu-eval-app/actions/workflows/ci.yml/badge.svg)

Quick start

Prereqs:
- Node.js (>=20), npm
- PHP (>=8.2) et Composer

Frontend
1. Installer les dépendances:
   - cd frontend-nextjs && npm install
2. Lancer en dev:
   - cd frontend-nextjs && npm run dev
3. Build (production):
   - cd frontend-nextjs && npm run build

Backend
1. Installer les dépendances PHP:
   - cd backend-symfony && composer install
2. Lancer avec Docker Compose (optionnel):
   - docker compose -f backend-symfony/compose.yaml up --build

Remarques
- Le dépôt contient déjà une configuration de base pour Next.js et Symfony.
- Voir le fichier `.gitignore` pour les fichiers exclus du dépôt.

Contribuer
- Soumettre des issues et pull requests sur GitHub.

Licence
- Ce projet est sous licence MIT (voir `LICENSE`).

