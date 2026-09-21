const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    therapist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, index: true },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    status: {
      type: String,
      enum: ['booked', 'completed', 'cancelled', 'no_show'],
      default: 'booked',
    },
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    clientPackage_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientPackage' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Prevent double-booking the same therapist at the same time.
sessionSchema.index({ therapist_id: 1, startTime: 1 });

module.exports = mongoose.model('Session', sessionSchema);
