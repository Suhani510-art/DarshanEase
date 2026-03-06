const Donation = require('../models/donation');


const donate = async (req, res, next) => {
  try {
    const { templeId, amount, message } = req.body;
    const donation = await Donation.create({ userId: req.user.id, templeId, amount, message });
    res.status(201).json({ success: true, data: donation });
  } catch (error) { next(error); }
};

const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ userId: req.user.id })
      .populate('templeId', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: donations });
  } catch (error) { next(error); }
};


const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find()
      .populate('userId', 'name email')
      .populate('templeId', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: donations });
  } catch (error) { next(error); }
};

module.exports = { donate, getMyDonations, getAllDonations };