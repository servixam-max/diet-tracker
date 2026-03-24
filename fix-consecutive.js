const fs = require('fs');
const content = fs.readFileSync('src/data/recipes.ts', 'utf8');
const lines = content.split('\n');
const result = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const nextLine = lines[i + 1];
  
  // If current line has description and next line also has description, skip current
  if (line.includes('description:') && nextLine && nextLine.includes('description:')) {
    continue;
  }
  
  result.push(line);
}

fs.writeFileSync('src/data/recipes.ts', result.join('\n'));
console.log('Fixed all duplicate descriptions');
