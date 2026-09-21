const express = require('express');
const schedulingController = require('../controllers/schedulingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public booking flow
router.get('/:slug/slots', schedulingController.getOpenSlots);
router.post('/:slug/book', schedulingController.bookSlot);

// Private therapist dashboard
router.get('/availability/me', authMiddleware, schedulingController.getAvailability);
router.put('/availability/me', authMiddleware, schedulingController.upsertAvailability);
router.get('/sessions/me', authMiddleware, schedulingController.listSessions);

module.exports = router;
