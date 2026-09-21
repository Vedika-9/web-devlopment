const Client = require('../models/Client');
const Session = require('../models/Session');
const Payment = require('../models/Payment');

async function listClients(req, res, next) {
  try {
    const { search, status, tag, sort } = req.query;
    const filter = { therapist_id: req.therapistId };
    if (status) filter.status = status;
    if (tag) filter.tags = tag;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const sortMap = { name: 'name', lastSession: '-lastSessionAt', status: 'status' };
    const clients = await Client.find(filter).sort(sortMap[sort] || '-createdAt');
    res.json(clients);
  } catch (err) {
    next(err);
  }
}

async function createClient(req, res, next) {
  try {
    // Entitlement check already ran via requireFeature('add_client') middleware.
    const { name, email, phone, tags } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'name and email are required' });

    const client = await Client.create({
      therapist_id: req.therapistId,
      name,
      email,
      phone,
      tags: tags || [],
    });
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
}

async function getClient(req, res, next) {
  try {
    const client = await Client.findOne({ _id: req.params.id, therapist_id: req.therapistId });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const [sessions, payments] = await Promise.all([
      Session.find({ client_id: client._id }).sort('-startTime'),
      Payment.find({ client_id: client._id }).sort('-createdAt'),
    ]);

    res.json({ client, sessions, payments });
  } catch (err) {
    next(err);
  }
}

async function updateClient(req, res, next) {
  try {
    const allowed = ['name', 'email', 'phone', 'status', 'tags'];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, therapist_id: req.therapistId },
      updates,
      { new: true }
    );
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) {
    next(err);
  }
}

// Public-ish (called from the client portal, still requires a client token/link in
// a real build out -- kept simple here): submit intake + consent
async function submitIntake(req, res, next) {
  try {
    const { demographics, presentingConcern, history, consentAccepted } = req.body;
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    client.intake = {
      demographics: demographics || {},
      presentingConcern: presentingConcern || '',
      history: history || '',
      submittedAt: new Date(),
    };
    if (consentAccepted) {
      client.consent = {
        accepted: true,
        acceptedAt: new Date(),
        ipAddress: req.ip,
      };
    }
    await client.save();
    res.json(client);
  } catch (err) {
    next(err);
  }
}

module.exports = { listClients, createClient, getClient, updateClient, submitIntake };
