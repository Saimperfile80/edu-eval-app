#!/usr/bin/env bash
set -euo pipefail

USAGE="Usage: $0 <dump-file.sql> [db_host] [db_port] [db_name] [db_user] [db_pass]
If optional params are omitted, values from backend-symfony/.env.local are used when possible."

if [ "$#" -lt 1 ]; then
  echo "$USAGE"
  exit 1
fi

DUMP_FILE="$1"
if [ ! -f "$DUMP_FILE" ]; then
  echo "Dump file not found: $DUMP_FILE"
  exit 2
fi

DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_NAME="evaluation_app"
DB_USER="root"
DB_PASS=""

if [ -f backend-symfony/.env.local ]; then
  # try to read DATABASE_URL
  DATABASE_URL_LINE=$(grep -E '^DATABASE_URL=' backend-symfony/.env.local || true)
  if [ -n "$DATABASE_URL_LINE" ]; then
    # strip prefix
    DBURL=${DATABASE_URL_LINE#DATABASE_URL=}
    DBURL=${DBURL#"}
    DBURL=${DBURL%"}
    # expect format mysql://user:pass@host:port/dbname?... 
    if [[ "$DBURL" =~ mysql://([^:]+):([^@]+)@([^:]+):([0-9]+)/([^?]+) ]]; then
      DB_USER="${BASH_REMATCH[1]}"
      DB_PASS="${BASH_REMATCH[2]}"
      DB_HOST="${BASH_REMATCH[3]}"
      DB_PORT="${BASH_REMATCH[4]}"
      DB_NAME="${BASH_REMATCH[5]}"
    fi
  fi
fi

# override with args if provided
if [ "$#" -ge 2 ]; then DB_HOST="$2"; fi
if [ "$#" -ge 3 ]; then DB_PORT="$3"; fi
if [ "$#" -ge 4 ]; then DB_NAME="$4"; fi
if [ "$#" -ge 5 ]; then DB_USER="$5"; fi
if [ "$#" -ge 6 ]; then DB_PASS="$6"; fi

echo "Importing $DUMP_FILE into $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"

if ! command -v mysql >/dev/null 2>&1; then
  echo "mysql client not found. Install it or import via phpMyAdmin/Adminer."
  exit 3
fi

if [ -z "$DB_PASS" ]; then
  mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" < "$DUMP_FILE"
else
  mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$DUMP_FILE"
fi

echo "Import finished."
