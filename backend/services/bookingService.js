const mongoose = require('mongoose');
const DarshanSlot = require('../models/darshanslot');
const Booking = require('../models/booking');

// ─── createBooking ────────────────────────────────────────────
// Uses a Mongoose session + transaction to safely:
//   1. Check slot capacity
//   2. Increment bookedCount atomically
//   3. Create booking record
// This prevents race conditions when multiple users book simultaneously.
const createBooking = async ({ userId, templeId, slotId, numberOfPersons }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Lock the slot document inside the transaction session
    const slot = await DarshanSlot.findById(slotId).session(session);

    if (!slot) {
      throw Object.assign(new Error('Slot not found'), { statusCode: 404 });
    }

    // Validate there is enough capacity remaining
    const remaining = slot.capacity - slot.bookedCount;
    if (numberOfPersons > remaining) {
      throw Object.assign(
        new Error(`Only ${remaining} seats available in this slot.`),
        { statusCode: 400 }
      );
    }

    // Atomically increment bookedCount
    slot.bookedCount += numberOfPersons;
    await slot.save({ session });

    // Create the booking record inside the same transaction
    const [booking] = await Booking.create(
      [{ userId, templeId, slotId, numberOfPersons, status: 'CONFIRMED' }],
      { session }
    );

    // Commit transaction — both operations succeed together
    await session.commitTransaction();
    session.endSession();

    return booking;
  } catch (error) {
    // Rollback: if anything fails, undo all changes in this transaction
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// ─── cancelBooking ────────────────────────────────────────────
// Safely cancels a booking and decrements the slot's bookedCount.
const cancelBooking = async ({ bookingId, userId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId).session(session);

    if (!booking) {
      throw Object.assign(new Error('Booking not found'), { statusCode: 404 });
    }

    // Ensure the user owns this booking
    if (booking.userId.toString() !== userId.toString()) {
      throw Object.assign(new Error('Not authorized to cancel this booking'), { statusCode: 403 });
    }

    if (booking.status === 'CANCELLED') {
      throw Object.assign(new Error('Booking is already cancelled'), { statusCode: 400 });
    }

    // Decrement bookedCount on the slot
    await DarshanSlot.findByIdAndUpdate(
      booking.slotId,
      { $inc: { bookedCount: -booking.numberOfPersons } },
      { session }
    );

    // Mark booking as cancelled
    booking.status = 'CANCELLED';
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    return booking;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = { createBooking, cancelBooking };