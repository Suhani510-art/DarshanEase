const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getTemples, getTemple, createTemple, updateTemple, deleteTemple
} = require('../controllers/templeController');

router.get('/', getTemples);
router.get('/:id', getTemple);


router.post('/', protect, authorize('ADMIN'), createTemple);
router.put('/:id', protect, authorize('ADMIN'), updateTemple);
router.delete('/:id', protect, authorize('ADMIN'), deleteTemple);

module.exports = router;