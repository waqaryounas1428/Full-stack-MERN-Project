// backend/config/logger.js
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file'); // ✅ Import daily rotate
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Console format (readable for development)
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
        }
        return msg;
    })
);

// Create Winston logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'job-portal-backend' },
    transports: [
        // Error logs - separate file
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        
        // Combined logs - all levels
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        
        // Daily rotating file for production
        new DailyRotateFile({
            filename: path.join(logsDir, 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d', // Keep logs for 14 days
        }),
    ],
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat,
    }));
}

// Create wrapper functions for easy logging
logger.logInfo = (message, meta = {}) => {
    logger.info(message, meta);
};

logger.logError = (message, error = null, meta = {}) => {
    if (error) {
        logger.error(message, {
            error: error.message,
            stack: error.stack,
            ...meta
        });
    } else {
        logger.error(message, meta);
    }
};

logger.logWarn = (message, meta = {}) => {
    logger.warn(message, meta);
};

logger.logDebug = (message, meta = {}) => {
    logger.debug(message, meta);
};

// Log HTTP requests
logger.logRequest = (req, res, responseTime) => {
    logger.info('HTTP Request', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
    });
};

module.exports = logger;
