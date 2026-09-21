const Therapist = require('../models/Therapist');
const Lead = require('../models/Lead');
const leadDistributionService = require('../services/leadDistributionService');

// Public: GET /:slug profile page data
async function getPublicProfile(req, res, next) {
  try {
    const therapist = await Therapist.findOne({ slug: req.params.slug, isActive: true }).select(
      'name slug bio specializations languages profilePhotoUrl'
    );
    if (!therapist) return res.status(404).json({ message: 'Profile not found' });
    res.json(therapist);
  } catch (err) {
    next(err);
  }
}

// Public: POST /:slug/leads -- inquiry form on the branded page
async function submitLead(req, res, next) {
  try {
    const therapist = await Therapist.findOne({ slug: req.params.slug });
    if (!therapist) return res.status(404).json({ message: 'Profile not found' });

    const { name, email, phone } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'name and email are required' });

    const lead = await leadDistributionService.captureLead({
      therapistId: therapist._id,
      name,
      email,
      phone,
      source: 'profile_page',
    });
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
}

// Private: GET /api/therapists/me
async function getMe(req, res, next) {
  try {
    const therapist = await Therapist.findById(req.therapistId).select('-password_hash');
    res.json(therapist);
  } catch (err) {
    next(err);
  }
}

// Private: PATCH /api/therapists/me
async function updateMe(req, res, next) {
  try {
    const allowed = ['name', 'bio', 'specializations', 'languages', 'profilePhotoUrl'];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    const therapist = await Therapist.findByIdAndUpdate(req.therapistId, updates, {
      new: true,
    }).select('-password_hash');
    res.json(therapist);
  } catch (err) {
    next(err);
  }
}

// Private: GET /api/therapists/leads
async function listLeads(req, res, next) {
  try {
    const leads = await Lead.find({ therapist_id: req.therapistId }).sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    next(err);
  }
}

module.exports = { getPublicProfile, submitLead, getMe, updateMe, listLeads };
