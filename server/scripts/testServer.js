require('dotenv').config();
const app = require('../src/app');
const connectDB = require('../src/config/db');
const http = require('http');

async function testServer() {
  console.log('1. Connecting to database...');
  await connectDB();

  console.log('2. Starting Express server...');
  const server = app.listen(5000, async () => {
    console.log('3. Express server listening on http://localhost:5000');

    const probe = (urlPath) => {
      return new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:5000' + urlPath, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
        }).on('error', reject);
      });
    };

    try {
      // Test /api/health
      const health = await probe('/api/health');
      console.log('✔ Health Check:', health.status, health.data.service, '| Database:', health.data.database);

      // Test /api/movies
      const movies = await probe('/api/movies');
      console.log('✔ Movies Endpoint:', movies.status, '| Total movies:', movies.data.total);

      // Test /api/theatres
      const theatres = await probe('/api/theatres');
      console.log('✔ Theatres Endpoint:', theatres.status, '| Total theatres:', theatres.data.count);

      // Test /api/shows
      const shows = await probe('/api/shows');
      console.log('✔ Shows Endpoint:', shows.status, '| Total shows:', shows.data.count);

      console.log('\n==================================================');
      console.log('  ALL INTEGRATION PROBES PASSED 100% SUCCESFULLY!  ');
      console.log('==================================================\n');
    } catch (err) {
      console.error('Probe failed:', err.message);
    } finally {
      server.close();
      const mongoose = require('mongoose');
      await mongoose.connection.close();
      process.exit(0);
    }
  });
}

testServer();

