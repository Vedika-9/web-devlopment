const mongoose = require('mongoose');

// Single source of truth for tier caps & feature flags. No values should be
// hardcoded anywhere else in the app -- always read through entitlementService.
const subscriptionTierConfigSchema = new mongoose.Schema(
  {
    tier: { type: String, enum: ['free', 'pro', 'premium'], required: true, unique: true },
    displayName: { type: String, required: true },
    monthlyPrice: { type: Number, required: true }, // smallest currency unit
    caps: {
      activeClients: { type: Number, required: true }, // -1 = unlimited
      packagesEnabled: { type: Boolean, default: false },
      analyticsDepth: { type: String, enum: ['none', 'basic', 'advanced'], default: 'none' },
      noteTemplates: [{ type: String }], // e.g. ['freeform'], ['freeform','soap','dap']
      chatEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubscriptionTierConfig', subscriptionTierConfigSchema);
