const fs = require('fs');
const content = fs.readFileSync('src/data/recipes.ts', 'utf8');
const lines = content.split('\n');
let result = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id: "extra-') && !lines[i].includes('description:')) {
    const nextLine = lines[i+1];
    if (nextLine && nextLine.includes('name:')) {
      const name = nextLine.match(/name: "([^"]+)"/);
      if (name && name[1]) {
        result.push(lines[i]);
        result.push('    description: "Receta deliciosa y equilibrada.",');
        continue;
      }
    }
  }
  result.push(lines[i]);
}

fs.writeFileSync('src/data/recipes.ts', result.join('\n'));
console.log('Fixed');
