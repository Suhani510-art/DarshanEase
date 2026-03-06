const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getSlots, createSlot, deleteSlot } = require('../controllers/slotController');

router.get('/', getSlots);   
router.post('/', protect, authorize('ORGANIZER', 'ADMIN'), createSlot);
router.delete('/:id', protect, authorize('ORGANIZER', 'ADMIN'), deleteSlot);

module.exports = router;