const { execSync } = require('child_process');
console.log('Running npm audit fix --force...');
const result = execSync('npm audit fix --force', { encoding: 'utf8', timeout: 300000 });
console.log(result);