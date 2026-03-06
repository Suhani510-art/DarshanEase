/**
 * DarshanEase - Database Seeder
 * Run: node utils/seeder.js
 * This creates sample data for development/testing.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user');
const Temple = require('../models/temple');
const DarshanSlot = require('../models/darshanslot');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Temple.deleteMany({});
    await DarshanSlot.deleteMany({});
    console.log('Cleared existing data.');

    // ─── Create Users ───────────────────────────────────────────
    const adminUser = await User.create({
      name: 'Admin Sharma',
      email: 'admin@darshanease.com',
      password: 'admin123',
      role: 'ADMIN',
    });

    const organizer1 = await User.create({
      name: 'Pujari Ramesh',
      email: 'organizer@darshanease.com',
      password: 'organizer123',
      role: 'ORGANIZER',
    });

    const regularUser = await User.create({
      name: 'Devotee Priya',
      email: 'user@darshanease.com',
      password: 'user123',
      role: 'USER',
    });

    console.log('✅ Users created.');

   
    const temple1 = await Temple.create({
      name: 'Shri Siddhi Vinayak Temple',
      location: 'Mumbai, Maharashtra',
      description: 'One of the most visited Ganesh temples in India. Famous for granting wishes of devotees.',
      image: 'https://i.pinimg.com/1200x/ac/89/38/ac893806a116c466d758616e4b40082c.jpg',
      organizerId: organizer1._id,
    });

    const temple2 = await Temple.create({
      name: 'Tirupati Balaji Temple',
      location: 'Tirupati, Andhra Pradesh',
      description: 'The richest and most visited temple in the world, dedicated to Lord Venkateswara.',
      image: 'https://images.news18.com/kannada/uploads/2025/06/1750344365_Tirupati-2025-05-34fae04e2acf23516f75e7c1a0456d93.jpg?im=FitAndFill=(1200,900)',
      organizerId: organizer1._id,
    });

    const temple3 = await Temple.create({
      name: 'Kashi Vishwanath Temple',
      location: 'Varanasi, Uttar Pradesh',
      description: 'One of the most famous Hindu temples dedicated to Lord Shiva, located on the banks of the Ganges.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_zekjuM1a3mWD5DnMlquFcIW9w4rb6DnZPA&s',
      organizerId: organizer1._id,
    });

    console.log('✅ Temples created.');

    // ─── Create Darshan Slots ───────────────────────────────────
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const slots = [
      { templeId: temple1._id, date: tomorrow, startTime: '06:00 AM', endTime: '08:00 AM', capacity: 50 },
      { templeId: temple1._id, date: tomorrow, startTime: '09:00 AM', endTime: '11:00 AM', capacity: 60 },
      { templeId: temple1._id, date: dayAfter, startTime: '06:00 AM', endTime: '08:00 AM', capacity: 50 },
      { templeId: temple2._id, date: tomorrow, startTime: '05:00 AM', endTime: '07:00 AM', capacity: 100 },
      { templeId: temple2._id, date: tomorrow, startTime: '10:00 AM', endTime: '12:00 PM', capacity: 80 },
      { templeId: temple3._id, date: tomorrow, startTime: '04:00 AM', endTime: '06:00 AM', capacity: 40 },
      { templeId: temple3._id, date: dayAfter, startTime: '07:00 AM', endTime: '09:00 AM', capacity: 50 },
    ];

    await DarshanSlot.insertMany(slots);
    console.log('✅ Darshan slots created.');

    console.log('\n🎉 Seed complete! Login credentials:');
    console.log('   ADMIN:     admin@darshanease.com / admin123');
    console.log('   ORGANIZER: organizer@darshanease.com / organizer123');
    console.log('   USER:      user@darshanease.com / user123\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeder error:', error);
    process.exit(1);
  }
};

seed();