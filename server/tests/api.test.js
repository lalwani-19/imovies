const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Movie = require('../src/models/Movie');
const Theatre = require('../src/models/Theatre');
const Show = require('../src/models/Show');
const Booking = require('../src/models/Booking');

describe('iMovies Full-Stack API Test Suite', () => {
  let mongod = null;
  let userToken = '';
  let userId = '';
  let testMovieId = '';
  let testTheatreId = '';
  let testShowId = '';
  let bookingId = '';

  before(async () => {
    // Spin up fast in-memory MongoDB for test isolation
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  });

  test('GET /api/health should return 200 and OK status', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'OK');
    assert.strictEqual(res.body.service, 'iMovies Ticket Booking API');
    assert.strictEqual(res.body.database, 'Connected');
  });

  test('Authentication Flow: Register, Login, Duplicate Prevention & Protected Route', async () => {
    // 1. Register new user
    const regRes = await request(app).post('/api/auth/register').send({
      name: 'Tester Smith',
      email: 'tester@test.com',
      password: 'password123',
      phone: '1234567890',
    });

    assert.strictEqual(regRes.statusCode, 201);
    assert.strictEqual(regRes.body.success, true);
    assert.ok(regRes.body.token);
    assert.strictEqual(regRes.body.user.email, 'tester@test.com');
    userToken = regRes.body.token;
    userId = regRes.body.user.id;

    // 2. Reject duplicate registration with same email
    const dupRes = await request(app).post('/api/auth/register').send({
      name: 'Tester Smith',
      email: 'tester@test.com',
      password: 'password123',
    });
    assert.strictEqual(dupRes.statusCode, 400);

    // 3. Reject invalid credentials
    const failLogin = await request(app).post('/api/auth/login').send({
      email: 'tester@test.com',
      password: 'wrongpassword',
    });
    assert.strictEqual(failLogin.statusCode, 401);

    // 4. Valid login
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'tester@test.com',
      password: 'password123',
    });
    assert.strictEqual(loginRes.statusCode, 200);
    assert.ok(loginRes.body.token);

    // 5. Access protected route /api/auth/me with Bearer token
    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);
    assert.strictEqual(meRes.statusCode, 200);
    assert.strictEqual(meRes.body.user.email, 'tester@test.com');

    // 6. Access protected route without token must return 401
    const noAuthRes = await request(app).get('/api/auth/me');
    assert.strictEqual(noAuthRes.statusCode, 401);
  });

  test('Movie, Theatre, and Showtime Catalog APIs', async () => {
    // Create test movie
    const movie = await Movie.create({
      title: 'Interstellar Odyssey',
      description: 'An epic journey across the cosmos to save humanity.',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401',
      genre: ['Sci-Fi', 'Adventure'],
      duration: 165,
      language: 'English',
      releaseDate: new Date('2025-01-01'),
      rating: 9.1,
      status: 'now-showing',
      certificate: 'UA',
    });
    testMovieId = movie._id.toString();

    // Create test theatre
    const theatre = await Theatre.create({
      name: 'Starlight Multiplex',
      city: 'Delhi NCR',
      address: 'Sector 18, Noida',
      screens: [{ screenNumber: 1, name: 'Screen 1 - Dolby Atmos', totalSeats: 80 }],
    });
    testTheatreId = theatre._id.toString();

    // Create test show
    const show = await Show.create({
      movie: movie._id,
      theatre: theatre._id,
      screenNumber: 1,
      screenName: 'Screen 1 - Dolby Atmos',
      showDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      date: '2026-10-28',
      startTime: '19:00',
      ticketTiers: [
        { category: 'VIP', price: 350, rows: ['A', 'B'] },
        { category: 'Premium', price: 250, rows: ['C', 'D'] },
        { category: 'Standard', price: 180, rows: ['E', 'F'] },
      ],
      totalSeats: 60,
      availableSeats: 60,
      bookedSeats: [],
    });
    testShowId = show._id.toString();

    // Test GET /api/movies
    const moviesRes = await request(app).get('/api/movies');
    assert.strictEqual(moviesRes.statusCode, 200);
    assert.ok(moviesRes.body.data.length >= 1);

    // Test GET /api/movies/:id
    const singleMovieRes = await request(app).get(`/api/movies/${testMovieId}`);
    assert.strictEqual(singleMovieRes.statusCode, 200);
    assert.strictEqual(singleMovieRes.body.data.title, 'Interstellar Odyssey');

    // Test GET /api/theatres
    const theatresRes = await request(app).get('/api/theatres');
    assert.strictEqual(theatresRes.statusCode, 200);
    assert.ok(theatresRes.body.data.length >= 1);

    // Test GET /api/shows/:id/seats
    const seatsRes = await request(app).get(`/api/shows/${testShowId}/seats`);
    assert.strictEqual(seatsRes.statusCode, 200);
    assert.ok(seatsRes.body.data.layout);
    assert.strictEqual(seatsRes.body.data.availableSeats, 60);
    assert.strictEqual(seatsRes.body.data.bookedCount, 0);
  });

  test('Booking Flow: Atomic Seat Claim, Prevent Double-Booking, Price Recalculation, and Cancellation', async () => {
    // 1. Reserve seats B1 and B2 (VIP category, 350 each)
    const bookRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        showId: testShowId,
        seats: ['B1', 'B2'],
        paymentMethod: 'Demo Payment (Simulated)',
      });

    assert.strictEqual(bookRes.statusCode, 201);
    assert.strictEqual(bookRes.body.success, true);
    assert.strictEqual(bookRes.body.data.seatCount, 2);
    assert.strictEqual(bookRes.body.data.pricing.subtotal, 700); // 350 * 2
    assert.ok(bookRes.body.data.bookingReference.startsWith('IM-'));
    bookingId = bookRes.body.data._id;

    // 2. Concurrency / Collision Guard: Attempting to book seat B1 again MUST FAIL with 409 Conflict
    const conflictRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        showId: testShowId,
        seats: ['B1', 'B3'],
      });
    assert.strictEqual(conflictRes.statusCode, 409);

    // 3. Verify user's booking history
    const myBookingsRes = await request(app)
      .get('/api/bookings/my')
      .set('Authorization', `Bearer ${userToken}`);
    assert.strictEqual(myBookingsRes.statusCode, 200);
    assert.strictEqual(myBookingsRes.body.count, 1);
    assert.strictEqual(myBookingsRes.body.data[0].bookingReference, bookRes.body.data.bookingReference);

    // 4. Cancel booking and ensure seats are released back
    const cancelRes = await request(app)
      .patch(`/api/bookings/${bookingId}/cancel`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ reason: 'Plan changed' });

    assert.strictEqual(cancelRes.statusCode, 200);
    assert.strictEqual(cancelRes.body.data.status, 'CANCELLED');

    // 5. Rebooking previously cancelled seat B1 MUST now SUCCEED
    const rebookRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        showId: testShowId,
        seats: ['B1'],
      });
    assert.strictEqual(rebookRes.statusCode, 201);
  });
});

