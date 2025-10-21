# edu-eval-app

Mon projet Edu Eval (frontend Next.js + backend Symfony).

Structure:
- backend-symfony/: API Symfony
- frontend-nextjs/: application Next.js

Instructions rapides:

1. Installer les dépendances frontend:
   - cd frontend-nextjs && npm install

2. Installer les dépendances backend:
   - cd backend-symfony && composer install

3. Lancer le frontend:
   - cd frontend-nextjs && npm run dev

4. Lancer le backend (Docker Compose ou Symfony local):
   - docker compose -f backend-symfony/compose.yaml up --build
