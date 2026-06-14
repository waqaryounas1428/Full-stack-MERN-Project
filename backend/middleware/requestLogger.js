// backend/middleware/requestLogger.js
const logger = require('../config/logger');

// Middleware to log all HTTP requests
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Log when response finishes
    res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        
        // Determine log level based on status code
        const level = res.statusCode >= 400 ? 'error' : 'info';
        
        logger.log(level, 'HTTP Request', {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            statusCode: res.statusCode,
            responseTime: `${responseTime}ms`,
            userId: req.user?.id || 'anonymous'
        });
    });
    
    next();
};

module.exports = requestLogger;
