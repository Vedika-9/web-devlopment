require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Therapist = require('../models/Therapist');
const Client = require('../models/Client');
const SubscriptionTierConfig = require('../models/SubscriptionTierConfig');
const Availability = require('../models/Availability');
const { generateUniqueSlug } = require('./generateSlug');

async function seed() {
  await connectDB();

  // Tier configs -- the config-driven single source of truth
  await SubscriptionTierConfig.deleteMany({});
  await SubscriptionTierConfig.insertMany([
    {
      tier: 'free',
      displayName: 'Free',
      monthlyPrice: 0,
      caps: {
        activeClients: 5,
        packagesEnabled: false,
        analyticsDepth: 'none',
        noteTemplates: ['freeform'],
        chatEnabled: true,
      },
    },
    {
      tier: 'pro',
      displayName: 'Pro',
      monthlyPrice: 99900,
      caps: {
        activeClients: 30,
        packagesEnabled: true,
        analyticsDepth: 'basic',
        noteTemplates: ['freeform', 'soap'],
        chatEnabled: true,
      },
    },
    {
      tier: 'premium',
      displayName: 'Premium',
      monthlyPrice: 249900,
      caps: {
        activeClients: -1,
        packagesEnabled: true,
        analyticsDepth: 'advanced',
        noteTemplates: ['freeform', 'soap', 'dap'],
        chatEnabled: true,
      },
    },
  ]);

  await Therapist.deleteMany({});
  await Client.deleteMany({});
  await Availability.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);
  const slug = await generateUniqueSlug('Dr Sharma');

  const therapist = await Therapist.create({
    email: 'dr.sharma@example.com',
    password_hash: passwordHash,
    name: 'Dr. Sharma',
    slug,
    bio: 'Clinical psychologist with 10 years of experience.',
    specializations: ['Anxiety', 'CBT', 'Relationships'],
    languages: ['English', 'Hindi'],
    subscriptionTier: 'pro',
  });

  await Availability.create({
    therapist_id: therapist._id,
    timezone: 'Asia/Kolkata',
    recurring: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '13:00' },
    ],
    bufferMinutes: 10,
    sessionDurations: [30, 45, 60],
  });

  await Client.create({
    therapist_id: therapist._id,
    name: 'Test Client',
    email: 'client@example.com',
    phone: '9999999999',
    status: 'active',
    tags: ['new'],
  });

  console.log(`Seeded therapist login: dr.sharma@example.com / password123`);
  console.log(`Public profile: /${slug}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
