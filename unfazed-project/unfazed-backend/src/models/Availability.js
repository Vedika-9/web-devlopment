const mongoose = require('mongoose');

// Weekly recurring template, e.g. { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }
const recurringSlotSchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const overrideSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    type: { type: String, enum: ['add', 'block'], required: true },
    startTime: { type: String },
    endTime: { type: String },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    therapist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, unique: true },
    timezone: { type: String, default: 'Asia/Kolkata' },
    recurring: [recurringSlotSchema],
    overrides: [overrideSchema],
    bufferMinutes: { type: Number, default: 10 },
    sessionDurations: [{ type: Number }], // e.g. [30, 45, 60, 90]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Availability', availabilitySchema);
