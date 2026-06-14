// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// ✅ GENERAL API LIMITER (sabhi routes ke liye)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: {
        success: false,
        message: '⚠️ Too many requests from this IP. Please try again after 15 minutes.',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    handler: (req, res) => {
        console.log(`⚠️ Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: '⚠️ Too many requests from this IP. Please try again after 15 minutes.',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: '15 minutes'
        });
    }
});

// ✅ LOGIN/SIGNUP LIMITER (security ke liye strict)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Only 5 login/signup attempts
    message: {
        success: false,
        message: '🔒 Too many login attempts. Please try again after 15 minutes.',
        code: 'AUTH_RATE_LIMIT'
    },
    skipSuccessfulRequests: true, // Successful login count nahi hogi
    handler: (req, res) => {
        console.log(`🔒 Auth rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: '🔒 Too many authentication attempts. Please try again after 15 minutes.',
            code: 'AUTH_RATE_LIMIT',
            retryAfter: '15 minutes'
        });
    }
});

// ✅ APPLICATION SUBMIT LIMITER
const applicationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 applications per hour
    message: {
        success: false,
        message: '📝 Too many applications. Please wait 1 hour before applying again.',
        code: 'APPLICATION_RATE_LIMIT'
    },
    handler: (req, res) => {
        console.log(`📝 Application rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: '📝 Too many applications submitted. Please wait 1 hour before applying again.',
            code: 'APPLICATION_RATE_LIMIT',
            retryAfter: '1 hour'
        });
    }
});

// ✅ JOB CREATION LIMITER (admin abuse rokne ke liye)
const jobCreationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 jobs per hour
    message: {
        success: false,
        message: '💼 Too many job postings. Please wait 1 hour.',
        code: 'JOB_CREATION_RATE_LIMIT'
    },
    handler: (req, res) => {
        console.log(`💼 Job creation rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: '💼 Too many job postings. Please wait 1 hour before creating more jobs.',
            code: 'JOB_CREATION_RATE_LIMIT',
            retryAfter: '1 hour'
        });
    }
});

// ✅ SEARCH LIMITER (heavy queries ke liye)
const searchLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 searches per minute
    message: {
        success: false,
        message: '🔍 Too many search requests. Please wait a moment.',
        code: 'SEARCH_RATE_LIMIT'
    },
    handler: (req, res) => {
        console.log(`🔍 Search rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: '🔍 Too many search requests. Please wait a moment before searching again.',
            code: 'SEARCH_RATE_LIMIT',
            retryAfter: '1 minute'
        });
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    applicationLimiter,
    jobCreationLimiter,
    searchLimiter
};
