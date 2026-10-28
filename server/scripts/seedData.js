const mongoose = require('mongoose');
const User = require('../src/models/User');
const Movie = require('../src/models/Movie');
const Theatre = require('../src/models/Theatre');
const Show = require('../src/models/Show');
const Booking = require('../src/models/Booking');

const moviesData = [
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520049.jpg',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    duration: 166,
    language: 'English',
    releaseDate: new Date('2024-03-01'),
    rating: 8.6,
    voteCount: 4820,
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    status: 'now-showing',
    certificate: 'UA',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    director: 'Denis Villeneuve',
    featured: true,
  },
  {
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral and political consequences of scientific discovery.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    genre: ['Biography', 'Drama', 'History'],
    duration: 180,
    language: 'English',
    releaseDate: new Date('2023-07-21'),
    rating: 8.9,
    voteCount: 9140,
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    status: 'now-showing',
    certificate: 'A',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    director: 'Christopher Nolan',
    featured: true,
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    genre: ['Animation', 'Action', 'Sci-Fi'],
    duration: 140,
    language: 'English',
    releaseDate: new Date('2023-06-02'),
    rating: 8.7,
    voteCount: 6500,
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    status: 'now-showing',
    certificate: 'U',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
    director: 'Joaquim Dos Santos, Kemp Powers',
    featured: true,
  },
  {
    title: 'Interstellar: 10th Anniversary IMAX',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers to find a new planet for humans.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/rAiYTsqJiOEZR08Lqp4Q8G99q96.jpg',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    duration: 169,
    language: 'English',
    releaseDate: new Date('2024-11-08'),
    rating: 8.7,
    voteCount: 19800,
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    status: 'now-showing',
    certificate: 'UA',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    director: 'Christopher Nolan',
    featured: false,
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    genre: ['Action', 'Crime', 'Drama'],
    duration: 152,
    language: 'English',
    releaseDate: new Date('2008-07-18'),
    rating: 9.0,
    voteCount: 29500,
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    status: 'now-showing',
    certificate: 'UA',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Gary Oldman'],
    director: 'Christopher Nolan',
    featured: false,
  },
  {
    title: 'Avatar: The Way of Water',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
    genre: ['Sci-Fi', 'Action', 'Adventure'],
    duration: 192,
    language: 'English',
    releaseDate: new Date('2022-12-16'),
    rating: 7.7,
    voteCount: 11200,
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
    status: 'now-showing',
    certificate: 'UA',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang'],
    director: 'James Cameron',
    featured: false,
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    duration: 148,
    language: 'English',
    releaseDate: new Date('2010-07-16'),
    rating: 8.8,
    voteCount: 34500,
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    status: 'now-showing',
    certificate: 'UA',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    director: 'Christopher Nolan',
    featured: false,
  },
  {
    title: 'Deadpool & Wolverine',
    description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary Deadpool behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1jv8uaC.jpg',
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    duration: 128,
    language: 'English',
    releaseDate: new Date('2024-07-26'),
    rating: 7.8,
    voteCount: 5600,
    trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
    status: 'now-showing',
    certificate: 'A',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Morena Baccarin'],
    director: 'Shawn Levy',
    featured: true,
  },
  {
    title: 'Mission: Impossible - The Final Reckoning',
    description: 'Our lives are the sum of our choices. Tom Cruise returns as Ethan Hunt in the breathtaking climactic installment of the iconic global action franchise.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/z53Dnd6c4WbLVbEThJyvdNuOxql.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg',
    genre: ['Action', 'Thriller', 'Adventure'],
    duration: 165,
    language: 'English',
    releaseDate: new Date('2025-05-23'),
    rating: 8.5,
    voteCount: 890,
    trailerUrl: 'https://www.youtube.com/watch?v=NOhDyUmT9z0',
    status: 'upcoming',
    certificate: 'UA',
    cast: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames', 'Simon Pegg'],
    director: 'Christopher McQuarrie',
    featured: true,
  },
  {
    title: 'Avengers: Secret Wars',
    description: 'The culmination of the Multiverse Saga where worlds collide, bringing Earth\'s mightiest heroes from across alternate realities together to battle the ultimate existential threat.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/mDFmQeTfcbEuzdXA62V2r9iVvV5.jpg',
    genre: ['Action', 'Sci-Fi', 'Fantasy'],
    duration: 180,
    language: 'English',
    releaseDate: new Date('2027-05-07'),
    rating: 9.2,
    voteCount: 150,
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    status: 'upcoming',
    certificate: 'UA',
    cast: ['Robert Downey Jr.', 'Benedict Cumberbatch', 'Tom Holland', 'Chris Hemsworth'],
    director: 'Anthony Russo, Joe Russo',
    featured: false,
  },
];

const theatresData = [
  {
    name: 'PVR Directors Cut - Ambience Mall',
    city: 'Delhi NCR',
    address: 'Ambience Mall, Vasant Kunj, New Delhi',
    screens: [
      { screenNumber: 1, name: 'Screen 1 - Gold Class IMAX', totalSeats: 80, seatLayout: { rows: 8, columns: 10 } },
      { screenNumber: 2, name: 'Screen 2 - Dolby Atmos 4K', totalSeats: 80, seatLayout: { rows: 8, columns: 10 } },
    ],
    amenities: ['IMAX Laser', 'Dolby Atmos', 'Plush Recliners', 'Gourmet Dining'],
  },
  {
    name: 'INOX Megaplex - Inorbit Mall',
    city: 'Mumbai',
    address: 'Link Road, Malad West, Mumbai',
    screens: [
      { screenNumber: 1, name: 'Audi 1 - Laser IMAX', totalSeats: 80, seatLayout: { rows: 8, columns: 10 } },
      { screenNumber: 2, name: 'Audi 2 - MX4D Motion', totalSeats: 80, seatLayout: { rows: 8, columns: 10 } },
    ],
    amenities: ['MX4D Motion', 'Dolby Atmos 7.1', 'Cafe & Lounge', 'Valet Parking'],
  },
  {
    name: 'Cinépolis VIP - Forum Shantiniketan',
    city: 'Bengaluru',
    address: 'Whitefield Main Road, Bengaluru',
    screens: [
      { screenNumber: 1, name: 'VIP Screen 1 - Dolby 3D', totalSeats: 80, seatLayout: { rows: 8, columns: 10 } },
      { screenNumber: 2, name: 'VIP Screen 2 - 4K Christie', totalSeats: 80, seatLayout: { rows: 8, columns: 10 } },
    ],
    amenities: ['VIP Recliners', 'Dolby Atmos', 'In-seat Butler Service', 'Free WiFi'],
  },
];

const formatDate = (date) => {
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
};

const seedDataInline = async () => {
  // Clear
  await Booking.deleteMany({});
  await Show.deleteMany({});
  await Theatre.deleteMany({});
  await Movie.deleteMany({});
  await User.deleteMany({});

  // Demo user and admin
  const demoUser = await User.create({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'password123',
    phone: '+91 9876543210',
    role: 'user',
  });

  const demoAdmin = await User.create({
    name: 'Admin Cinema Manager',
    email: 'admin@imovies.com',
    password: 'adminpassword123',
    phone: '+91 9998887776',
    role: 'admin',
  });

  const insertedMovies = await Movie.insertMany(moviesData);
  const insertedTheatres = await Theatre.insertMany(theatresData);

  const now = new Date();
  const showDates = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    showDates.push(d);
  }

  const showTimes = ['10:30', '14:00', '17:30', '21:00'];
  const nowShowingMovies = insertedMovies.filter((m) => m.status === 'now-showing');

  const standardTiers = [
    { category: 'VIP', price: 350, rows: ['A', 'B'] },
    { category: 'Premium', price: 250, rows: ['C', 'D', 'E'] },
    { category: 'Standard', price: 180, rows: ['F', 'G', 'H'] },
  ];

  const showsToCreate = [];

  for (const movie of nowShowingMovies) {
    for (const theatre of insertedTheatres) {
      for (const dateObj of showDates) {
        const dateStr = formatDate(dateObj);
        const selectedTimes = showTimes.slice(0, 2);

        for (const timeStr of selectedTimes) {
          const [hours, minutes] = timeStr.split(':');
          const showDateTime = new Date(dateObj);
          showDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

          showsToCreate.push({
            movie: movie._id,
            theatre: theatre._id,
            screenNumber: 1,
            screenName: theatre.screens[0].name,
            showDateTime,
            date: dateStr,
            startTime: timeStr,
            ticketTiers: standardTiers,
            bookedSeats: [],
            totalSeats: 80,
            availableSeats: 80,
            status: 'active',
          });
        }
      }
    }
  }

  const insertedShows = await Show.insertMany(showsToCreate);

  // Demo initial booking
  if (insertedShows.length > 0) {
    const sampleShow = insertedShows[0];
    const sampleSeats = [
      { seatNumber: 'C4', category: 'Premium', price: 250 },
      { seatNumber: 'C5', category: 'Premium', price: 250 },
    ];

    const bookingObjectId = new mongoose.Types.ObjectId();
    await Show.findByIdAndUpdate(sampleShow._id, {
      $push: {
        bookedSeats: {
          $each: sampleSeats.map((s) => ({
            seatNumber: s.seatNumber,
            bookingId: bookingObjectId,
            user: demoUser._id,
            bookedAt: new Date(),
          })),
        },
      },
      $inc: { availableSeats: -sampleSeats.length },
    });

    await Booking.create({
      _id: bookingObjectId,
      bookingReference: 'IM-824915',
      user: demoUser._id,
      show: sampleShow._id,
      movie: sampleShow.movie,
      theatre: sampleShow.theatre,
      seats: sampleSeats,
      seatCount: 2,
      pricing: {
        subtotal: 500,
        convenienceFee: 40,
        tax: 7,
        totalAmount: 547,
      },
      payment: {
        status: 'completed',
        method: 'Demo Payment (Simulated)',
        paidAt: new Date(),
      },
      status: 'CONFIRMED',
      qrCodeData: JSON.stringify({
        ref: 'IM-824915',
        showId: sampleShow._id,
        seats: ['C4', 'C5'],
        verified: true,
      }),
    });
  }

  return { insertedMovies, insertedTheatres, insertedShows };
};

module.exports = { seedDataInline, moviesData, theatresData };
