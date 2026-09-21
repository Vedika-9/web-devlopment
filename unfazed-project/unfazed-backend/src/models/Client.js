const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    therapist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    status: { type: String, enum: ['lead', 'active', 'inactive'], default: 'active' },
    tags: [{ type: String }],
    intake: {
      demographics: { type: mongoose.Schema.Types.Mixed, default: {} },
      presentingConcern: { type: String, default: '' },
      history: { type: String, default: '' },
      submittedAt: { type: Date },
    },
    consent: {
      accepted: { type: Boolean, default: false },
      acceptedAt: { type: Date },
      ipAddress: { type: String },
    },
    lastSessionAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', clientSchema);
