const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Temple name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/400x250?text=Temple',
    },
    
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organizer is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Temple', templeSchema);