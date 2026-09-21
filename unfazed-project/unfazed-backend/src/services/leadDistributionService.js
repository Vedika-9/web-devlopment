const Lead = require('../models/Lead');
const notificationService = require('./notificationService');

/**
 * Captures a lead from a public profile/booking page and notifies the
 * therapist. Kept as its own service so distribution logic (e.g. round
 * robin across a future multi-therapist practice) stays isolated.
 */
async function captureLead({ therapistId, name, email, phone, source }) {
  const lead = await Lead.create({
    therapist_id: therapistId,
    name,
    email,
    phone,
    source: source || 'profile_page',
  });

  await notificationService.sendEmail({
    to: process.env.LEAD_NOTIFY_EMAIL || '',
    subject: `New lead: ${name}`,
    text: `${name} (${email}, ${phone || 'no phone'}) submitted an inquiry via ${source || 'profile page'}.`,
  }).catch(() => {}); // best-effort, don't fail the request over a notify error

  return lead;
}

module.exports = { captureLead };
