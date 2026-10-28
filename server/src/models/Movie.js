const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
      trim: true,
    },
    posterUrl: {
      type: String,
      required: [true, 'Movie poster URL is required'],
    },
    backdropUrl: {
      type: String,
      default: '',
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
      index: true,
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration in minutes is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      index: true,
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [10, 'Rating cannot exceed 10'],
      index: true,
    },
    voteCount: {
      type: Number,
      default: 0,
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['now-showing', 'upcoming'],
      default: 'now-showing',
      index: true,
    },
    certificate: {
      type: String,
      enum: ['U', 'UA', 'A', 'PG-13', 'R', 'U/A 13+', 'U/A 16+'],
      default: 'UA',
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for title and description search
movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);

