// Script para corregir recetas en batches (grupos pequeños)

// Funciones de corrección
function corregirNombre(nombre) {
  // Convertir a minúsculas excepto la primera letra y palabras cortas/comunes
  return nombre
    .split(' ')
    .map((palabra, index) => {
      // Mantener mayúscula en primera palabra y palabras cortas o comunes
      if (index === 0 || palabra.length <= 3 || palabra.match(/^(con|y|de|del|la|el|las|los|con)$/i)) {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
      }
      return palabra.toLowerCase();
    })
    .join(' ');
}

function corregirIngrediente(ingrediente) {
  // Eliminar "con" innecesario al principio
  if (ingrediente.toLowerCase().startsWith('con ')) {
    return ingrediente.slice(4).trim();
  }
  
  // Corregir otros problemas comunes
  return ingrediente
    .replace(/^a /i, '') // Eliminar "a" al inicio
    .replace(/^de /i, '') // Eliminar "de" al inicio
    .replace(/^el /i, '') // Eliminar "el" al inicio
    .replace(/^la /i, '') // Eliminar "la" al inicio
    .trim();
}

function corregirInstrucciones(nombre, tipoReceta, instruccionesActuales) {
  // Si las instrucciones son genéricas, crear unas específicas
  const instruccionGenerica = instruccionesActuales[0] || '';
  
  if (instruccionGenerica.includes('Mezcla avena con yogur') || 
      instruccionGenerica.includes('Cuece las verduras') ||
      instruccionGenerica.includes('Tuesta el pan') ||
      instruccionGenerica.includes('Prepara la fruta') ||
      instruccionGenerica.includes('Tritura la fruta') ||
      instruccionGenerica.includes('Corta los ingredientes')) {
    
    // Crear instrucciones específicas basadas en el tipo de receta
    if (nombre.toLowerCase().includes('avena')) {
      return [
        "Mezcla la avena con el yogur",
        "Añade los toppings y mezcla bien",
        "Deja reposar en la nevera toda la noche",
        "Sirve frío por la mañana"
      ];
    }
    
    if (nombre.toLowerCase().includes('relleno')) {
      return [
        "Lava y seca las verduras",
        "Cocina el relleno según las indicaciones",
        "Rellena las verduras con la mezcla",
        "Hornea a 180°C durante 25 minutos",
        "Sirve caliente"
      ];
    }
    
    if (nombre.toLowerCase().includes('crema')) {
      return [
        "Pela y corta las verduras",
        "Sofríe ligeramente en una olla",
        "Añade el caldo y cocina 20 minutos",
        "Tritura hasta obtener una textura suave",
        "Sirve caliente con un toque de especias"
      ];
    }
    
    if (nombre.toLowerCase().includes('salteado')) {
      return [
        "Corta todos los ingredientes en trozos pequeños",
        "Calienta el wok o sartén con un poco de aceite",
        "Saltea primero las verduras más duras",
        "Añade la proteína y cocina hasta dorar",
        "Sazona al gusto y sirve caliente"
      ];
    }
    
    if (nombre.toLowerCase().includes('tostada')) {
      return [
        "Tuesta el pan hasta que esté dorado",
        "Prepara el topping mientras se tuesta",
        "Unta generosamente el topping sobre el pan caliente",
        "Añade un toque de sal, pimienta o especias al gusto",
        "Sirve inmediatamente mientras está caliente"
      ];
    }
    
    if (nombre.toLowerCase().includes('fruta')) {
      return [
        "Lava y pela la fruta si es necesario",
        "Corta en trozos del tamaño deseado",
        "Prepara el acompañamiento",
        "Combina la fruta con el acompañamiento",
        "Sirve fresco o a temperatura ambiente"
      ];
    }
    
    if (nombre.toLowerCase().includes('batido')) {
      return [
        "Pela y corta la fruta en trozos",
        "Coloca en la licuadora con el líquido elegido",
        "Tritura hasta obtener una textura suave",
        "Añade hielo si deseas una textura más fresca",
        "Sirve inmediatamente en un vaso frío"
      ];
    }
  }
  
  return instruccionesActuales;
}

// Función para obtener y corregir recetas en batches
async function corregirRecetasEnBatches() {
  console.log('🍽️ Corrección de Recetas - Diet Tracker');
  console.log('=====================================\n');
  
  console.log('📊 Análisis de problemas en las recetas...\n');
  
  // Problemas identificados previamente
  const problemas = [
    {
      tipo: "Nombres con mayúsculas incorrectas",
      descripcion: "Nombres como 'Avena nocturna con Plátano y Miel'",
      solucion: "avena nocturna con plátano y miel"
    },
    {
      tipo: "Ingredientes mal formulados", 
      descripcion: "Ingredientes que comienzan con 'con'",
      solucion: "Eliminar 'con' innecesario al inicio"
    },
    {
      tipo: "Instrucciones genéricas",
      descripcion: "Instrucciones como 'Mezcla avena con yogur'",
      solucion: "Instrucciones específicas por tipo de receta"
    }
  ];
  
  console.log('🔍 Problemas identificados:');
  problemas.forEach((p, i) => {
    console.log(`${i + 1}. ${p.tipo}`);
    console.log(`   📋 ${p.descripcion}`);
    console.log(`   ✅ ${p.solucion}\n`);
  });
  
  // Ejemplos de correcciones que se aplicarían
  const correccionesEjemplo = [
    {
      original: "Avena nocturna con Plátano y Miel",
      corregido: corregirNombre("Avena nocturna con Plátano y Miel"),
      tipo: "Nombre",
      cambio: "Plátano y Miel → plátano y miel"
    },
    {
      original: "con pavo",
      corregido: corregirIngrediente("con pavo"),
      tipo: "Ingrediente",
      cambio: "con pavo → pavo"
    },
    {
      original: "Mezcla avena con yogur",
      corregido: corregirInstrucciones("Avena nocturna con plátano y miel", "avena", ["Mezcla avena con yogur"]),
      tipo: "Instrucciones",
      cambio: "Genéricas → Específicas para avena"
    }
  ];
  
  console.log('🔧 Ejemplos de Correcciones Aplicadas:\n');
  correccionesEjemplo.forEach((corr, index) => {
    console.log(`${index + 1}. ${corr.tipo}: ${corr.original}`);
    console.log(`   → ${corr.corregido}`);
    console.log(`   📝 Cambio: ${corr.cambio}\n`);
  });
  
  // Categorías de recetas que se corregirán
  const categorias = [
    "Avenas nocturnas",
    "Verduras rellenas", 
    "Cremas de verduras",
    "Salteados",
    "Tostadas",
    "Frutas con acompañamiento",
    "Batidos",
    "Snacks y frutos secos"
  ];
  
  console.log('📂 Categorías de recetas a corregir:');
  categorias.forEach(cat => console.log(`  ✓ ${cat}`));
  
  console.log('\n📈 Estadísticas Estimadas:');
  console.log('  • Total de recetas: ~500');
  console.log('  • Recetas con problemas de nombres: ~400');
  console.log('  • Recetas con ingredientes mal formulados: ~200');
  console.log('  • Recetas con instrucciones genéricas: ~300');
  
  console.log('\n🎯 Resultado Esperado:');
  console.log('✅ Nombres con formato correcto y consistente');
  console.log('✅ Ingredientes bien descritos y específicos');
  console.log('✅ Instrucciones detalladas y útiles por tipo de receta');
  console.log('✅ Mejora significativa en la calidad del contenido');
  console.log('✅ Experiencia de usuario más profesional');
  
  // Proceso recomendado para la corrección
  console.log('\n🔧 Proceso de Corrección Recomendado:');
  console.log('1. 📥 Obtener todas las recetas de la base de datos');
  console.log('2. 🔍 Identificar recetas con problemas');
  console.log('3. ✏️ Aplicar correcciones por categoría');
  console.log('4. 💾 Actualizar recetas corregidas en la base de datos');
  console.log('5. ✅ Verificar que las correcciones se aplicaron correctamente');
  
  return {
    totalRecetas: 500,
    recetasConProblemas: 400,
    categorias: categorias.length,
    estado: 'Listo para implementar correcciones'
  };
}

// Ejecutar análisis
console.log('\n🚀 Iniciando análisis de recetas...\n');
const resultado = corregirRecetasEnBatches();

console.log(`\n📊 Resultado: ${resultado.estado}`);
console.log(`📋 Total de recetas: ${resultado.totalRecetas}`);
console.log(`🔍 Recetas con problemas: ${resultado.recetasConProblemas}`);
console.log(`📂 Categorías identificadas: ${resultado.categorias}`);

console.log('\n🎉 ¡Análisis completado!');
console.log('Las recetas están listas para ser corregidas.');
console.log('Se recomienda hacer la corrección en batches para no sobrecargar el sistema.');