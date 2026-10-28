const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');

// Helper to calculate pricing based on show ticket tiers
const calculateBookingPricing = (show, seatNumbers) => {
  const getSeatTier = (rowLetter) => {
    for (const tier of show.ticketTiers) {
      if (tier.rows.includes(rowLetter)) {
        return { category: tier.category, price: tier.price };
      }
    }
    return { category: 'Standard', price: 180 };
  };

  const seatsWithDetails = seatNumbers.map((seatNum) => {
    const rowLetter = seatNum.charAt(0).toUpperCase();
    const tier = getSeatTier(rowLetter);
    return {
      seatNumber: seatNum.toUpperCase(),
      category: tier.category,
      price: tier.price,
    };
  });

  const subtotal = seatsWithDetails.reduce((sum, seat) => sum + seat.price, 0);
  const convenienceFee = Math.round(seatNumbers.length * 20); // 20 per ticket
  const tax = Math.round(convenienceFee * 0.18); // 18% GST on convenience fee
  const totalAmount = subtotal + convenienceFee + tax;

  return {
    seatsWithDetails,
    pricing: {
      subtotal,
      convenienceFee,
      tax,
      totalAmount,
    },
  };
};

// @desc    Create a new movie ticket booking with atomic seat reservation
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seats, paymentMethod = 'Demo Payment (Simulated)' } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid showId and at least one selected seat.',
      });
    }

    if (seats.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum seat limit per transaction is 10 tickets.',
      });
    }

    const show = await Show.findById(showId);
    if (!show || show.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Show not found or is no longer active for booking.',
      });
    }

    // Standardize seat format (e.g. "A1", "C5")
    const requestedSeats = seats.map((s) => s.trim().toUpperCase());

    // Check for duplicate seats in the request itself
    const uniqueSeats = new Set(requestedSeats);
    if (uniqueSeats.size !== requestedSeats.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate seats detected in booking request.',
      });
    }

    // Verify against current booked seats
    const currentBookedSet = new Set(
      show.bookedSeats.map((b) => b.seatNumber.toUpperCase())
    );
    const conflicts = requestedSeats.filter((seatNum) => currentBookedSet.has(seatNum));
    if (conflicts.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Seats already booked: ${conflicts.join(', ')}. Please choose other seats.`,
      });
    }

    // Recalculate price on the server - NEVER trust frontend prices
    const { seatsWithDetails, pricing } = calculateBookingPricing(show, requestedSeats);

    // Generate pre-allocated ObjectId for booking
    const bookingObjectId = new mongoose.Types.ObjectId();
    const bookingReference =
      'IM-' + Math.floor(100000 + Math.random() * 900000);

    const seatClaimObjects = requestedSeats.map((seatNum) => ({
      seatNumber: seatNum,
      bookingId: bookingObjectId,
      user: req.user._id,
      bookedAt: new Date(),
    }));

    // ATOMIC RESERVATION:
    // Only updates if NONE of requestedSeats exist in bookedSeats
    const atomicClaim = await Show.findOneAndUpdate(
      {
        _id: showId,
        'bookedSeats.seatNumber': { $nin: requestedSeats },
      },
      {
        $push: { bookedSeats: { $each: seatClaimObjects } },
        $inc: { availableSeats: -requestedSeats.length },
      },
      { new: true }
    );

    if (!atomicClaim) {
      return res.status(409).json({
        success: false,
        message:
          'One or more of the selected seats were just claimed by another user. Please select alternate seats.',
      });
    }

    // Persist booking record
    let booking;
    try {
      booking = await Booking.create({
        _id: bookingObjectId,
        bookingReference,
        user: req.user._id,
        show: show._id,
        movie: show.movie,
        theatre: show.theatre,
        seats: seatsWithDetails,
        seatCount: seatsWithDetails.length,
        pricing,
        payment: {
          status: 'completed',
          method: paymentMethod,
          paidAt: new Date(),
        },
        status: 'CONFIRMED',
        qrCodeData: JSON.stringify({
          ref: bookingReference,
          showId: show._id,
          seats: requestedSeats,
          verified: true,
        }),
      });
    } catch (saveError) {
      // Rollback atomic seat claim if booking document creation fails
      await Show.findByIdAndUpdate(showId, {
        $pull: { bookedSeats: { bookingId: bookingObjectId } },
        $inc: { availableSeats: requestedSeats.length },
      });
      throw saveError;
    }

    // Return populated booking
    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title posterUrl duration language certificate')
      .populate('theatre', 'name city address')
      .populate('show', 'date startTime screenName');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title posterUrl duration language certificate')
      .populate('theatre', 'name city address')
      .populate('show', 'date startTime screenName showDateTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking details by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie')
      .populate('theatre')
      .populate('show')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Authorization check: User can only see their own booking (or admin)
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only view your own bookings.',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an eligible booking and release seats
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('show');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Authorization check
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only cancel your own bookings.',
      });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.',
      });
    }

    // Cancellation policy: check if show date/time has passed
    if (booking.show && booking.show.showDateTime) {
      const showTime = new Date(booking.show.showDateTime).getTime();
      const now = Date.now();
      if (showTime <= now) {
        return res.status(400).json({
          success: false,
          message: 'Cancellation unavailable: Show has already started or elapsed.',
        });
      }
    }

    // Atomically release the seats belonging strictly to this booking
    await Show.findByIdAndUpdate(booking.show._id, {
      $pull: { bookedSeats: { bookingId: booking._id } },
      $inc: { availableSeats: booking.seatCount },
    });

    // Mark booking cancelled and calculate refund
    booking.status = 'CANCELLED';
    booking.payment.status = 'refunded';
    booking.cancellation = {
      cancelledAt: new Date(),
      reason: req.body.reason || 'User requested cancellation',
      refundAmount: booking.pricing.subtotal, // standard policy refunds subtotal
    };

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been released.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('movie', 'title posterUrl')
      .populate('theatre', 'name city')
      .populate('user', 'name email')
      .populate('show', 'date startTime')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
