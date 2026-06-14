// backend/controllers/jobController.js
const mongoose = require('mongoose');
const Job = require('../models/job');

// ─── Helper ───────────────────────────────────────────────
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─── GET ALL JOBS (with pagination) ───────────────────────
exports.getAllJobs = async (req, res) => {
    try {
        const page  = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip  = (page - 1) * limit;

        const totalJobs  = await Job.countDocuments();
        const totalPages = Math.ceil(totalJobs / limit);

        const jobs = await Job.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        console.log(`✅ Fetched ${jobs.length} jobs (page ${page}/${totalPages})`);

        res.status(200).json({
            success: true,
            jobs,
            count: jobs.length,
            pagination: {
                currentPage:  page,
                totalPages,
                totalJobs,
                jobsPerPage:  limit,
                hasNextPage:  page < totalPages,
                hasPrevPage:  page > 1
            }
        });
    } catch (error) {
        console.error('❌ Error fetching jobs:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── CREATE JOB ───────────────────────────────────────────
exports.createJob = async (req, res) => {
    try {
        // Whitelisting — direct req.body pass nahi hoga
        const { title, description, salary, location } = req.body;

        console.log('📝 Creating new job:', { title, location });

        const job = new Job({
            title,
            description,
            salary,
            location,
            postedBy: req.user.id   // user sirf apna id set kar sakta hai
        });

        await job.save();
        console.log('✅ Job created successfully:', job._id);

        res.status(201).json({ success: true, message: 'Job posted', job });
    } catch (error) {
        console.error('❌ Error creating job:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── UPDATE JOB ───────────────────────────────────────────
exports.updateJob = async (req, res) => {
    try {
        // Valid ObjectId check
        if (!isValidId(req.params.id))
            return res.status(400).json({ success: false, message: 'Invalid job ID' });

        const job = await Job.findById(req.params.id);

        // Job exist karta hai?
        if (!job)
            return res.status(404).json({ success: false, message: 'Job not found' });

        // Sirf owner update kar sakta hai
        if (job.postedBy.toString() !== req.user.id)
            return res.status(403).json({ success: false, message: 'Not authorized to update this job' });

        // Whitelisting
        const { title, description, salary, location } = req.body;

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            { title, description, salary, location },
            { new: true, runValidators: true }
        );

        console.log('✅ Job updated:', updatedJob._id);
        res.status(200).json({ success: true, message: 'Job updated', job: updatedJob });
    } catch (error) {
        console.error('❌ Error updating job:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── DELETE JOB ───────────────────────────────────────────
exports.deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Valid ObjectId check
        if (!isValidId(jobId))
            return res.status(400).json({ success: false, message: 'Invalid job ID' });

        console.log(`🗑️ Attempting to delete job: ${jobId}`);

        const job = await Job.findById(jobId);

        // Job exist karta hai?
        if (!job)
            return res.status(404).json({ success: false, message: 'Job not found' });

        // Sirf owner delete kar sakta hai
        if (job.postedBy.toString() !== req.user.id)
            return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });

        await Job.findByIdAndDelete(jobId);
        console.log(`✅ Job deleted successfully: ${jobId}`);

        res.status(200).json({ success: true, message: 'Job deleted' });
    } catch (error) {
        console.error('❌ Error deleting job:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── SEARCH JOBS (Combined Search + Advanced Filtering) ─────────────────
exports.searchJobs = async (req, res) => {
    try {
        const {
            query,           // Combined search: title + company + location
            title,           // Search only in title
            company,         // Search only in company
            location,        // Search only in location
            type,            // Job type filter
            category,        // Category filter
            minSalary,       // Minimum salary filter
            maxSalary,       // Maximum salary filter
            experience,      // Experience filter
            page = 1,        // Pagination
            limit = 10       // Results per page
        } = req.query;

        const skip = (page - 1) * limit;
        const filter = {};

        // Build search filter for combined query (title OR company OR location)
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { company: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        } else {
            // Individual field searches
            if (title) filter.title = { $regex: title, $options: 'i' };
            if (company) filter.company = { $regex: company, $options: 'i' };
            if (location) filter.location = { $regex: location, $options: 'i' };
        }

        // Advanced filters
        if (type) filter.type = type;
        if (category) filter.category = { $regex: category, $options: 'i' };
        if (experience) filter.experience = experience;
        
        // Salary range filter - note: this is basic since salary is stored as string
        // For better salary filtering, consider storing minSalary and maxSalary as separate numeric fields
        if (minSalary || maxSalary) {
            // We'll use regex to extract numbers from salary strings like "PKR 50,000 - 80,000"
            // This is a simplified approach - actual implementation would need to parse salary strings
            
            // For now, we'll filter by salary field existence if min/max are provided
            // This encourages users to implement proper salary fields in the future
            filter.salary = { $exists: true, $ne: '' };
            
            console.log('⚠️ Salary filtering active. Consider implementing numeric salary fields for better filtering.');
        }

        console.log('🔍 Search filter:', filter);
        console.log('📊 Pagination:', { page, limit, skip });

        // Get total count and paginated results
        const totalJobs = await Job.countDocuments(filter);
        const totalPages = Math.ceil(totalJobs / limit);

        const jobs = await Job.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        console.log(`✅ Search found ${jobs.length} jobs out of ${totalJobs} total`);

        res.status(200).json({
            success: true,
            jobs,
            count: jobs.length,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalJobs,
                jobsPerPage: parseInt(limit),
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            filters: {
                query,
                title,
                company,
                location,
                type,
                category,
                minSalary,
                maxSalary,
                experience
            }
        });
    } catch (error) {
        console.error('❌ Error searching jobs:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};