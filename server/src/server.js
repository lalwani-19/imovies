require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
================================================================================
  iMovies API Server running on port ${PORT} in [${process.env.NODE_ENV || 'development'}] mode
  Health check: http://localhost:${PORT}/api/health
  API Base:     http://localhost:${PORT}/api
================================================================================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Keep server running in development to avoid crash loops
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});

// Handle termination signals
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});

