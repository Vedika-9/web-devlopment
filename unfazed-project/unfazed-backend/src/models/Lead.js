const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    therapist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    source: { type: String, default: 'profile_page' },
    status: { type: String, enum: ['new', 'contacted', 'converted', 'lost'], default: 'new' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
