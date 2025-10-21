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

Architecture
-----------
Ce projet est composé d'un frontend Next.js (React + TypeScript) qui consomme une API Symfony située dans `backend-symfony/`. L'API expose des endpoints REST protégés par rôles (ex: `/api/teacher/*`) et utilise Doctrine pour la persistence. Le frontend utilise `NEXT_PUBLIC_API_BASE` pour pointer vers l'API et stocke un token JWT côté client pour l'authentification.

Base de données
---------------
Si tu as un dump SQL (`database/evaluation_app.sql`), tu peux démarrer une instance Postgres + Adminer fournie et importer automatiquement le dump :

```bash
# Démarrer la base et Adminer
./scripts/start-db.sh
```

Adminer sera disponible sur http://localhost:8080 (user: `eval_user`, pass: `eval_pass`, db: `evaluation_app`).

Importer une base MySQL (XAMPP)
--------------------------------
Si ta base est sur XAMPP (MySQL/MariaDB) et que tu veux utiliser ce dump ou remplacer la base actuelle :

1. Faire un backup (si la base contient déjà des données importantes) via phpMyAdmin ou `mysqldump`.

2. Importer le dump SQL localement (exemple) :

```bash
# import via script (utilise backend-symfony/.env.local si présent)
./scripts/import-sql.sh path/to/your/dump.sql

# ou importer manuellement via mysql client
mysql -u root -p evaluation_app < path/to/dump.sql
```

3. Vérifier la connexion Symfony (depuis le dossier backend-symfony) :

```bash
composer install
php bin/console doctrine:query:sql "SELECT 1"
```



