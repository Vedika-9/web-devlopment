const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireFeature } = require('../middleware/entitlementMiddleware');

const router = express.Router();

// Public checkout flow
router.post('/:slug/order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);
router.post('/credit-package', paymentController.creditPackageToClient);

// Razorpay webhook (source of truth, not just client callback)
router.post('/webhook', express.raw({ type: '*/*' }), (req, res, next) => {
  req.rawBody = req.body;
  try {
    req.body = JSON.parse(req.body.toString('utf8'));
  } catch (e) {
    req.body = {};
  }
  next();
}, paymentController.razorpayWebhook);

// Private: package management
router.get('/packages', authMiddleware, paymentController.listPackages);
router.post('/packages', authMiddleware, requireFeature('packages'), paymentController.createPackage);

module.exports = router;
