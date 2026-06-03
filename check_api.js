const http = require('http');

http.get('http://localhost:5000/api/savings/penarikan/detail/13', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data);
  });
}).on('error', (err) => console.log('Error: ', err.message));
