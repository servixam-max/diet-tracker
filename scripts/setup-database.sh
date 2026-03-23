#!/bin/bash
# Setup Database - Ejecuta el schema en Supabase Cloud

set -e

TOKEN="sbp_e0b9bf65b44c61f6c1318a14cb165b50b7bd49c5"
PROJECT_ID="kaomgwojvnncidyezdzj"

echo "🔄 Ejecutando schema en Supabase Cloud..."

# Ejecutar el schema SQL
SCHEMA=$(cat ../supabase/schema.sql)

curl -s -X POST \
  "https://api.supabase.com/v1/projects/$PROJECT_ID/database/query" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$SCHEMA\"}"

echo ""
echo "✅ Schema ejecutado!"
