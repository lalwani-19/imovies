const express = require('express');
const router = express.Router();
const {
  getTheatres,
  getTheatreById,
  createTheatre,
} = require('../controllers/theatreController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getTheatres)
  .post(protect, authorize('admin'), createTheatre);

router.route('/:id')
  .get(getTheatreById);

module.exports = router;
