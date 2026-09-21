const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    therapist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true, index: true },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    gateway: { type: String, default: 'razorpay' },
    gateway_order_id: { type: String },
    gateway_transaction_id: { type: String },
    amount: { type: Number, required: true }, // gross, smallest currency unit
    platform_fee: { type: Number, default: 0 },
    net_amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    purpose: { type: String, enum: ['session', 'package'], required: true },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'refunded'],
      default: 'created',
    },
    invoiceUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
