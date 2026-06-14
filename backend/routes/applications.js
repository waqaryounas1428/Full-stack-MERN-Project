const express = require('express');
const {
    submitApplication,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus,
    deleteApplication,
} = require('../controllers/applicationController');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { applicationLimiter } = require('../middleware/rateLimiter'); // ✅ Application Rate Limiter

const router = express.Router();

router.post('/', auth, applicationLimiter, upload.single('resume'), submitApplication); // ✅ Rate limit on applications
router.get('/my', auth, getMyApplications);
router.get('/', auth, adminOnly, getAllApplications);
router.put('/:id/status', auth, adminOnly, updateApplicationStatus);
router.delete('/:id', auth, adminOnly, deleteApplication);

module.exports = router;
