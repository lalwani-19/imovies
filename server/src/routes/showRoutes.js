const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowById,
  getShowSeats,
  createShow,
  deleteShow,
} = require('../controllers/showController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getShows)
  .post(protect, authorize('admin'), createShow);

router.route('/:id')
  .get(getShowById)
  .delete(protect, authorize('admin'), deleteShow);

router.get('/:id/seats', getShowSeats);

module.exports = router;

