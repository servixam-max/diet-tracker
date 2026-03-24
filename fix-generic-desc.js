const fs = require('fs');
const content = fs.readFileSync('src/data/recipes.ts', 'utf8');
const lines = content.split('\n');
const result = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const nextLine = lines[i + 1];
  const lineAfterNext = lines[i + 2];
  
  // Pattern: description (generic) -> name -> description (original)
  // Remove the first generic description
  if (line.includes('description: "Receta deliciosa') && 
      nextLine && nextLine.includes('name:') &&
      lineAfterNext && lineAfterNext.includes('description:') &&
      !lineAfterNext.includes('Receta deliciosa')) {
    continue; // Skip the generic description
  }
  
  result.push(line);
}

fs.writeFileSync('src/data/recipes.ts', result.join('\n'));
console.log('Fixed generic descriptions');
