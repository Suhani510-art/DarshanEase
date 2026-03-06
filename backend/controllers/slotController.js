const DarshanSlot = require('../models/darshanslot');
const Temple = require('../models/temple');


const getSlots = async (req, res, next) => {
  try {
    const filter = req.query.templeId ? { templeId: req.query.templeId } : {};
    const slots = await DarshanSlot.find(filter).sort({ date: 1, startTime: 1 });
    res.json({ success: true, count: slots.length, data: slots });
  } catch (error) { next(error); }
};


const createSlot = async (req, res, next) => {
  try {
    const { templeId, date, startTime, endTime, capacity } = req.body;

    
    const temple = await Temple.findById(templeId);
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });

    if (
      req.user.role !== 'ADMIN' &&
      temple.organizerId.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized for this temple' });
    }

    const slot = await DarshanSlot.create({ templeId, date, startTime, endTime, capacity });
    res.status(201).json({ success: true, data: slot });
  } catch (error) { next(error); }
};


const deleteSlot = async (req, res, next) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });

    if (req.user.role !== 'ADMIN') {
      const temple = await Temple.findById(slot.templeId);
      if (temple.organizerId.toString() !== req.user.id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    }

    await slot.deleteOne();
    res.json({ success: true, message: 'Slot deleted' });
  } catch (error) { next(error); }
};

module.exports = { getSlots, createSlot, deleteSlot };
