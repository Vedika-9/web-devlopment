const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/basic', analyticsController.getBasicAnalytics);
router.get('/advanced', analyticsController.getAdvancedAnalytics);

module.exports = router;
