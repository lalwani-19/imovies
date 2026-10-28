const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true, // e.g. "Screen 1 - Dolby Atmos", "Screen 2 - IMAX"
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 80,
  },
  seatLayout: {
    rows: {
      type: Number,
      default: 8, // A through H
    },
    columns: {
      type: Number,
      default: 10, // 1 through 10
    },
  },
});

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    screens: [screenSchema],
    amenities: {
      type: [String],
      default: ['4K Projection', 'Dolby Atmos', 'Recliner Seats', 'Snack Bar'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Theatre', theatreSchema);
