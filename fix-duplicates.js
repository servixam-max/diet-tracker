const fs = require('fs');
const content = fs.readFileSync('src/data/recipes.ts', 'utf8');
const lines = content.split('\n');
let result = [];

for (let i = 0; i < lines.length; i++) {
  // Skip duplicate description lines
  if (lines[i].includes('description:') && i > 0 && lines[i-1].includes('description:')) {
    continue;
  }
  result.push(lines[i]);
}

fs.writeFileSync('src/data/recipes.ts', result.join('\n'));
console.log('Fixed duplicates');
