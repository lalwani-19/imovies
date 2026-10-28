const mongoose = require('mongoose');

const ticketTierSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Standard', 'Premium', 'VIP'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  rows: {
    type: [String],
    required: true, // e.g., ['A', 'B'] for VIP, ['C', 'D', 'E'] for Premium, ['F', 'G', 'H'] for Standard
  },
});

const bookedSeatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
      index: true,
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required'],
      index: true,
    },
    screenNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    screenName: {
      type: String,
      default: 'Audi 1 - Dolby Atmos',
    },
    showDateTime: {
      type: Date,
      required: [true, 'Show date and time is required'],
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    startTime: {
      type: String, // HH:mm format, e.g. "19:30"
      required: true,
    },
    ticketTiers: [ticketTierSchema],
    bookedSeats: [bookedSeatSchema],
    totalSeats: {
      type: Number,
      required: true,
      default: 80,
    },
    availableSeats: {
      type: Number,
      required: true,
      default: 80,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for quick lookup of shows by movie and date
showSchema.index({ movie: 1, date: 1, status: 1 });
showSchema.index({ theatre: 1, date: 1 });

module.exports = mongoose.model('Show', showSchema);
