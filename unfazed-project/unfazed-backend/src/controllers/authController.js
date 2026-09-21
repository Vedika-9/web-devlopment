const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Therapist = require('../models/Therapist');
const { generateUniqueSlug } = require('../utils/generateSlug');

function signToken(therapistId) {
  return jwt.sign({ therapistId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function register(req, res, next) {
  try {
    const { email, password, name, bio, specializations, languages } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'email, password and name are required' });
    }

    const existing = await Therapist.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const slug = await generateUniqueSlug(name);

    const therapist = await Therapist.create({
      email: email.toLowerCase(),
      password_hash,
      name,
      slug,
      bio: bio || '',
      specializations: specializations || [],
      languages: languages || [],
    });

    const token = signToken(therapist._id);
    res.status(201).json({
      token,
      therapist: {
        id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        slug: therapist.slug,
        subscriptionTier: therapist.subscriptionTier,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const therapist = await Therapist.findOne({ email: (email || '').toLowerCase() });
    if (!therapist) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password || '', therapist.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(therapist._id);
    res.json({
      token,
      therapist: {
        id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        slug: therapist.slug,
        subscriptionTier: therapist.subscriptionTier,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    const therapist = await Therapist.findById(req.therapistId).select('-password_hash');
    if (!therapist) return res.status(404).json({ message: 'Not found' });
    res.json(therapist);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
