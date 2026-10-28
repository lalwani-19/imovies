const Show = require('../models/Show');
const Theatre = require('../models/Theatre');
const Movie = require('../models/Movie');

// @desc    Get all shows with optional filters
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
  try {
    const { movie, theatre, date, status = 'active' } = req.query;
    const query = { status };

    if (movie) query.movie = movie;
    if (theatre) query.theatre = theatre;
    if (date) query.date = date;

    const shows = await Show.find(query)
      .populate('movie', 'title posterUrl duration language certificate genre')
      .populate('theatre', 'name city address amenities')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show details
// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theatre');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.status(200).json({
      success: true,
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seat layout and live seat availability for a show
// @route   GET /api/shows/:id/seats
// @access  Public
exports.getShowSeats = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie', 'title posterUrl duration language certificate')
      .populate('theatre', 'name city address');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    // Map booked seat numbers for fast O(1) lookup
    const bookedSeatSet = new Set(
      show.bookedSeats.map((b) => b.seatNumber.toUpperCase())
    );

    // Build row layout (Rows A to H, 10 columns per row)
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = 10;

    // Helper to find category and price for a row
    const getTierForRow = (rowLetter) => {
      for (const tier of show.ticketTiers) {
        if (tier.rows.includes(rowLetter)) {
          return { category: tier.category, price: tier.price };
        }
      }
      return { category: 'Standard', price: 180 };
    };

    const layout = rowLabels.map((rowLetter) => {
      const { category, price } = getTierForRow(rowLetter);
      const seats = [];

      for (let col = 1; col <= cols; col++) {
        const seatId = `${rowLetter}${col}`;
        const isBooked = bookedSeatSet.has(seatId);

        seats.push({
          id: seatId,
          seatNumber: seatId,
          row: rowLetter,
          number: col,
          category,
          price,
          isBooked,
        });
      }

      return {
        rowLabel: rowLetter,
        category,
        price,
        seats,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        showId: show._id,
        movie: show.movie,
        theatre: show.theatre,
        date: show.date,
        startTime: show.startTime,
        screenName: show.screenName,
        totalSeats: show.totalSeats,
        bookedCount: bookedSeatSet.size,
        availableSeats: show.totalSeats - bookedSeatSet.size,
        ticketTiers: show.ticketTiers,
        layout,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new show (Admin only)
// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = async (req, res, next) => {
  try {
    const {
      movie,
      theatre,
      screenNumber = 1,
      screenName = 'Screen 1 - Dolby Atmos',
      showDateTime,
      date,
      startTime,
      ticketTiers,
      totalSeats = 80,
    } = req.body;

    // Default ticket tiers if none provided
    const tiers = ticketTiers || [
      { category: 'VIP', price: 350, rows: ['A', 'B'] },
      { category: 'Premium', price: 250, rows: ['C', 'D', 'E'] },
      { category: 'Standard', price: 180, rows: ['F', 'G', 'H'] },
    ];

    const show = await Show.create({
      movie,
      theatre,
      screenNumber,
      screenName,
      showDateTime: new Date(showDateTime || `${date}T${startTime}:00`),
      date,
      startTime,
      ticketTiers: tiers,
      totalSeats,
      availableSeats: totalSeats,
      bookedSeats: [],
    });

    res.status(201).json({
      success: true,
      message: 'Show created successfully',
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a show (Admin only)
// @route   DELETE /api/shows/:id
// @access  Private/Admin
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    await Show.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Show removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

