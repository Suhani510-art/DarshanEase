const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { donate, getMyDonations, getAllDonations } = require('../controllers/donationController');

router.post('/', protect, donate);
router.get('/my', protect, getMyDonations);
router.get('/', protect, authorize('ADMIN'), getAllDonations);

module.exports = router;