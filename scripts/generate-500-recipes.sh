#!/bin/bash
# Generador masivo de 500+ recetas para Diet Tracker
# Uso: bash scripts/generate-500-recipes.sh

SUPABASE_URL="https://vvtgpztnytpxoacoflas.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGdwenRueXRweG9hY29mbGFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI5MjQ1MSwiZXhwIjoyMDg5ODY4NDUxfQ.fSncV16A130oJzpP3FViH4qX6loLuukOVK3VfAISAHM"

echo "🍽️  Generando 500+ recetas para Diet Tracker..."
echo ""

# Función para importar receta
import_recipe() {
  local name="$1"
  local desc="$2"
  local time="$3"
  local cals="$4"
  local prot="$5"
  local carbs="$6"
  local fat="$7"
  local market="$8"
  local ingredients="$9"
  local instructions="${10}"
  local tags="${11}"
  
  curl -s -X POST "$SUPABASE_URL/rest/v1/recipes" \
    -H "apikey: $SERVICE_KEY" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\":\"$name\",
      \"description\":\"$desc\",
      \"prep_time_minutes\":$time,
      \"calories\":$cals,
      \"protein_g\":$prot,
      \"carbs_g\":$carbs,
      \"fat_g\":$fat,
      \"servings\":1,
      \"supermarket\":\"$market\",
      \"ingredients\":$ingredients,
      \"instructions\":$instructions,
      \"tags\":$tags
    }" > /dev/null
}

# Contador
count=0

echo "🥣 Generando DESAYUNOS (100 recetas)..."

# Avenas (20)
for i in {1..20}; do
  toppings=("Plátano y miel" "Fresas y nata" "Manzana y canela" "Arándanos y nueces" "Melocotón y almendras" "Mango y coco" "Pera y jengibre" "Kiwi y semillas" "Cerezas y chocolate" "Higos y pistachos")
  topping=${toppings[$((i-1))]}
  import_recipe "Avena nocturna con $topping" "Desayuno energético preparado la noche anterior" 5 350 12 58 8 "mercadona" '[{"item":"Avena","amount":"50g"},{"item":"Yogur griego","amount":"100g"},{"item":"'$topping'","amount":"50g"}]' '["Mezcla avena con yogur","Añade toppings","Refrigera noche","Sirve frío"]' '["desayuno","saludable","rápido","vegetariano"]'
  ((count++))
done

# Tostadas (20)
for i in {1..20}; do
  toppings=("Aguacate y huevo" "Tomate y jamón" "Salmón y queso crema" "Mantequilla de cacahuete y plátano" "Hummus y pimientos" "Queso de cabra y miel" "Pesto y mozzarella" "Atún y maíz" "Pollo y lechuga" "Nutella y fresas")
  topping=${toppings[$((i-1))]}
  import_recipe "Tostada de $topping" "Desayuno proteico y saciante" 10 420 18 32 24 "mercadona" '[{"item":"Pan integral","amount":"2 rebanadas"},{"item":"'$topping'","amount":"100g"}]' '["Tuesta el pan","Prepara el topping","Monta la tostada"]' '["desayuno","proteico","rápido"]'
  ((count++))
done

# Tortitas (15)
for i in {1..15}; do
  variations=("Clásicas" "De chocolate" "De plátano" "De avena" "De proteínas" "De manzana" "De arándanos" "De coco" "De calabaza" "De zanahoria" "De limón" "De almendra" "De queso" "De espinacas" "De cacao")
  var=${variations[$((i-1))]}
  import_recipe "Tortitas $var" "Desayuno dulce saludable" 15 380 14 52 12 "mercadona" '[{"item":"Harina integral","amount":"80g"},{"item":"Huevos","amount":"2 ud"},{"item":"Leche","amount":"100ml"}]' '["Mezcla ingredientes","Cuaja en sartén","Sirve con fruta"]' '["desayuno","dulce","saludable"]'
  ((count++))
done

# Bowls de yogur (15)
for i in {1..15}; do
  bases=("Yogur griego" "Skyr" "Quark" "Yogur de coco" "Kéfir")
  base=${bases[$((i % 5))]}
  toppings=("Granola y miel" "Frutos rojos" "Tropical" "Manzana caramelizada" "Chocolate y nueces")
  top=${toppings[$((i % 5))]}
  import_recipe "Bowl de $base con $top" "Desayuno ligero y antioxidante" 5 280 15 35 6 "lidl" '[{"item":"'$base'","amount":"200g"},{"item":"'$top'","amount":"50g"}]' '["Pon yogur en bowl","Añade toppings","Disfruta"]' '["desayuno","ligero","proteico"]'
  ((count++))
done

# Huevos (15)
for i in {1..15}; do
  styles=("Revueltos con espinacas" "Poché sobre tostada" "Tortilla francesa" "Al plato con jamón" "Mimados con tomate" "En nido de patatas" "Fritos sobre aguacate" "En tortilla de espinacas" "Con champiñones" "Con queso y cebollino" "Al curry" "Con salmón ahumado" "Con gambas" "Con chorizo" "Con verduras")
  style=${styles[$((i-1))]}
  import_recipe "Huevos $style" "Desayuno bajo en carbohidratos" 10 320 22 6 24 "mercadona" '[{"item":"Huevos","amount":"3 ud"},{"item":"Ingredientes varios","amount":"100g"}]' '["Prepara ingredientes","Cocina huevos","Sirve caliente"]' '["desayuno","keto","proteico"]'
  ((count++))
done

# Batidos (15)
for i in {1..15}; do
  flavors=("Plátano y fresa" "Tropical de mango" "Verde detox" "Chocolate y avellana" "Proteína y cacahuete" "Zanahoria y naranja" "Remolacha y jengibre" "Espinacas y piña" "Coco y lima" "Arándanos y avena" "Café y plátano" "Cúrcuma y leche" "Sandía y menta" "Pera y espinacas" "Melón y jengibre")
  flavor=${flavors[$((i-1))]}
  import_recipe "Batido $flavor" "Snack post-entreno" 5 280 25 32 4 "familycash" '[{"item":"Proteína","amount":"30g"},{"item":"Fruta","amount":"150g"},{"item":"Leche","amount":"250ml"}]' '["Pon todo en batidora","Tritura hasta suave","Sirve inmediatamente"]' '["desayuno","batido","proteico","rápido"]'
  ((count++))
done

echo "✅ $count desayunos generados"
echo ""
echo "🍽️  Generando COMIDAS (200 recetas)..."

# Pollos (25)
for i in {1..25}; do
  styles=("al ajillo" "al horno con limón" "a la plancha" "al curry" "en salsa de champiñones" "al romero" "con verduras" "a la cerveza" "al limón y mostaza" "encebollado" "con tomate" "a la brasa" "con arroz" "con patatas" "en salsa de queso" "con pimientos" "al jengibre" "con miel y mostaza" "a la mediterránea" "con cebolla caramelizada" "en salsa de soja" "con especias mexicanas" "al vino blanco" "con almendras" "con bacon")
  style=${styles[$((i-1))]}
  import_recipe "Pollo $style" "Comida equilibrada alta en proteína" 25 520 45 48 12 "mercadona" '[{"item":"Pechuga de pollo","amount":"200g"},{"item":"Ingredientes varios","amount":"150g"}]' '["Sazona el pollo","Cocina según estilo","Sirve caliente"]' '["comida","proteico","pollo"]'
  ((count++))
done

# Pescados (20)
for i in {1..20}; do
  fishes=("Salmón" "Merluza" "Atún" "Bacalao" "Lubina" "Dorada" "Gallo" "Rape" "Bonito" "Sardinas" "Caballa" "Anchoas" "Rodaballo" "Emperador" "Pez espada" "Trucha" "Perca" "Eglefino" "Lenguado" "Mero")
  fish=${fishes[$((i-1))]}
  styles=("al horno" "a la plancha" "al vapor" "en salsa verde" "a la romana" "en papillote" "a la sal" "encebollado" "con tomate" "al ajillo" "con verduras" "en salsa de limón" "a la brasa" "con arroz" "en salsa de vino" "con patatas" "al curry" "en salsa de mostaza" "con pimientos" "en salsa de soja")
  style=${styles[$((i % 20))]}
  import_recipe "$fish $style" "Comida rica en omega-3" 30 480 35 42 18 "lidl" '[{"item":"'$fish'","amount":"180g"},{"item":"Guarnición","amount":"200g"}]' '["Prepara el pescado","Cocina según estilo","Sirve con guarnición"]' '["comida","pescado","omega-3"]'
  ((count++))
done

# Pastas (20)
for i in {1..20}; do
  sauces=("a la boloñesa" "a la carbonara" "con pesto" "a la amatriciana" "con tomate y albóndigas" "con champiñones" "a la puttanesca" "con salmón" "con gambas" "con atún" "con verduras" "con pollo" "con queso azul" "a la napolitana" "con calabacín" "con berenjena" "con espinacas" "con bacon" "con chorizo" "con pavo")
  sauce=${sauces[$((i-1))]}
  import_recipe "Pasta $sauce" "Comida completa con carbohidratos" 20 550 38 62 14 "lidl" '[{"item":"Pasta integral","amount":"100g"},{"item":"Salsa","amount":"150g"}]' '["Cuece la pasta","Prepara la salsa","Mezcla y sirve"]' '["comida","pasta","completo"]'
  ((count++))
done

# Arroces (20)
for i in {1..20}; do
  styles=("con pollo" "con marisco" "con verduras" "con carne" "con champiñones" "con pescado" "con chorizo" "con jamón" "con huevo" "con queso" "con pimientos" "con cebolla" "con tomate" "con espinacas" "con calabacín" "con berenjena" "con guisantes" "con zanahoria" "con maíz" "con judías")
  style=${styles[$((i-1))]}
  import_recipe "Arroz $style" "Comida vegana completa" 30 420 12 78 8 "aldi" '[{"item":"Arroz integral","amount":"100g"},{"item":"Ingredientes varios","amount":"200g"}]' '["Cuece el arroz","Prepara ingredientes","Mezcla todo"]' '["comida","arroz","completo"]'
  ((count++))
done

# Legumbres (15)
for i in {1..15}; do
  types=("Lentejas con chorizo" "Garbanzos con espinacas" "Alubias con almejas" "Guisos con patatas" "Potaje de vigilia" "Cocido madrileño" "Fabada asturiana" "Puchero andaluz" "Lentejas con verduras" "Garbanzos con bacalao" "Alubias con morcilla" "Guisantes con jamón" "Habas a la catalana" "Pochas con txistorra" "Garbanzos con espinacas")
  type=${types[$((i-1))]}
  import_recipe "$type" "Comida tradicional rica en hierro" 45 420 22 58 8 "mercadona" '[{"item":"Legumbres","amount":"200g"},{"item":"Ingredientes varios","amount":"150g"}]' '["Remoja la noche anterior","Sofríe ingredientes","Cuece 40 minutos"]' '["comida","legumbres","tradicional"]'
  ((count++))
done

# Ensaladas (25)
for i in {1..25}; do
  bases=("César" "Griega" "Mixta" "Nicoise" "Caprese" "Waldorf" "Rusa" "Tepache" "Tabulé" "Fattoush" "Italiana" "Alemana" "Escandinava" "Asiática" "Mexicana" "Peruana" "Argentina" "Brasileña" "Tailandesa" "Vietnamita" "Japonesa" "Coreana" "India" "Marroquí" "Libanesa")
  base=${bases[$((i-1))]}
  import_recipe "Ensalada $base" "Comida ligera y fresca" 15 380 28 35 12 "mercadona" '[{"item":"Lechuga","amount":"150g"},{"item":"Proteína","amount":"120g"},{"item":"Verduras","amount":"100g"}]' '["Lava y corta ingredientes","Mezcla todo","Aliña al gusto"]' '["comida","ensalada","ligero"]'
  ((count++))
done

# Wraps (20)
for i in {1..20}; do
  fillings=("de pollo y lechuga" "de atún y maíz" "de pavo y queso" "de verduras y hummus" "de carne picada" "de salmón y aguacate" "de huevo y espinacas" "de gambas y mayonesa" "de falafel" "de kebab" "de burrito mexicano" "de fajitas" "de shawarma" "de gyros" "de sushi" "de primavera" "de espinacas y queso" "de champiñones" "de bacon y huevo" "de jamón y queso")
  filling=${fillings[$((i-1))]}
  import_recipe "Wrap $filling" "Comida rápida y portátil" 15 380 32 28 14 "mercadona" '[{"item":"Tortilla de trigo","amount":"1 ud"},{"item":"Relleno","amount":"150g"}]' '["Calienta la tortilla","Prepara el relleno","Enrolla bien apretado"]' '["comida","wrap","portátil"]'
  ((count++))
done

# Bowls (20)
for i in {1..20}; do
  types=("Buddha bowl vegetariano" "Grain bowl con quinoa" "Poke bowl de salmón" "Acai bowl" "Smoothie bowl" "Ramen bowl" "Pho bowl" "Bibimbap" "Burrito bowl" "Sushi bowl" "Taco bowl" "Mediterranean bowl" "Mexican bowl" "Thai bowl" "Greek bowl" "Hawaiian bowl" "Italian bowl" "Indian bowl" "Chinese bowl" "Japanese bowl")
  type=${types[$((i-1))]}
  import_recipe "$type" "Comida completa en un bowl" 20 450 35 55 15 "lidl" '[{"item":"Base de grano","amount":"100g"},{"item":"Proteína","amount":"120g"},{"item":"Verduras","amount":"150g"}]' '["Prepara la base","Añade proteína","Decora con verduras"]' '["comida","bowl","completo"]'
  ((count++))
done

# Carne (20)
for i in {1..20}; do
  meats=("Ternera" "Cerdo" "Cordero" "Pavo" "Pato" "Venado" "Jabalí" "Buey" "Avestruz" "Caballo")
  meat=${meats[$((i % 10))]}
  styles=("a la plancha" "al horno" "en salsa" "estofado" "a la brasa" "encebollado" "con tomate" "al vino tinto" "con champiñones" "con patatas" "con pimientos" "con cebolla" "con ajo" "al romero" "con mostaza" "con miel" "al curry" "con soja" "con especias" "con hierbas")
  style=${styles[$((i % 20))]}
  import_recipe "$meat $style" "Comida con carne roja" 35 580 42 45 22 "mercadona" '[{"item":"'$meat'","amount":"200g"},{"item":"Guarnición","amount":"200g"}]' '["Sazona la carne","Cocina según estilo","Sirve caliente"]' '["comida","carne","proteico"]'
  ((count++))
done

# Hamburguesas (15)
for i in {1..15}; do
  types=("de pollo" "de pavo" "de ternera" "de cordero" "de salmón" "de atún" "de lentejas" "de garbanzos" "de quinoa" "de champiñones" "de espinacas" "de soja" "de seitán" "de tofu" "mixta")
  type=${types[$((i-1))]}
  import_recipe "Hamburguesa $type" "Comida rápida casera" 20 480 35 42 18 "aldi" '[{"item":"Carne/vegana","amount":"180g"},{"item":"Pan","amount":"1 ud"},{"item":"Toppings","amount":"50g"}]' '["Forma la hamburguesa","Cocina a la plancha","Sirve en pan con toppings"]' '["comida","hamburguesa","proteico"]'
  ((count++))
done

echo "✅ $count comidas generadas"
echo ""
echo "🌙 Generando CENAS (100 recetas)..."

# Pescados cena (25)
for i in {1..25}; do
  fishes=("Merluza" "Lubina" "Dorada" "Bacalao" "Salmón" "Trucha" "Gallo" "Rape" "Bonito" "Sardinas" "Caballa" "Anchoas" "Rodaballo" "Emperador" "Pez espada" "Perca" "Eglefino" "Lenguado" "Mero" "Atún" "Bonito del norte" "Ventresca" "Kokotxas" "Angulas" "Gambas")
  fish=${fishes[$((i-1))]}
  styles=("al vapor" "al horno ligero" "a la plancha" "en papillote" "en salsa verde" "con verduras" "con patatas" "con arroz" "con ensalada" "en salsa de limón" "al ajillo" "en salsa de vino" "con pimientos" "con cebolla" "con tomate" "con espinacas" "con champiñones" "con calabacín" "con berenjena" "con guisantes" "con zanahoria" "con espárragos" "con alcachofas" "con puerros" "con hinojo")
  style=${styles[$((i % 25))]}
  import_recipe "$fish $style" "Cena ligera de pescado" 25 340 32 38 4 "lidl" '[{"item":"'$fish'","amount":"180g"},{"item":"Guarnición ligera","amount":"150g"}]' '["Prepara el pescado","Cocina suavemente","Sirve caliente"]' '["cena","pescado","ligero"]'
  ((count++))
done

# Tortillas (20)
for i in {1..20}; do
  fillings=("francesa" "de espinacas" "de champiñones" "de jamón y queso" "de atún" "de gambas" "de salmón" "de verduras" "de patatas" "de cebolla" "de pimientos" "de calabacín" "de berenjena" "de espinacas y queso" "de jamón serrano" "de chorizo" "de bacon" "de espárragos" "de alcachofas" "de setas")
  filling=${fillings[$((i-1))]}
  import_recipe "Tortilla $filling" "Cena ligera y proteica" 10 320 22 8 22 "mercadona" '[{"item":"Huevos","amount":"2 ud"},{"item":"'$filling'","amount":"80g"}]' '["Bate los huevos","Añade el relleno","Cuaja en sartén"]' '["cena","tortilla","proteico"]'
  ((count++))
done

# Verduras rellenas (20)
for i in {1..20}; do
  veggies=("Calabacín" "Pimiento" "Berenjena" "Tomate" "Cebolla" "Calabaza" "Champiñón" "Endivia" "Acelga" "Cardo" "Alcachofa" "Puerro" "Hinojo" "Col" "Repollo" "Brócoli" "Coliflor" "Coles de Bruselas" "Boniato" "Patata")
  veggie=${veggies[$((i-1))]}
  fillings=("de carne picada" "de atún" "de queso" "de verduras" "de arroz" "de quinoa" "de couscous" "de bulgur" "de mijo" "de trigo" "de pollo" "de pavo" "de gambas" "de salmón" "de bacalao" "de merluza" "de lentejas" "de garbanzos" "de alubias" "de soja")
  filling=${fillings[$((i % 20))]}
  import_recipe "$veggie relleno $filling" "Cena vegetariana completa" 35 280 18 32 10 "mercadona" '[{"item":"'$veggie'","amount":"200g"},{"item":"Relleno","amount":"100g"}]' '["Vacía la verdura","Rellena con la mezcla","Hornea 25 minutos"]' '["cena","verduras","relleno"]'
  ((count++))
done

# Cremas (15)
for i in {1..15}; do
  soups=("de calabaza" "de zanahoria" "de calabacín" "de tomate" "de puerro" "de espinacas" "de brócoli" "de coliflor" "de champiñones" "de cebolla" "de ajo" "de guisantes" "de judías verdes" "de alcachofas" "de boniato")
  soup=${soups[$((i-1))]}
  import_recipe "Crema $soup" "Cena ligera y reconfortante" 25 180 8 28 6 "aldi" '[{"item":"Verdura principal","amount":"300g"},{"item":"Caldo","amount":"500ml"}]' '["Cuece las verduras","Tritura con caldo","Sirve caliente"]' '["cena","crema","ligero"]'
  ((count++))
done

# Salteados (20)
for i in {1..20}; do
  bases=("Verduras variadas" "Champiñones" "Espárragos" "Calabacín" "Berenjena" "Pimientos" "Cebolla" "Tomate" "Espinacas" "Acelgas" "Judías verdes" "Guisantes" "Zanahoria" "Col" "Repollo" "Brócoli" "Coliflor" "Coles de Bruselas" "Alcachofas" "Puerros")
  base=${bases[$((i-1))]}
  proteins=("con pollo" "con pavo" "con ternera" "con cerdo" "con gambas" "con salmón" "con atún" "con bacalao" "con merluza" "con sepia" "con calamares" "con almejas" "con mejillones" "con tofu" "con seitán" "con tempeh" "con huevo" "con jamón" "con bacon" "con chorizo")
  protein=${proteins[$((i % 20))]}
  import_recipe "Salteado de $base $protein" "Cena rápida y saludable" 15 280 25 18 12 "lidl" '[{"item":"'$base'","amount":"200g"},{"item":"'$protein'","amount":"120g"}]' '["Corta los ingredientes","Saltea en wok o sartén","Sirve caliente"]' '["cena","salteado","rápido"]'
  ((count++))
done

echo "✅ $count cenas generadas"
echo ""
echo "🍿 Generando SNACKS (100 recetas)..."

# Frutos secos (25)
for i in {1..25}; do
  nuts=("Almendras" "Nueces" "Anacardos" "Pistachos" "Avellanas" "Nueces de macadamia" "Nueces de pecana" "Piñones" "Cacahuetes" "Semillas de girasol" "Semillas de calabaza" "Semillas de sésamo" "Semillas de chía" "Semillas de lino" "Semillas de cáñamo" "Mezcla de frutos secos" "Mezcla de semillas" "Mezcla energética" "Mezcla deportiva" "Mezcla de estudiante" "Almendras tostadas" "Nueces caramelizadas" "Cacahuetes salados" "Pistachos tostados" "Anacardos picantes")
  nut=${nuts[$((i-1))]}
  import_recipe "$nut" "Snack energético" 1 200 8 8 18 "familycash" '[{"item":"'$nut'","amount":"30g"}]' '["Come directamente del puñado"]' '["snack","energia","frutos-secos"]'
  ((count++))
done

# Yogures (20)
for i in {1..20}; do
  bases=("Yogur griego" "Skyr" "Quark" "Yogur natural" "Yogur de coco" "Kéfir" "Requesón" "Mascarpone" "Ricotta" "Fromage frais" "Petit suisse" "Danone" "Activia" "Gervais" "Bonne Maman" "Yoplait" "Müller" "Oikos" "Fage" "Chobani")
  base=${bases[$((i % 20))]}
  toppings=("con miel" "con granola" "con frutos rojos" "con plátano" "con manzana" "con pera" "con melocotón" "con mango" "con piña" "con coco" "con chocolate" "con cacao" "con canela" "con jengibre" "con nueces" "con almendras" "con pistachos" "con avellanas" "con semillas" "con cereales")
  top=${toppings[$((i % 20))]}
  import_recipe "Yogur $base $top" "Snack saludable" 3 220 12 24 10 "mercadona" '[{"item":"'$base'","amount":"150g"},{"item":"'$top'","amount":"30g"}]' '["Pon yogur en bowl","Añade toppings","Disfruta"]' '["snack","saludable","proteico"]'
  ((count++))
done

# Batidos pequeños (20)
for i in {1..20}; do
  flavors=("Plátano" "Fresa" "Mango" "Piña" "Coco" "Melocotón" "Manzana" "Pera" "Naranja" "Limón" "Lima" "Sandía" "Melón" "Uva" "Cereza" "Arándanos" "Frambuesa" "Mora" "Kiwi" "Papaya")
  flavor=${flavors[$((i-1))]}
  import_recipe "Mini batido de $flavor" "Snack refrescante" 5 180 8 28 4 "familycash" '[{"item":"Fruta '$flavor'","amount":"150g"},{"item":"Leche o agua","amount":"100ml"}]' '["Tritura la fruta","Añade líquido","Sirve frío"]' '["snack","batido","refrescante"]'
  ((count++))
done

# Tostadas mini (15)
for i in {1..15}; do
  toppings=("con tomate" "con aguacate" "con queso" "con jamón" "con pavo" "con atún" "con salmón" "con huevo" "con mantequilla" "con miel" "con mermelada" "con Nutella" "con queso crema" "con hummus" "con pesto")
  top=${toppings[$((i-1))]}
  import_recipe "Mini tostada $top" "Snack crujiente" 5 150 6 28 2 "mercadona" '[{"item":"Pan integral","amount":"1 rebanada"},{"item":"'$top'","amount":"30g"}]' '["Tuesta el pan","Unta el topping","Disfruta"]' '["snack","tostada","crujiente"]'
  ((count++))
done

# Fruta con acompañamientos (20)
for i in {1..20}; do
  fruits=("Manzana" "Pera" "Plátano" "Naranja" "Mandarina" "Pomelo" "Limón" "Lima" "Melón" "Sandía" "Uva" "Cereza" "Fresa" "Frambuesa" "Mora" "Arándano" "Kiwi" "Mango" "Piña" "Papaya")
  fruit=${fruits[$((i-1))]}
  companions=("con yogur" "con queso" "con chocolate" "con miel" "con canela" "con nueces" "con almendras" "con pistachos" "con avellanas" "con coco" "con granola" "con cereales" "con helado" "con nata" "con caramelo" "con limón" "con jengibre" "con menta" "con albahaca" "con romero")
  comp=${companions[$((i % 20))]}
  import_recipe "$fruit $comp" "Snack natural" 5 160 6 32 2 "lidl" '[{"item":"'$fruit'","amount":"150g"},{"item":"'$comp'","amount":"30g"}]' '["Prepara la fruta","Añade acompañamiento","Disfruta"]' '["snack","fruta","natural"]'
  ((count++))
done

echo ""
echo "=========================================="
echo "✅ GENERACIÓN COMPLETADA"
echo "=========================================="
echo "📊 Total recetas creadas: $count"
echo "📍 Proyecto: Diet Tracker"
echo "🔗 Supabase: https://vvtgpztnytpxoacoflas.supabase.co"
echo ""
echo "📊 Verifica en: https://supabase.com/dashboard/project/vvtgpztnytpxoacoflas/table-editor/auth/recipes"
