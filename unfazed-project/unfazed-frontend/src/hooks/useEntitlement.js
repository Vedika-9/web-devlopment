import { useAuth } from '../context/AuthContext';

// Frontend-side mirror of the backend entitlement rules, used only to show/hide
// UI affordances (upgrade prompts) quickly. The backend is still the real gate --
// every write goes through entitlementService server-side regardless of this.
const TIER_CAPS = {
  free: { activeClients: 5, packagesEnabled: false, analyticsDepth: 'none', noteTemplates: ['freeform'] },
  pro: { activeClients: 30, packagesEnabled: true, analyticsDepth: 'basic', noteTemplates: ['freeform', 'soap'] },
  premium: { activeClients: -1, packagesEnabled: true, analyticsDepth: 'advanced', noteTemplates: ['freeform', 'soap', 'dap'] },
};

export function useEntitlement() {
  const { therapist } = useAuth();
  const tier = therapist?.subscriptionTier || 'free';
  const caps = TIER_CAPS[tier];

  function canAccess(featureKey) {
    if (featureKey === 'packages') return caps.packagesEnabled;
    if (featureKey.startsWith('analytics:')) {
      const order = { none: 0, basic: 1, advanced: 2 };
      return order[caps.analyticsDepth] >= order[featureKey.split(':')[1]];
    }
    if (featureKey.startsWith('note_template:')) {
      return caps.noteTemplates.includes(featureKey.split(':')[1]);
    }
    return true;
  }

  return { tier, caps, canAccess };
}
