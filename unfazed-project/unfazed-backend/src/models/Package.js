const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    therapist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, index: true },
    name: { type: String, required: true }, // e.g. "6-session package"
    sessionCount: { type: Number, required: true },
    pricePerSession: { type: Number, required: true }, // in paise/smallest unit, config-driven
    totalPrice: { type: Number, required: true },
    validityDays: { type: Number, default: 90 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);
