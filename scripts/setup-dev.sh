#!/usr/bin/env bash
set -euo pipefail

echo "Installing frontend deps..."
cd frontend-nextjs
npm install

echo "Installing backend deps..."
cd ../backend-symfony
composer install

echo "Installing husky hooks..."
cd ../
npx husky install || true

echo "Setup complete."
