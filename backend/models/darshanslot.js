const mongoose = require('mongoose');

const darshanSlotSchema = new mongoose.Schema(
  {
    templeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Temple',
      required: [true, 'Temple is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    startTime: {
      type: String, 
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String, 
      required: [true, 'End time is required'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },

    bookedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);


darshanSlotSchema.virtual('availableSlots').get(function () {
  return this.capacity - this.bookedCount;
});

darshanSlotSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('DarshanSlot', darshanSlotSchema);