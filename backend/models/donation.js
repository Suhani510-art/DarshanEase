const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Minimum donation is ₹1'],
    },
    message: {
      type: String,
      default: '',
      maxlength: [200, 'Message cannot exceed 200 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);