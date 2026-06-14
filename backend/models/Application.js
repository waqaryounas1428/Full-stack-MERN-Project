const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    jobTitle: String,
    company: String,
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    coverLetter: { type: String, required: true },
    resumeUrl: String,
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

// Duplicate application prevent karna
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
