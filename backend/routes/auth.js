const express = require('express');
const { signup, login, logout, refreshToken } = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter'); // ✅ Auth Rate Limiter

const router = express.Router();

router.post('/signup', authLimiter, signup); // ✅ Rate limit on signup
router.post('/login', authLimiter, login);   // ✅ Rate limit on login
router.post('/logout', auth, logout);
router.post('/refresh', refreshToken); // ✅ NEW: Refresh token endpoint

module.exports = router;
