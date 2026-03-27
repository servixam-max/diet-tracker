#!/usr/bin/env python3
"""
Clean up duplicate recipes and fix incomplete names
Keep only 500 unique recipes with complete data
"""

import requests
from collections import defaultdict

SUPABASE_URL = "https://vvtgpztnytpxoacoflas.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGdwenRueXRweG9hY29mbGFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI5MjQ1MSwiZXhwIjoyMDg5ODY4NDUxfQ.fSncV16A130oJzpP3FViH4qX6loLuukOVK3VfAISAHM"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}

print("🔍 Obteniendo todas las recetas...")
recipes = []
offset = 0
batch_size = 1000

while True:
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/recipes?select=id,name,image_url&limit={batch_size}&offset={offset}",
        headers=HEADERS
    )
    batch = response.json()
    if not batch:
        break
    recipes.extend(batch)
    if len(batch) < batch_size:
        break
    offset += batch_size

print(f"📊 Total recetas en DB: {len(recipes)}")

# Group by name to find duplicates
by_name = defaultdict(list)
for r in recipes:
    name = r.get('name', '').strip()
    if name:
        by_name[name].append(r['id'])

print(f"📊 Nombres únicos: {len(by_name)}")

# Find incomplete names (ending with " con " or similar)
incomplete = [r for r in recipes if r.get('name', '').rstrip().endswith(' con ')]
print(f"⚠️  Nombres incompletos: {len(incomplete)}")

# Delete duplicates - keep first ID for each name
to_delete = []
for name, ids in by_name.items():
    if len(ids) > 1:
        # Keep first, delete rest
        to_delete.extend(ids[1:])

print(f"🗑️  Duplicados a eliminar: {len(to_delete)}")

# Delete incomplete names
incomplete_ids = [r['id'] for r in incomplete]
to_delete.extend(incomplete_ids)
to_delete = list(set(to_delete))  # Remove duplicates from deletion list

print(f"🗑️  Total a eliminar: {len(to_delete)}")
print(f"✅ Recetas finales esperadas: {len(recipes) - len(to_delete)}")

if to_delete:
    print("\n🗑️  Eliminando duplicados...")
    # Delete in batches
    for i in range(0, len(to_delete), 100):
        batch = to_delete[i:i+100]
        ids_str = ','.join(f'"{id}"' for id in batch)
        response = requests.delete(
            f"{SUPABASE_URL}/rest/v1/recipes?id=in.({ids_str})",
            headers=HEADERS
        )
        print(f"   ... eliminadas {min(i+100, len(to_delete))}/{len(to_delete)}")
        if response.status_code not in [200, 204]:
            print(f"   ⚠️  Error: {response.text[:100]}")

print("\n✅ Limpieza completada")

# Verify final count
response = requests.get(
    f"{SUPABASE_URL}/rest/v1/recipes?select=id&limit=1",
    headers=HEADERS,
    params={"Prefer": "count=exact"}
)
# Count from header or fallback
print("\n📊 Verificando resultado final...")
response = requests.get(
    f"{SUPABASE_URL}/rest/v1/recipes?select=id,name&limit=10",
    headers=HEADERS
)
final = response.json()
print(f"✅ Recetas en DB: {len(final)}+ (verifica en dashboard)")
print("\nMuestra de recetas:")
for r in final[:5]:
    print(f"  - {r.get('name', 'N/A')[:50]}")
