const Application = require('../models/Application');
const Job = require('../models/job');

exports.submitApplication = async (req, res) => {
    try {
        // Prevent admins from applying
        if (req.user.role === 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Admins cannot apply for jobs.' 
            });
        }

        const { jobId, applicantName, email, phone, coverLetter } = req.body;
        
        // ✅ File upload ho gayi to URL milega
        const resumeUrl = req.file ? req.file.path : null;
        
        console.log('📄 Resume uploaded:', resumeUrl);

        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        
        const application = new Application({
            userId: req.user.id,
            jobId,
            jobTitle: job.title,
            company: job.company,
            applicantName,
            email,
            phone,
            coverLetter,
            resumeUrl  // ✅ Store cloudinary URL
        });
        
        await application.save();
        res.status(201).json({ success: true, message: 'Application submitted', application });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Already applied' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ userId: req.user.id });
        res.status(200).json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find();
        res.status(200).json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const appId = req.params.id;
        const { status } = req.body;
        
        console.log(`📝 Updating application ${appId} status to: ${status}`);
        
        const application = await Application.findById(appId);
        if (!application) {
            console.log(`❌ Application not found with ID: ${appId}`);
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        
        application.status = status;
        await application.save();
        
        console.log(`✅ Application status updated successfully: ${appId} -> ${status}`);
        
        // Send real-time notification to user via Socket.io
        if (req.io) {
            let message = '';
            
            if (status === 'accepted') {
                message = `Congratulations! 🎉\n\nWe are pleased to inform you that your application for the position of ${application.jobTitle} at ${application.company} has been accepted!\n\nOur team will contact you soon with the next steps. Thank you for your interest in joining our organization.`;
            } else if (status === 'rejected') {
                message = `Dear ${application.applicantName},\n\nThank you for your interest in the ${application.jobTitle} position at ${application.company} and for taking the time to apply.\n\nAfter carefully reviewing your application, we have decided not to move forward with your candidacy at this time. Your qualifications and experience do not closely align with the requirements of this role.\n\nWe appreciate your interest in our organization and encourage you to apply for future opportunities that match your skills and experience.\n\nWe wish you success in your job search and future endeavors.\n\nBest regards,\n${application.company} Hiring Team`;
            } else {
                message = `Your application status for ${application.jobTitle} at ${application.company} has been updated to: ${status}`;
            }
            
            req.io.emit('application_status_updated', {
                userId: application.userId,
                applicationId: appId,
                jobTitle: application.jobTitle,
                company: application.company,
                applicantName: application.applicantName,
                status: status,
                message: message
            });
            console.log(`📢 Notification sent to user ${application.userId}`);
        }
        
        res.status(200).json({ success: true, message: 'Status updated', application });
    } catch (error) {
        console.error('❌ Error updating application status:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const appId = req.params.id;
        console.log(`🗑️ Attempting to delete application with ID: ${appId}`);
        
        const application = await Application.findById(appId);
        if (!application) {
            console.log(`❌ Application not found with ID: ${appId}`);
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        
        // Store application data before deletion for notification
        const deletedAppData = {
            userId: application.userId,
            jobTitle: application.jobTitle,
            company: application.company,
            applicantName: application.applicantName
        };
        
        await Application.findByIdAndDelete(appId);
        console.log(`✅ Application deleted successfully: ${appId}`);
        
        // Send professional rejection message via Socket.io
        if (req.io) {
            const professionalMessage = `Dear ${deletedAppData.applicantName},\n\nThank you for your interest in the ${deletedAppData.jobTitle} position at ${deletedAppData.company} and for taking the time to apply.\n\nAfter carefully reviewing your application, we have decided not to move forward with your candidacy at this time. Your qualifications and experience do not closely align with the requirements of this role.\n\nWe appreciate your interest in our organization and encourage you to apply for future opportunities that match your skills and experience.\n\nWe wish you success in your job search and future endeavors.\n\nBest regards,\n${deletedAppData.company} Hiring Team`;
            
            req.io.emit('application_deleted', {
                userId: deletedAppData.userId,
                applicationId: appId,
                jobTitle: deletedAppData.jobTitle,
                company: deletedAppData.company,
                applicantName: deletedAppData.applicantName,
                message: professionalMessage
            });
            console.log(`📢 Deletion notification sent to user ${deletedAppData.userId}`);
        }
        
        res.status(200).json({ success: true, message: 'Application deleted' });
    } catch (error) {
        console.error('❌ Error deleting application:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
