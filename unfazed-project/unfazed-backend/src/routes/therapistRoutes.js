const express = require('express');
const therapistController = require('../controllers/therapistController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public branded profile + lead capture
router.get('/public/:slug', therapistController.getPublicProfile);
router.post('/public/:slug/leads', therapistController.submitLead);

// Private dashboard
router.get('/me', authMiddleware, therapistController.getMe);
router.patch('/me', authMiddleware, therapistController.updateMe);
router.get('/leads', authMiddleware, therapistController.listLeads);

module.exports = router;
