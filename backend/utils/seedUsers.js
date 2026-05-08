import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.js';

const dummyUsers = [
  { name: 'Rahul Sharma',   email: 'rahul@iith.ac.in',   password: 'rahul123',   role: 'admin',  department: 'OCS' },
  { name: 'Priya Mehta',    email: 'priya@iith.ac.in',    password: 'priya123',   role: 'core',   department: 'CSE Core' },
  { name: 'Arjun Reddy',    email: 'arjun@iith.ac.in',    password: 'arjun123',   role: 'core',   department: 'EE Core' },
  { name: 'Sneha Gupta',    email: 'sneha@iith.ac.in',    password: 'sneha123',   role: 'viewer', department: 'Mechanical' },
  { name: 'Karthik Nair',   email: 'karthik@iith.ac.in',  password: 'karthik123', role: 'viewer', department: 'Civil' },
];

const seed = async () => {
  try {
    await connectDB();
    for (const u of dummyUsers) {
      const exists = await User.findOne({ email: u.email });
      if (exists) { console.log(`⏭  Skipped (exists): ${u.email}`); continue; }
      await User.create(u);
      console.log(`✓ Created: ${u.email} [${u.role}]`);
    }
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (err) { console.error('❌', err.message); process.exit(1); }
};

seed();
