const fs = require('fs');
const content = fs.readFileSync('src/data/recipes.ts', 'utf8');
const lines = content.split('\n');
let result = [];
let inRecipeObject = false;
let hasDescription = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('{') && line.includes('id:')) {
    inRecipeObject = true;
    hasDescription = false;
  }
  
  if (inRecipeObject && line.includes('}')) {
    inRecipeObject = false;
  }
  
  if (inRecipeObject && line.includes('description:')) {
    if (hasDescription) {
      // Skip duplicate
      continue;
    }
    hasDescription = true;
  }
  
  result.push(line);
}

fs.writeFileSync('src/data/recipes.ts', result.join('\n'));
console.log('Fixed duplicates properly');
