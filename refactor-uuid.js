import fs from 'fs';
import path from 'path';

const modelsDir = path.join(process.cwd(), 'models');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') && file !== 'index.js') {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Change DataTypes.STRING or DataTypes.STRING(something) to DataTypes.UUID
      const fieldRegex = /(\w+)\s*:\s*\{([^}]*)\}/g;
      content = content.replace(fieldRegex, (match, fieldName, block) => {
        let newBlock = block;
        
        if (fieldName.endsWith('_id') || fieldName.endsWith('Id') || fieldName === 'id' || fieldName === 'approval_id' || fieldName === 'member_id' || fieldName === 'financing_id') {
          newBlock = newBlock.replace(/type\s*:\s*DataTypes\.STRING(?:\(\d+\))?/, 'type: DataTypes.UUID');
        }
        
        return `${fieldName}: {${newBlock}}`;
      });

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Processed ${fullPath}`);
    }
  }
}

processDir(modelsDir);
console.log('Refactor pass 4 complete');
