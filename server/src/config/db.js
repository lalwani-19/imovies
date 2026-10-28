const mongoose = require('mongoose');

let mongodServerInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });

    console.log(`[MongoDB Connected]: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[Primary MongoDB Unavailable]: ${error.message}`);

    // If in development or testing mode and external MongoDB is unavailable,
    // seamlessly spin up an in-memory MongoDB instance so the app runs out-of-the-box!
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[Dev Mode]: Launching in-memory MongoDB runner...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongodServerInstance = await MongoMemoryServer.create();
        const memoryUri = mongodServerInstance.getUri();

        const conn = await mongoose.connect(memoryUri);
        console.log(`[In-Memory MongoDB Active]: ${memoryUri}`);

        // Automatically populate seed movies and test accounts if empty
        const Movie = require('../models/Movie');
        const count = await Movie.countDocuments();
        if (count === 0) {
          console.log('[Dev Mode]: Pre-populating seed movies and cinema showtimes...');
          const seedModule = require('../../scripts/seedData');
          if (seedModule && typeof seedModule.seedDataInline === 'function') {
            await seedModule.seedDataInline();
          }
        }

        return conn;
      } catch (memError) {
        console.error('[Memory DB Fallback Error]:', memError.message);
      }
    }

    console.warn(`
--------------------------------------------------------------------------------
[Database Connection Instructions]:
Could not connect to MongoDB at: ${uri}

If you are using MongoDB Atlas:
1. Make sure MONGODB_URI in server/.env is set to your Atlas cluster connection string.
2. In MongoDB Atlas, verify Network Access allows 0.0.0.0/0 (or your IP).
3. Ensure the database user password is correct and URL-encoded.

If you are using Local MongoDB:
1. Ensure the mongod service is running.
--------------------------------------------------------------------------------
    `);

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
