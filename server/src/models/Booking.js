const mongoose = require('mongoose');

const bookedSeatDetailSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
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
});

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: [true, 'Show reference is required'],
      index: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required'],
    },
    seats: [bookedSeatDetailSchema],
    seatCount: {
      type: Number,
      required: true,
      min: [1, 'At least 1 seat must be booked'],
    },
    pricing: {
      subtotal: {
        type: Number,
        required: true,
      },
      convenienceFee: {
        type: Number,
        required: true,
        default: 30, // standard booking fee
      },
      tax: {
        type: Number,
        required: true,
        default: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
    },
    payment: {
      status: {
        type: String,
        enum: ['completed', 'pending', 'refunded'],
        default: 'completed',
      },
      method: {
        type: String,
        default: 'Demo Payment (Simulated)',
      },
      transactionId: {
        type: String,
        default: () => 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      },
      paidAt: {
        type: Date,
        default: Date.now,
      },
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
      index: true,
    },
    cancellation: {
      cancelledAt: Date,
      reason: String,
      refundAmount: Number,
    },
    qrCodeData: {
      type: String, // verification payload or ticket identifier
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
