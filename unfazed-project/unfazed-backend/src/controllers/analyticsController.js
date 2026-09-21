const mongoose = require('mongoose');
const Session = require('../models/Session');
const Payment = require('../models/Payment');
const Client = require('../models/Client');
const entitlementService = require('../services/entitlementService');

// Basic tier: revenue trend + active client count
async function getBasicAnalytics(req, res, next) {
  try {
    const check = await entitlementService.canAccess(req.therapistId, 'analytics:basic');
    if (!check.allowed) return res.status(403).json({ message: 'Upgrade required', reason: check.reason });

    const therapistId = new mongoose.Types.ObjectId(req.therapistId);

    const revenueTrend = await Payment.aggregate([
      { $match: { therapist_id: therapistId, status: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          totalRevenue: { $sum: '$net_amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const activeClients = await Client.countDocuments({ therapist_id: therapistId, status: 'active' });

    res.json({ revenueTrend, activeClients });
  } catch (err) {
    next(err);
  }
}

// Advanced tier: adds no-show rate + per-session-duration breakdown
async function getAdvancedAnalytics(req, res, next) {
  try {
    const check = await entitlementService.canAccess(req.therapistId, 'analytics:advanced');
    if (!check.allowed) return res.status(403).json({ message: 'Upgrade required', reason: check.reason });

    const therapistId = new mongoose.Types.ObjectId(req.therapistId);

    const noShowAgg = await Session.aggregate([
      { $match: { therapist_id: therapistId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          noShows: { $sum: { $cond: [{ $eq: ['$status', 'no_show'] }, 1, 0] } },
        },
      },
    ]);
    const noShowRate = noShowAgg.length
      ? Math.round((noShowAgg[0].noShows / noShowAgg[0].total) * 1000) / 10
      : 0;

    const durationBreakdown = await Session.aggregate([
      { $match: { therapist_id: therapistId, status: { $ne: 'cancelled' } } },
      { $group: { _id: '$durationMinutes', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ noShowRate, durationBreakdown });
  } catch (err) {
    next(err);
  }
}

module.exports = { getBasicAnalytics, getAdvancedAnalytics };
