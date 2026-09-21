const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [body('email').isEmail(), body('password').isLength({ min: 6 }), body('name').notEmpty()],
  authController.register
);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);

module.exports = router;
