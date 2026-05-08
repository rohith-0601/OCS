import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Block from '../models/Block.js';
import Room from '../models/Room.js';

const BLOCKS_AND_ROOMS = [
  {
    block: { name: 'A Block', description: 'Academic Block A — classrooms, lecture halls, auditorium' },
    rooms: [
      { name: 'A-Class Room 320', capacity: 80 },
      { name: 'A-AUDITORIUM',     capacity: 289 },
      { name: 'A-Class Room 111', capacity: 70 },
      { name: 'A-Class Room 112', capacity: 80 },
      { name: 'A-Class Room 114', capacity: 36 },
      { name: 'A-Class Room 117', capacity: 84 },
      { name: 'A-Class Room 118', capacity: 84 },
      { name: 'A-Class Room 119', capacity: 108 },
      { name: 'A-Class Room 220', capacity: 40 },
      { name: 'A-Class Room 221', capacity: 120 },
      { name: 'A-LH-1',          capacity: 184 },
      { name: 'A-LH-2',          capacity: 184 },
    ],
  },
  {
    block: { name: 'BT/BM Block', description: 'Biotechnology / Biomedical block' },
    rooms: [
      { name: 'BT/BM-009', capacity: 24 },
      { name: 'BT/BM-010', capacity: 24 },
      { name: 'BT/BM-118', capacity: 60 },
    ],
  },
  {
    block: { name: 'C Block', description: 'Academic Block C — lecture halls' },
    rooms: [
      { name: 'C-LH-10', capacity: 68 },
      { name: 'C-LH-2',  capacity: 138 },
      { name: 'C-LH-3',  capacity: 100 },
      { name: 'C-LH-4',  capacity: 60 },
      { name: 'C-LH-5',  capacity: 60 },
      { name: 'C-LH-6',  capacity: 60 },
      { name: 'C-LH-7',  capacity: 70 },
      { name: 'C-LH-9',  capacity: 66 },
    ],
  },
  {
    block: { name: 'CSE Block', description: 'Computer Science & Engineering block' },
    rooms: [
      { name: 'CSE-LH-01', capacity: 70 },
      { name: 'CSE-LH-02', capacity: 70 },
      { name: 'CSE-LH-03', capacity: 70 },
    ],
  },
  {
    block: { name: 'CY Block', description: 'Chemistry block' },
    rooms: [
      { name: 'CY-LH-1', capacity: 30 },
      { name: 'CY-LH-2', capacity: 40 },
      { name: 'CY-LH-3', capacity: 90 },
    ],
  },
  {
    block: { name: 'EE Block', description: 'Electrical Engineering block' },
    rooms: [
      { name: 'EE-004(GF)', capacity: 80 },
      { name: 'EE-20 (SF)', capacity: 60 },
    ],
  },
  {
    block: { name: 'LHC', description: 'Lecture Hall Complex — large capacity halls' },
    rooms: [
      { name: 'LHC-01', capacity: 72 },
      { name: 'LHC-02', capacity: 72 },
      { name: 'LHC-03', capacity: 120 },
      { name: 'LHC-04', capacity: 200 },
      { name: 'LHC-05', capacity: 800 },
      { name: 'LHC-06', capacity: 320 },
      { name: 'LHC-07', capacity: 200 },
      { name: 'LHC-08', capacity: 120 },
      { name: 'LHC-09', capacity: 72 },
      { name: 'LHC-10', capacity: 72 },
      { name: 'LHC-11', capacity: 120 },
      { name: 'LHC-12', capacity: 200 },
      { name: 'LHC-13', capacity: 320 },
      { name: 'LHC-14', capacity: 200 },
      { name: 'LHC-15', capacity: 120 },
    ],
  },
  {
    block: { name: 'MA Block', description: 'Mathematics block' },
    rooms: [
      { name: 'MA-01',  capacity: 56 },
      { name: 'MA-02',  capacity: 56 },
      { name: 'MA-114', capacity: 30 },
    ],
  },
  {
    block: { name: 'MSME Block', description: 'MSME block' },
    rooms: [
      { name: 'MSME-LH-1', capacity: 36 },
      { name: 'MSME-LH-2', capacity: 60 },
      { name: 'MSME-LH-3', capacity: 106 },
    ],
  },
  {
    block: { name: 'PH Block', description: 'Physics block' },
    rooms: [
      { name: 'PH-1', capacity: 80 },
      { name: 'PH-2', capacity: 60 },
      { name: 'PH-3', capacity: 50 },
    ],
  },
];

const seedRooms = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Room.deleteMany({});
    await Block.deleteMany({});
    console.log('Cleared existing blocks and rooms.');

    let totalRooms = 0;

    for (const entry of BLOCKS_AND_ROOMS) {
      // Create block
      const block = await Block.create(entry.block);
      console.log(`✓ Block: ${block.name}`);

      // Create rooms for this block
      const roomDocs = entry.rooms.map((r) => ({
        name: r.name,
        block: block._id,
        capacity: r.capacity,
        allowedPurposes: ['OA', 'Interview', 'PPT'],
        isAvailable: true,
      }));

      const created = await Room.insertMany(roomDocs);
      totalRooms += created.length;
      console.log(`  → ${created.length} rooms added`);
    }

    console.log(`\n✅ Seed complete: ${BLOCKS_AND_ROOMS.length} blocks, ${totalRooms} rooms.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedRooms();
