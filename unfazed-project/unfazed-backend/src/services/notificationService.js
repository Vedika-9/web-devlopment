const nodemailer = require('nodemailer');

/**
 * Event-driven notification service. WhatsApp is stubbed (logged/queued)
 * since live WhatsApp Business API access requires business approval.
 * Email is wired to Nodemailer as the practical substitute for demos.
 */

let transporter = null;
function getTransporter() {
  if (!transporter && process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

const whatsappQueue = []; // in-memory stub queue; swap for a real queue/provider later

async function sendEmail({ to, subject, text }) {
  const t = getTransporter();
  if (!t) {
    console.log(`[notification:email:stub] to=${to} subject="${subject}"`);
    return { stubbed: true };
  }
  return t.sendMail({ from: process.env.SMTP_FROM || 'no-reply@unfazed.in', to, subject, text });
}

function queueWhatsApp({ to, template, variables }) {
  const job = { to, template, variables, queuedAt: new Date().toISOString() };
  whatsappQueue.push(job);
  console.log('[notification:whatsapp:stub]', job);
  return job;
}

// Domain events -> notifications
async function onBookingConfirmed({ clientEmail, clientPhone, therapistName, startTime }) {
  await sendEmail({
    to: clientEmail,
    subject: `Session confirmed with ${therapistName}`,
    text: `Your session with ${therapistName} is confirmed for ${startTime}.`,
  });
  queueWhatsApp({ to: clientPhone, template: 'booking_confirmed', variables: { therapistName, startTime } });
}

async function onSessionReminder24h({ clientEmail, clientPhone, therapistName, startTime }) {
  await sendEmail({
    to: clientEmail,
    subject: `Reminder: session tomorrow with ${therapistName}`,
    text: `This is a reminder for your session with ${therapistName} at ${startTime}.`,
  });
  queueWhatsApp({ to: clientPhone, template: 'reminder_24h', variables: { therapistName, startTime } });
}

async function onPostSessionFollowUp({ clientEmail, therapistName }) {
  await sendEmail({
    to: clientEmail,
    subject: `Thanks for your session`,
    text: `Thanks for meeting with ${therapistName}. See you next time!`,
  });
}

module.exports = {
  sendEmail,
  queueWhatsApp,
  onBookingConfirmed,
  onSessionReminder24h,
  onPostSessionFollowUp,
  _whatsappQueue: whatsappQueue,
};
