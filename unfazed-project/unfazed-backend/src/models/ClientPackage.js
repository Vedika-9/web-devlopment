const mongoose = require('mongoose');

const clientPackageSchema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    package_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    sessionsRemaining: { type: Number, required: true },
    purchasedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClientPackage', clientPackageSchema);
