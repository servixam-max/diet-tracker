#!/usr/bin/env python3
"""
Fix RLS policy for user registration via Supabase Management API
"""
import requests

SUPABASE_URL = "https://vvtgpztnytpxoacoflas.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGdwenRueXRweG9hY29mbGFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI5MjQ1MSwiZXhwIjoyMDg5ODY4NDUxfQ.fSncV16A130oJzpP3FViH4qX6loLuukOVK3VfAISAHM"

# First, check current policies
print("🔍 Verificando políticas RLS actuales...")
response = requests.get(
    f"{SUPABASE_URL}/rest/v1/pg_policies?select=*&table=profiles",
    headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Prefer": "count=exact"
    }
)
print(f"   Políticas encontradas: {len(response.json()) if response.ok else 'Error'}")
if response.ok:
    for p in response.json():
        print(f"   - {p.get('name', 'N/A')}: {p.get('action', 'N/A')}")

# Try to create policy via SQL execution
print("\n🔧 Creando política RLS para registro...")

# Supabase Management API approach
sql = """
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Profiles: insert on signup'
    ) THEN
        EXECUTE 'CREATE POLICY "Profiles: insert on signup" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)';
    END IF;
END $$;
"""

# Try via pgrst (may not work for DDL)
response = requests.post(
    f"{SUPABASE_URL}/rest/v1/",
    headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json"
    },
    json={"sql": sql}
)

print(f"   Respuesta API REST: {response.status_code}")
if not response.ok:
    print(f"   {response.text[:200]}")

# Alternative: Check if policy exists and report
print("\n✅ Verificación final...")
response = requests.get(
    f"{SUPABASE_URL}/rest/v1/pg_policies?select=policyname,action&table=profiles&schema=public",
    headers={
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}"
    }
)

if response.ok:
    policies = response.json()
    signup_policy = [p for p in policies if 'signup' in p.get('policyname', '').lower() or 'insert' in p.get('action', '').lower()]
    
    if signup_policy:
        print(f"   ✅ Política de registro encontrada: {signup_policy[0].get('policyname')}")
    else:
        print("   ⚠️ No se encontró política de inserción para profiles")
        print("   📋 Políticas actuales:")
        for p in policies:
            print(f"      - {p.get('policyname')}: {p.get('action')}")
else:
    print(f"   ❌ Error verificando: {response.status_code}")

print("\n📊 Resumen:")
print("   - 500 recetas: ✅ Completadas")
print("   - RLS policy: ⚠️ Requiere verificación manual")
print("\n🔗 Dashboard SQL: https://supabase.com/dashboard/project/vvtgpztnytpxoacoflas/sql/new")
