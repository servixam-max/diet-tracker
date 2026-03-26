#!/bin/bash

SUPABASE_URL="https://vvtgpztnytpxoacoflas.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGdwenRueXRweG9hY29mbGFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI5MjQ1MSwiZXhwIjoyMDg5ODY4NDUxfQ.fSncV16A130oJzpP3FViH4qX6loLuukOVK3VfAISAHM"

echo "🌱 Importando 5 recetas de ejemplo..."

# Receta 1
curl -s -X POST "$SUPABASE_URL/rest/v1/recipes" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Avena nocturna con plátano","description":"Desayuno energético","prep_time_minutes":5,"calories":350,"protein_g":12,"carbs_g":58,"fat_g":8,"servings":1,"supermarket":"mercadona","ingredients":"[{\"item\":\"Avena\",\"amount\":\"50g\"},{\"item\":\"Plátano\",\"amount\":\"1 ud\"}]","instructions":"[\"Mezcla todo\",\"Refrigera noche\"]","tags":"[\"desayuno\",\"saludable\"]"}' > /dev/null && echo "✅ Avena nocturna"

# Receta 2
curl -s -X POST "$SUPABASE_URL/rest/v1/recipes" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Tostada aguacate y huevo","description":"Desayuno proteico","prep_time_minutes":10,"calories":420,"protein_g":18,"carbs_g":32,"fat_g":24,"servings":1,"supermarket":"mercadona","ingredients":"[{\"item\":\"Pan integral\",\"amount\":\"2 rebanadas\"},{\"item\":\"Aguacate\",\"amount\":\"1/2 ud\"},{\"item\":\"Huevos\",\"amount\":\"2 ud\"}]","instructions":"[\"Tuesta pan\",\"Machaca aguacate\",\"Pocha huevos\"]","tags":"[\"desayuno\",\"proteico\"]"}' > /dev/null && echo "✅ Tostada aguacate"

# Receta 3
curl -s -X POST "$SUPABASE_URL/rest/v1/recipes" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pollo con quinoa","description":"Comida equilibrada","prep_time_minutes":25,"calories":520,"protein_g":45,"carbs_g":48,"fat_g":12,"servings":1,"supermarket":"mercadona","ingredients":"[{\"item\":\"Pechuga pollo\",\"amount\":\"200g\"},{\"item\":\"Quinoa\",\"amount\":\"80g\"},{\"item\":\"Brócoli\",\"amount\":\"150g\"}]","instructions":"[\"Cuece quinoa\",\"Cocina pollo\",\"Sirve junto\"]","tags":"[\"comida\",\"proteico\"]"}' > /dev/null && echo "✅ Pollo con quinoa"

# Receta 4
curl -s -X POST "$SUPABASE_URL/rest/v1/recipes" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Salmón al horno","description":"Cena rica en omega-3","prep_time_minutes":30,"calories":480,"protein_g":35,"carbs_g":42,"fat_g":18,"servings":1,"supermarket":"lidl","ingredients":"[{\"item\":\"Salmón\",\"amount\":\"150g\"},{\"item\":\"Boniato\",\"amount\":\"200g\"}]","instructions":"[\"Hornea 200°C 25min\"]","tags":"[\"cena\",\"omega-3\"]"}' > /dev/null && echo "✅ Salmón al horno"

# Receta 5
curl -s -X POST "$SUPABASE_URL/rest/v1/recipes" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ensalada atún","description":"Comida rápida","prep_time_minutes":15,"calories":380,"protein_g":28,"carbs_g":35,"fat_g":12,"servings":1,"supermarket":"mercadona","ingredients":"[{\"item\":\"Atún\",\"amount\":\"2 latas\"},{\"item\":\"Garbanzos\",\"amount\":\"150g\"},{\"item\":\"Lechuga\",\"amount\":\"100g\"}]","instructions":"[\"Mezcla todo\",\"Aliña\"]","tags":"[\"comida\",\"rápido\"]"}' > /dev/null && echo "✅ Ensalada atún"

echo ""
echo "✅ 5 recetas importadas"
echo "📊 Verifica: https://supabase.com/dashboard/project/vvtgpztnytpxoacoflas/table-editor/auth/recipes"
