const Temple = require('../models/temple');


const getTemples = async (req, res, next) => {
  try {
    const temples = await Temple.find().populate('organizerId', 'name email');
    res.json({ success: true, count: temples.length, data: temples });
  } catch (error) { next(error); }
};


const getTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.params.id).populate('organizerId', 'name email');
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
    res.json({ success: true, data: temple });
  } catch (error) { next(error); }
};


const createTemple = async (req, res, next) => {
  try {
    const { name, location, description, image, organizerId } = req.body;
    const temple = await Temple.create({ name, location, description, image, organizerId });
    res.status(201).json({ success: true, data: temple });
  } catch (error) { next(error); }
};

const updateTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
    res.json({ success: true, data: temple });
  } catch (error) { next(error); }
};


const deleteTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findByIdAndDelete(req.params.id);
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
    res.json({ success: true, message: 'Temple deleted successfully' });
  } catch (error) { next(error); }
};

module.exports = { getTemples, getTemple, createTemple, updateTemple, deleteTemple };