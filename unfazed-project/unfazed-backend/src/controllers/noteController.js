const SessionNote = require('../models/SessionNote');
const entitlementService = require('../services/entitlementService');

// Private (therapist dashboard): create a note, private or shared
async function createNote(req, res, next) {
  try {
    const { clientId, sessionId, type, format, content } = req.body;

    if (format && format !== 'freeform') {
      const check = await entitlementService.canAccess(req.therapistId, `note_template:${format}`);
      if (!check.allowed) {
        return res.status(403).json({ message: 'This note format requires a plan upgrade', reason: check.reason });
      }
    }

    const note = await SessionNote.create({
      therapist_id: req.therapistId,
      client_id: clientId,
      session_id: sessionId,
      type: type === 'shared' ? 'shared' : 'private',
      format: format || 'freeform',
      content,
    });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
}

// Private (therapist dashboard): sees both private and shared
async function listNotesForTherapist(req, res, next) {
  try {
    const notes = await SessionNote.find({
      therapist_id: req.therapistId,
      client_id: req.params.clientId,
    }).sort('-createdAt');
    res.json(notes);
  } catch (err) {
    next(err);
  }
}

// CLIENT-FACING ROUTE: must only ever return notes with type === 'shared'.
// This is enforced here at the query level, not just hidden in the UI.
async function listNotesForClientPortal(req, res, next) {
  try {
    const notes = await SessionNote.find({
      client_id: req.params.clientId,
      type: 'shared', // hard filter -- never remove this line
    })
      .select('-therapist_id') // don't leak internal refs to the client
      .sort('-createdAt');
    res.json(notes);
  } catch (err) {
    next(err);
  }
}

async function updateNote(req, res, next) {
  try {
    const { content, type } = req.body;
    const updates = {};
    if (content !== undefined) updates.content = content;
    if (type !== undefined) updates.type = type === 'shared' ? 'shared' : 'private';

    const note = await SessionNote.findOneAndUpdate(
      { _id: req.params.id, therapist_id: req.therapistId },
      updates,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    next(err);
  }
}

module.exports = { createNote, listNotesForTherapist, listNotesForClientPortal, updateNote };
