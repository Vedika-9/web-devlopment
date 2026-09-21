const mongoose = require('mongoose');

const sessionNoteSchema = new mongoose.Schema(
  {
    therapist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, index: true },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    type: { type: String, enum: ['private', 'shared'], required: true, default: 'private' },
    format: { type: String, enum: ['freeform', 'soap', 'dap'], default: 'freeform' },
    content: { type: mongoose.Schema.Types.Mixed, required: true }, // rich text JSON or plain text
  },
  { timestamps: true }
);

// CRITICAL: private notes must never be selected on client-facing routes.
// Always filter with { type: 'shared' } when serving the client portal.
sessionNoteSchema.index({ client_id: 1, type: 1 });

module.exports = mongoose.model('SessionNote', sessionNoteSchema);
