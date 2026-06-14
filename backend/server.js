require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { generalLimiter } = require('./middleware/rateLimiter'); // ✅ Rate Limiter
const logger = require('./config/logger'); // ✅ Winston Logger
const requestLogger = require('./middleware/requestLogger'); // ✅ Request Logger

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const statsRoutes = require('./routes/stats');

const app = express();
const server = http.createServer(app);

// Allowed origins for CORS
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    },
    // ✅ Increase timeouts to prevent disconnects
    pingTimeout: 60000,      // 60 seconds
    pingInterval: 25000,     // 25 seconds
    upgradeTimeout: 30000,   // 30 seconds
    // ✅ Enable compression for better performance
    perMessageDeflate: {
        threshold: 1024
    },
    // ✅ Max HTTP buffer size
    maxHttpBufferSize: 1e6,
    // ✅ Allow binary data
    allowEIO3: true
});

// Connect to database
connectDB();

// Middleware
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));
app.use(express.json());
app.use(requestLogger); // ✅ Log all HTTP requests

// ✅ Apply rate limiting to API routes only (not Socket.IO)
app.use('/api', generalLimiter);

// Make io accessible to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/stats', statsRoutes);

// ============ Socket.io Events ============
io.on('connection', (socket) => {
    logger.logInfo('New user connected', { 
        socketId: socket.id,
        transport: socket.conn.transport.name 
    });
    
    // Log transport upgrade
    socket.conn.on('upgrade', (transport) => {
        logger.logInfo('Transport upgraded', { 
            socketId: socket.id,
            transport: transport.name 
        });
    });

    // When user disconnects
    socket.on('disconnect', (reason) => {
        logger.logInfo('User disconnected', { 
            socketId: socket.id,
            reason: reason 
        });
    });
    
    // Handle errors
    socket.on('error', (error) => {
        logger.logError('Socket error', error, { socketId: socket.id });
    });

    // Event: New job created
    socket.on('job_created', (job) => {
        logger.logInfo('New job created', { jobTitle: job.title, jobId: job._id });
        io.emit('new_job', job);
    });

    // Event: Job deleted
    socket.on('job_deleted', (jobId) => {
        logger.logInfo('Job deleted', { jobId });
        io.emit('job_removed', jobId);
    });

    // Event: Job updated
    socket.on('job_updated', (job) => {
        logger.logInfo('Job updated', { jobTitle: job.title, jobId: job._id });
        io.emit('job_changed', job);
    });

    // Event: Application submitted
    socket.on('application_submitted', (data) => {
        logger.logInfo('New application submitted', { company: data.company, applicant: data.applicantName });
        io.emit('new_application', data);
    });
     // Event: Application status changed (admin rejects/accepts)
    socket.on('application_status_changed', (data) => {
        logger.logInfo('Application status changed', { status: data.status, applicationId: data.applicationId });
        io.emit('application_status_updated', data);
    });

    // Event: New message received
    socket.on('send_message', (message) => {
        logger.logDebug('Message received', { message });
        io.emit('receive_message', message);
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
    // Log error with Winston
    logger.logError('Server Error', err, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: req.user?.id
    });
    
    res.status(500).json({ 
        success: false, 
        message: process.env.NODE_ENV === 'production' ? 'Server error' : err.message 
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    logger.logInfo('Server started', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        socketEnabled: true
    });
    
    console.log(`
    ╔════════════════════════════════════════╗
    ║   🚀 Job Portal Backend Server         ║
    ║   Running on: http://localhost:${PORT}   ║
    ║   Environment: ${process.env.NODE_ENV || 'development'}        ║
    ║   ✅ Socket.io Enabled                 ║
    ║   ✅ Winston Logging Enabled           ║
    ╚════════════════════════════════════════╝
    `);
});
