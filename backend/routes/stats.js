// backend/routes/stats.js
const express = require('express');
const { getAdminStats } = require('../controllers/statsController');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/stats/admin - Get admin dashboard statistics (Admin only)
router.get('/admin', auth, adminOnly, getAdminStats);

module.exports = router;
