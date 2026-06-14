const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'job-portal/resumes',
            format: file.originalname.split('.').pop(), // Get extension
            resource_type: 'auto', // Let Cloudinary auto-detect
            public_id: `resume-${Date.now()}-${Math.round(Math.random() * 1E9)}`
        };
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 
                             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, DOCX files allowed'));
        }
    }
});

module.exports = upload;
