const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: String,
    experience: { type: String, enum: ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'] },
    description: { type: String, required: true },
    type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'], default: 'full-time' },
    category: String, // e.g., 'IT', 'Finance', 'Healthcare'
    skills: [String], // Array of required skills
    requirements: String, // Additional requirements
    benefits: String, // Job benefits
    deadline: Date, // Application deadline
    postedBy: { type: mongoose.Schema.Types.Mixed },  // ✅ Allow both ObjectId and String
}, { timestamps: true, strict: false }); // strict: false allows additional fields from MongoDB

module.exports = mongoose.model('Job', jobSchema);
