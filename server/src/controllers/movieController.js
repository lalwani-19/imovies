const Movie = require('../models/Movie');
const Show = require('../models/Show');

// @desc    Get all movies with search, filters, sorting & pagination
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  try {
    const { search, genre, language, status, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    // Search by title or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { cast: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Filter by genre
    if (genre && genre !== 'All') {
      query.genre = { $in: [genre] };
    }

    // Filter by language
    if (language && language !== 'All') {
      query.language = { $regex: new RegExp(`^${language}$`, 'i') };
    }

    // Filter by status (now-showing or upcoming)
    if (status && status !== 'All') {
      query.status = status;
    }

    // Sorting options
    let sortOption = { releaseDate: -1 };
    if (sort === 'rating_desc') {
      sortOption = { rating: -1 };
    } else if (sort === 'rating_asc') {
      sortOption = { rating: 1 };
    } else if (sort === 'title_asc') {
      sortOption = { title: 1 };
    } else if (sort === 'title_desc') {
      sortOption = { title: -1 };
    } else if (sort === 'release_newest') {
      sortOption = { releaseDate: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Extract unique genres and languages for frontend filter dropdowns
    const allGenres = await Movie.distinct('genre');
    const allLanguages = await Movie.distinct('language');

    res.status(200).json({
      success: true,
      count: movies.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      filterMeta: {
        genres: allGenres,
        languages: allLanguages,
      },
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shows for a specific movie (optionally filtered by date)
// @route   GET /api/movies/:id/shows
// @access  Public
exports.getMovieShows = async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = {
      movie: req.params.id,
      status: 'active',
    };

    if (date) {
      query.date = date;
    }

    const shows = await Show.find(query)
      .populate('theatre', 'name city address amenities')
      .populate('movie', 'title posterUrl duration language certificate')
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

// @desc    Create new movie (Admin only)
// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie (Admin only)
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie (Admin only)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Movie removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

