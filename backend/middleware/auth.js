const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided',
                code: 'NO_TOKEN'
            });
        }
        
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Access token expired. Please refresh your token.',
                code: 'TOKEN_EXPIRED'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token',
                code: 'INVALID_TOKEN'
            });
        }
        
        res.status(401).json({ 
            success: false, 
            message: 'Authentication failed',
            code: 'AUTH_FAILED'
        });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin only' });
    }
    next();
};

module.exports = { auth, adminOnly };
