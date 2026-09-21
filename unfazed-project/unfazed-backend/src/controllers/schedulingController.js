const Availability = require('../models/Availability');
const Session = require('../models/Session');
const Client = require('../models/Client');
const notificationService = require('../services/notificationService');
const Therapist = require('../models/Therapist');

// Private: GET/PUT availability template
async function getAvailability(req, res, next) {
  try {
    const availability = await Availability.findOne({ therapist_id: req.therapistId });
    res.json(availability || null);
  } catch (err) {
    next(err);
  }
}

async function upsertAvailability(req, res, next) {
  try {
    const { timezone, recurring, overrides, bufferMinutes, sessionDurations } = req.body;
    const availability = await Availability.findOneAndUpdate(
      { therapist_id: req.therapistId },
      { timezone, recurring, overrides, bufferMinutes, sessionDurations },
      { new: true, upsert: true }
    );
    res.json(availability);
  } catch (err) {
    next(err);
  }
}

// Compute open slots for a given date range from the recurring template,
// applying overrides and excluding already-booked sessions.
function buildDaySlots(date, availability) {
  const dayOfWeek = date.getDay();
  const dateStr = date.toISOString().slice(0, 10);

  let windows = availability.recurring
    .filter((r) => r.dayOfWeek === dayOfWeek)
    .map((r) => ({ startTime: r.startTime, endTime: r.endTime }));

  (availability.overrides || []).forEach((o) => {
    if (o.date !== dateStr) return;
    if (o.type === 'block') {
      windows = []; // simple: a block override clears the day
    } else if (o.type === 'add') {
      windows.push({ startTime: o.startTime, endTime: o.endTime });
    }
  });

  return windows;
}

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// Public: GET /api/scheduling/:slug/slots?date=YYYY-MM-DD&duration=45
async function getOpenSlots(req, res, next) {
  try {
    const { slug } = req.params;
    const { date, duration } = req.query;
    if (!date) return res.status(400).json({ message: 'date is required (YYYY-MM-DD)' });

    const therapist = await Therapist.findOne({ slug });
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

    const availability = await Availability.findOne({ therapist_id: therapist._id });
    if (!availability) return res.json({ slots: [] });

    const sessionDuration = Number(duration) || availability.sessionDurations[0] || 45;
    const day = new Date(`${date}T00:00:00`);
    const windows = buildDaySlots(day, availability);

    // existing sessions that day
    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);
    const booked = await Session.find({
      therapist_id: therapist._id,
      startTime: { $gte: dayStart, $lte: dayEnd },
      status: { $ne: 'cancelled' },
    });

    const slots = [];
    windows.forEach((w) => {
      let cursor = timeToMinutes(w.startTime);
      const end = timeToMinutes(w.endTime);
      while (cursor + sessionDuration <= end) {
        const slotStart = new Date(day);
        slotStart.setHours(0, cursor, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + sessionDuration * 60000);

        const overlaps = booked.some((s) => {
          return slotStart < new Date(s.endTime) && slotEnd > new Date(s.startTime);
        });

        if (!overlaps) {
          slots.push({ startTime: slotStart.toISOString(), endTime: slotEnd.toISOString() });
        }
        cursor += sessionDuration + (availability.bufferMinutes || 0);
      }
    });

    res.json({ slots, timezone: availability.timezone });
  } catch (err) {
    next(err);
  }
}

// Public: POST /api/scheduling/:slug/book
async function bookSlot(req, res, next) {
  try {
    const { slug } = req.params;
    const { startTime, endTime, durationMinutes, clientName, clientEmail, clientPhone } = req.body;

    const therapist = await Therapist.findOne({ slug });
    if (!therapist) return res.status(404).json({ message: 'Therapist not found' });

    // double-booking prevention
    const conflict = await Session.findOne({
      therapist_id: therapist._id,
      status: { $ne: 'cancelled' },
      startTime: { $lt: new Date(endTime) },
      endTime: { $gt: new Date(startTime) },
    });
    if (conflict) return res.status(409).json({ message: 'This slot was just booked. Please pick another.' });

    let client = await Client.findOne({ therapist_id: therapist._id, email: clientEmail.toLowerCase() });
    if (!client) {
      client = await Client.create({
        therapist_id: therapist._id,
        name: clientName,
        email: clientEmail.toLowerCase(),
        phone: clientPhone,
        status: 'active',
      });
    }

    const session = await Session.create({
      therapist_id: therapist._id,
      client_id: client._id,
      startTime,
      endTime,
      durationMinutes,
      status: 'booked',
    });

    await notificationService.onBookingConfirmed({
      clientEmail: client.email,
      clientPhone: client.phone,
      therapistName: therapist.name,
      startTime,
    });

    res.status(201).json({ session, client });
  } catch (err) {
    next(err);
  }
}

// Private: list sessions for the logged-in therapist
async function listSessions(req, res, next) {
  try {
    const sessions = await Session.find({ therapist_id: req.therapistId })
      .populate('client_id', 'name email')
      .sort('startTime');
    res.json(sessions);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAvailability, upsertAvailability, getOpenSlots, bookSlot, listSessions };
