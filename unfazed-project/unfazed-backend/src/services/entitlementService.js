const Therapist = require('../models/Therapist');
const SubscriptionTierConfig = require('../models/SubscriptionTierConfig');
const Client = require('../models/Client');

/**
 * The single source of truth for feature access across the whole app.
 * Every gated route/component must call canAccess() -- nothing else should
 * compare tier strings or hardcode caps.
 *
 * featureKey values used in this app:
 *  - 'add_client'        (checks activeClients cap)
 *  - 'packages'          (boolean flag)
 *  - 'analytics:basic'
 *  - 'analytics:advanced'
 *  - 'note_template:soap'
 *  - 'note_template:dap'
 *  - 'chat'
 */
async function canAccess(therapistId, featureKey, context = {}) {
  const therapist = await Therapist.findById(therapistId);
  if (!therapist) {
    return { allowed: false, reason: 'therapist_not_found' };
  }

  const config = await SubscriptionTierConfig.findOne({ tier: therapist.subscriptionTier });
  if (!config) {
    return { allowed: false, reason: 'tier_config_missing', tier: therapist.subscriptionTier };
  }

  const caps = config.caps;

  switch (true) {
    case featureKey === 'add_client': {
      if (caps.activeClients === -1) return { allowed: true, tier: therapist.subscriptionTier };
      const activeCount = await Client.countDocuments({
        therapist_id: therapistId,
        status: { $ne: 'inactive' },
      });
      const allowed = activeCount < caps.activeClients;
      return {
        allowed,
        tier: therapist.subscriptionTier,
        reason: allowed ? undefined : 'active_client_cap_reached',
        limit: caps.activeClients,
        current: activeCount,
      };
    }

    case featureKey === 'packages': {
      return {
        allowed: !!caps.packagesEnabled,
        tier: therapist.subscriptionTier,
        reason: caps.packagesEnabled ? undefined : 'packages_not_in_plan',
      };
    }

    case featureKey === 'chat': {
      return {
        allowed: !!caps.chatEnabled,
        tier: therapist.subscriptionTier,
        reason: caps.chatEnabled ? undefined : 'chat_not_in_plan',
      };
    }

    case featureKey.startsWith('analytics:'): {
      const depthRequested = featureKey.split(':')[1]; // basic | advanced
      const order = { none: 0, basic: 1, advanced: 2 };
      const allowed = order[caps.analyticsDepth] >= order[depthRequested];
      return {
        allowed,
        tier: therapist.subscriptionTier,
        reason: allowed ? undefined : 'analytics_depth_not_in_plan',
      };
    }

    case featureKey.startsWith('note_template:'): {
      const template = featureKey.split(':')[1]; // soap | dap | freeform
      const allowed = (caps.noteTemplates || []).includes(template);
      return {
        allowed,
        tier: therapist.subscriptionTier,
        reason: allowed ? undefined : 'note_template_not_in_plan',
      };
    }

    default:
      return { allowed: false, reason: 'unknown_feature_key' };
  }
}

module.exports = { canAccess };
