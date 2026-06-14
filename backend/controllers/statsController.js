// backend/controllers/statsController.js
const Job = require('../models/job');
const User = require('../models/user');
const Application = require('../models/Application');

// ===== GET ADMIN DASHBOARD STATISTICS =====
exports.getAdminStats = async (req, res) => {
    try {
        console.log('📊 Fetching admin dashboard statistics...');

        // Basic Counts
        const totalJobs = await Job.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalApplications = await Application.countDocuments();

        // Application Status Counts
        const acceptedApps = await Application.countDocuments({ status: 'accepted' });
        const rejectedApps = await Application.countDocuments({ status: 'rejected' });
        const pendingApps = await Application.countDocuments({ status: 'pending' });

        // Calculate acceptance rate
        const acceptanceRate = totalApplications > 0 
            ? ((acceptedApps / totalApplications) * 100).toFixed(1)
            : 0;

        // Recent Activity (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentJobs = await Job.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        const recentApplications = await Application.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        const recentUsers = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // This Month Activity
        const firstDayOfMonth = new Date();
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0, 0, 0, 0);

        const jobsThisMonth = await Job.countDocuments({
            createdAt: { $gte: firstDayOfMonth }
        });

        const applicationsThisMonth = await Application.countDocuments({
            createdAt: { $gte: firstDayOfMonth }
        });

        // Job Type Distribution
        const jobsByType = await Job.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Top 5 Most Applied Jobs
        const topJobs = await Application.aggregate([
            {
                $group: {
                    _id: '$jobId',
                    applicationCount: { $sum: 1 },
                    jobTitle: { $first: '$jobTitle' },
                    company: { $first: '$company' }
                }
            },
            { $sort: { applicationCount: -1 } },
            { $limit: 5 }
        ]);

        // Jobs by Location
        const jobsByLocation = await Job.aggregate([
            {
                $group: {
                    _id: '$location',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        console.log('✅ Admin stats fetched successfully');

        res.status(200).json({
            success: true,
            stats: {
                // Basic Stats
                totalJobs,
                totalUsers,
                totalApplications,
                
                // Application Status
                acceptedApps,
                rejectedApps,
                pendingApps,
                acceptanceRate,
                
                // Recent Activity (7 days)
                recentJobs,
                recentApplications,
                recentUsers,
                
                // This Month
                jobsThisMonth,
                applicationsThisMonth,
                
                // Advanced Stats
                jobsByType,
                topJobs,
                jobsByLocation
            }
        });
    } catch (error) {
        console.error('❌ Error fetching admin stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
};
