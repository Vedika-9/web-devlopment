const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    bio: { type: String, default: '' },
    specializations: [{ type: String }],
    languages: [{ type: String }],
    profilePhotoUrl: { type: String, default: '' },
    subscriptionTier: { type: String, enum: ['free', 'pro', 'premium'], default: 'free' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Therapist', therapistSchema);
