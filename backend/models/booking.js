const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
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
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DarshanSlot',
      required: true,
    },
    numberOfPersons: {
      type: Number,
      required: [true, 'Number of persons is required'],
      min: [1, 'At least 1 person required'],
      max: [10, 'Maximum 10 persons per booking'],
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);