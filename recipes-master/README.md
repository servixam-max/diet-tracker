# 🍽️ Diet Tracker - Recetario Maestro (500+ recetas)

## Estructura del Archivo

Cada receta sigue este formato JSON:

```json
{
  "name": "Nombre de la receta",
  "description": "Descripción breve",
  "prep_time_minutes": 15,
  "calories": 350,
  "protein_g": 25,
  "carbs_g": 40,
  "fat_g": 10,
  "servings": 1,
  "supermarket": "mercadona",
  "ingredients": "[{\"item\":\"Ingrediente 1\",\"amount\":\"100g\"},{\"item\":\"Ingrediente 2\",\"amount\":\"50g\"}]",
  "instructions": "[\"Paso 1\",\"Paso 2\",\"Paso 3\"]",
  "tags": "[\"desayuno\",\"proteico\",\"rápido\"]"
}
```

## Supermercados Disponibles
- `mercadona`
- `lidl`
- `aldi`
- `familycash`

## Categorías de Recetas

### Desayunos (100 recetas)
- Avenas nocturnas
- Tostadas
- Tortitas
- Bowls de yogur
- Huevos
- Batidos
- Panqueques

### Comidas (150 recetas)
- Pollos al horno/plancha
- Pescados
- Pastas
- Arroces
- Legumbres
- Ensaladas completas
- Wraps
- Bowls

### Cenas (150 recetas)
- Pescados al horno/vapor
- Tortillas
- Revueltos
- Verduras rellenas
- Cremas
- Salteados
- Mariscos

### Snacks (100 recetas)
- Frutos secos
- Yogures
- Batidos
- Tostadas
- Fruta
- Barritas caseras

## Macros por Tipo

| Tipo | Calorías | Proteína | Carbs | Grasa |
|------|----------|----------|-------|-------|
| Desayuno | 300-450 | 15-25g | 40-60g | 8-15g |
| Comida | 450-650 | 35-50g | 50-80g | 12-25g |
| Cena | 250-450 | 25-40g | 20-45g | 10-20g |
| Snack | 150-250 | 8-15g | 15-30g | 5-12g |

## Tags Disponibles

- `desayuno`, `comida`, `cena`, `snack`
- `proteico`, `keto`, `bajo-carb`, `vegano`, `vegetariano`
- `rápido`, `fácil`, `meal-prep`, `portátil`
- `saludable`, `económico`, `tradicional`
- `horno`, `vapor`, `plancha`, `batidora`
- `post-entreno`, `energía`, `ligero`

---

## Estado de Producción

- [ ] Lote 1: 100 recetas (Agente 1)
- [ ] Lote 2: 100 recetas (Agente 2)
- [ ] Lote 3: 100 recetas (Agente 3)
- [ ] Lote 4: 100 recetas (Agente 4)
- [ ] Lote 5: 100 recetas (Agente 5)
- [ ] Merge final
- [ ] Upload a Supabase

---

**Objetivo:** 500+ recetas únicas, variadas y balanceadas
