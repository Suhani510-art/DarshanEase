const Booking = require('../models/booking');
const { createBooking, cancelBooking } = require('../services/bookingService');


const book = async (req, res, next) => {
  try {
    const { templeId, slotId, numberOfPersons } = req.body;

   
    const booking = await createBooking({
      userId: req.user.id,
      templeId,
      slotId,
      numberOfPersons: parseInt(numberOfPersons),
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) { next(error); }
};


const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('templeId', 'name location image')
      .populate('slotId', 'date startTime endTime')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) { next(error); }
};


const cancel = async (req, res, next) => {
  try {
    const booking = await cancelBooking({
      bookingId: req.params.id,
      userId: req.user.id,
    });
    res.json({ success: true, data: booking });
  } catch (error) { next(error); }
};


const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('templeId', 'name')
      .populate('slotId', 'date startTime endTime')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) { next(error); }
};

module.exports = { book, getMyBookings, cancel, getAllBookings };