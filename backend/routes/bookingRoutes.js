const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { book, getMyBookings, cancel, getAllBookings } = require('../controllers/bookingController');

router.post('/', protect, book);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancel);
router.get('/', protect, authorize('ADMIN'), getAllBookings);

module.exports = router;