require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { seedDataInline } = require('./seedData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';

async function runSeed() {
  let mongod = null;
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
      console.log('[Connected to Primary MongoDB successfully]');
    } catch (conErr) {
      console.warn(`[Local/Atlas Mongo not accessible]: ${conErr.message}`);
      console.log('[Dev Seeder]: Starting in-memory MongoDB runner to verify seed records...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log(`[Connected to In-Memory MongoDB]: ${memUri}`);
    }

    const { insertedMovies, insertedTheatres, insertedShows } = await seedDataInline();

    console.log(`
================================================================================
  Database Seeding Completed Successfully!
  - Movies Seeded:    ${insertedMovies.length}
  - Theatres Seeded:  ${insertedTheatres.length}
  - Shows Generated:  ${insertedShows.length}
  - Demo User:        alex@example.com / password123
  - Admin Account:    admin@imovies.com / adminpassword123
================================================================================
    `);

    await mongoose.connection.close();
    if (mongod) await mongod.stop();
    process.exit(0);
  } catch (error) {
    console.error('Seeding process encountered an error:', error);
    if (mongod) await mongod.stop();
    process.exit(1);
  }
}

runSeed();
