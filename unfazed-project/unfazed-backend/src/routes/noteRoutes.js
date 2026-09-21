const express = require('express');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, noteController.createNote);
router.get('/therapist/:clientId', authMiddleware, noteController.listNotesForTherapist);
router.patch('/:id', authMiddleware, noteController.updateNote);

// Client-portal-facing: shared notes only (no auth middleware here in the
// scaffold -- in production gate this behind a client access token)
router.get('/client-portal/:clientId', noteController.listNotesForClientPortal);

module.exports = router;
