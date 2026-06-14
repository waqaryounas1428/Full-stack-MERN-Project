const express = require('express');
const { getAllJobs, createJob, updateJob, deleteJob, searchJobs } = require('../controllers/jobController');
const { auth, adminOnly } = require('../middleware/auth');
const { jobCreationLimiter, searchLimiter } = require('../middleware/rateLimiter'); // ✅ Rate Limiters

const router = express.Router();

router.get('/', getAllJobs);
router.get('/search', searchLimiter, searchJobs); // ✅ Rate limit on search
router.post('/', auth, adminOnly, jobCreationLimiter, createJob); // ✅ Rate limit on job creation
router.put('/:id', auth, adminOnly, updateJob);
router.delete('/:id', auth, adminOnly, deleteJob);

module.exports = router;
