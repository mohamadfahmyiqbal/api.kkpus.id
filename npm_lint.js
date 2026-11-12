const { execSync } = require('child_process');
console.log('Running npm run lint:fix...');
const result = execSync('npm run lint:fix', { encoding: 'utf8', timeout: 300000 });
console.log(result);
console.log('Lint fix completed successfully');