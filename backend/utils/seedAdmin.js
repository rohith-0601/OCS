import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log(`Admin already exists: ${existingAdmin.email}`);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Rohith Perugu',
      email: 'rohithperugu3@gmail.com',
      password: 'admin123',
      role: 'admin',
      department: 'OCS',
    });

    console.log('✅ Admin user created:');
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Role:     ${admin.role}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
