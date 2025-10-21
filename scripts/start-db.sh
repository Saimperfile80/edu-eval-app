#!/usr/bin/env bash
set -euo pipefail

echo "Starting Postgres and Adminer via docker-compose..."
docker compose -f docker-compose.db.yml up -d

if [ -f database/evaluation_app.sql ]; then
  echo "Found database/evaluation_app.sql — waiting for Postgres to be ready..."
  until docker exec $(docker ps -q -f name=edu-eval-app_db_1) pg_isready -U eval_user >/dev/null 2>&1; do
    sleep 1
  done
  echo "Importing SQL dump..."
  docker exec -i $(docker ps -q -f name=edu-eval-app_db_1) psql -U eval_user -d evaluation_app < database/evaluation_app.sql
  echo "Import complete."
else
  echo "No database/evaluation_app.sql found — starting empty database."
fi

echo "Adminer available at http://localhost:8080 (user: eval_user, pass: eval_pass, db: evaluation_app)"
