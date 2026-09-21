const entitlementService = require('../services/entitlementService');

// Generic tier-gate middleware. Never check `therapist.subscriptionTier === 'x'`
// directly in a route/controller -- always go through entitlementService.
function requireFeature(featureKey) {
  return async (req, res, next) => {
    try {
      const result = await entitlementService.canAccess(req.therapistId, featureKey);
      if (!result.allowed) {
        return res.status(403).json({
          message: 'This feature requires a plan upgrade',
          featureKey,
          reason: result.reason,
          currentTier: result.tier,
        });
      }
      req.entitlement = result;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { requireFeature };
