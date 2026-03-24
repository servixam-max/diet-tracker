const fs = require('fs');
const content = fs.readFileSync('src/data/recipes.ts', 'utf8');

// Split by recipe objects (each starts with { and ends with })
const recipePattern = /\{\s*id: "extra-\d+",[\s\S]*?mealType: \[[\s\S]*?\][\s\n]*\}/g;
const matches = content.match(recipePattern);

if (!matches) {
  console.log('No recipes found');
  process.exit(1);
}

const fixedRecipes = matches.map(recipe => {
  // Remove duplicate description properties
  const lines = recipe.split('\n');
  const result = [];
  let foundDescription = false;
  
  for (const line of lines) {
    if (line.includes('description:')) {
      if (foundDescription) {
        continue; // Skip duplicate
      }
      foundDescription = true;
    }
    result.push(line);
  }
  
  return result.join('\n');
});

// Replace in content
let newContent = content;
for (let i = 0; i < matches.length; i++) {
  newContent = newContent.replace(matches[i], fixedRecipes[i]);
}

fs.writeFileSync('src/data/recipes.ts', newContent);
console.log(`Fixed ${matches.length} recipes`);
