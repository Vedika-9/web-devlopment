const crypto = require('crypto');
const { getRazorpay } = require('../config/razorpay');
const Payment = require('../models/Payment');
const Package = require('../models/Package');
const ClientPackage = require('../models/ClientPackage');
const Client = require('../models/Client');
const Therapist = require('../models/Therapist');
const invoiceService = require('../services/invoiceService');

const PLATFORM_FEE_PERCENT = 5; // could be moved into SubscriptionTierConfig if it should vary by tier

// Public: POST /api/payments/:slug/order  { clientId, purpose: 'session'|'package', amount OR packageId }
async function createOrder(req, res, next) {
  try {
    const { slug } = req.params;
    const { clientId, purpose, amount, packageId } = req.body;

    const therapist = await Therapist.findOne({ slug });
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

    let payAmount = amount;
    if (purpose === 'package') {
      const pkg = await Package.findById(packageId);
      if (!pkg) return res.status(404).json({ message: 'Package not found' });
      payAmount = pkg.totalPrice;
    }
    if (!payAmount) return res.status(400).json({ message: 'amount could not be determined' });

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: payAmount,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    const platform_fee = Math.round((payAmount * PLATFORM_FEE_PERCENT) / 100);
    const payment = await Payment.create({
      therapist_id: therapist._id,
      client_id: clientId,
      gateway_order_id: order.id,
      amount: payAmount,
      platform_fee,
      net_amount: payAmount - platform_fee,
      purpose: purpose || 'session',
      status: 'created',
    });

    res.status(201).json({ order, paymentId: payment._id, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    next(err);
  }
}

// Public: POST /api/payments/verify -- client-side callback verification
async function verifyPayment(req, res, next) {
  try {
    const { paymentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated !== razorpay_signature) {
      return res.status(400).json({ message: 'Signature verification failed' });
    }

    const payment = await markPaymentPaid(paymentId, razorpay_payment_id);
    res.json({ payment });
  } catch (err) {
    next(err);
  }
}

// Webhook: POST /api/payments/webhook -- the source of truth for payment confirmation,
// not just the client-side callback above.
async function razorpayWebhook(req, res, next) {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(req.rawBody || JSON.stringify(req.body))
      .digest('hex');

    if (process.env.RAZORPAY_WEBHOOK_SECRET && signature !== expected) {
      return res.status(400).send('invalid signature');
    }

    const event = req.body.event;
    if (event === 'payment.captured') {
      const entity = req.body.payload.payment.entity;
      const payment = await Payment.findOne({ gateway_order_id: entity.order_id });
      if (payment && payment.status !== 'paid') {
        await markPaymentPaid(payment._id, entity.id);
      }
    }
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}

async function markPaymentPaid(paymentId, gatewayPaymentId) {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw Object.assign(new Error('Payment not found'), { status: 404 });

  payment.status = 'paid';
  payment.gateway_transaction_id = gatewayPaymentId;

  const [therapist, client] = await Promise.all([
    Therapist.findById(payment.therapist_id),
    Client.findById(payment.client_id),
  ]);

  const invoiceUrl = invoiceService.generateInvoice({ payment, therapist, client });
  payment.invoiceUrl = invoiceUrl;
  await payment.save();

  if (payment.purpose === 'package' && payment._pkg) {
    // handled in buyPackage flow instead; kept here for webhook-only completions if needed
  }

  return payment;
}

// Private: package CRUD (therapist configures packages they sell)
async function listPackages(req, res, next) {
  try {
    const packages = await Package.find({ therapist_id: req.therapistId });
    res.json(packages);
  } catch (err) {
    next(err);
  }
}

async function createPackage(req, res, next) {
  try {
    // Entitlement check runs via requireFeature('packages') middleware before this.
    const { name, sessionCount, pricePerSession, validityDays } = req.body;
    const totalPrice = sessionCount * pricePerSession;
    const pkg = await Package.create({
      therapist_id: req.therapistId,
      name,
      sessionCount,
      pricePerSession,
      totalPrice,
      validityDays: validityDays || 90,
    });
    res.status(201).json(pkg);
  } catch (err) {
    next(err);
  }
}

// Public: after a package payment verifies, credit sessions to the client
async function creditPackageToClient(req, res, next) {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment || payment.status !== 'paid') {
      return res.status(400).json({ message: 'Payment not verified yet' });
    }
    const { packageId } = req.body;
    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    const expiresAt = new Date(Date.now() + pkg.validityDays * 24 * 60 * 60 * 1000);
    const clientPackage = await ClientPackage.create({
      client_id: payment.client_id,
      package_id: pkg._id,
      sessionsRemaining: pkg.sessionCount,
      expiresAt,
      payment_id: payment._id,
    });
    res.status(201).json(clientPackage);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  razorpayWebhook,
  listPackages,
  createPackage,
  creditPackageToClient,
};
