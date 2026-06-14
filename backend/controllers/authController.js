const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const logger = require('../config/logger'); // ✅ Winston Logger

// Generate Access Token (short-lived)
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // ✅ 15 minutes only
    );
};

// Generate Refresh Token (long-lived, random string)
const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Generate both tokens and save refresh token to database
const generateTokens = async (user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    
    // Save refresh token to database with expiry (7 days)
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
    
    await User.findByIdAndUpdate(user._id, {
        refreshToken: refreshToken,
        refreshTokenExpiry: refreshTokenExpiry
    });
    
    return { accessToken, refreshToken, refreshTokenExpiry };
};

exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        
        // At least one of email or phone must be provided
        if (!email && !phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email or phone is required' 
            });
        }
        
        // Build query conditions - only check fields that are provided
        const conditions = [];
        if (email) conditions.push({ email });
        if (phone) conditions.push({ phone });
        
        // Check if user exists by email OR phone
        if (conditions.length > 0) {
            const existingUser = await User.findOne({ $or: conditions });
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'User with this email or phone already exists' 
                });
            }
        }

        // Create user object - only include email/phone if provided
        const userData = { 
            firstName, 
            lastName, 
            password, 
            role: 'user' 
        };
        
        // Only add email if provided (not null/undefined)
        if (email) userData.email = email;
        
        // Only add phone if provided (not null/undefined)
        if (phone) userData.phone = phone;

        const user = new User(userData);
        await user.save();

        // ✅ Generate both access and refresh tokens
        const { accessToken, refreshToken, refreshTokenExpiry } = await generateTokens(user);
        
        logger.logInfo('User registered successfully', {
            userId: user._id,
            email: user.email || 'N/A',
            phone: user.phone || 'N/A',
            role: user.role
        });
        
        res.status(201).json({
            success: true,
            message: 'User registered',
            user: { 
                _id: user._id, 
                name: `${user.firstName} ${user.lastName}`, 
                email: user.email || null,
                phone: user.phone || null,
                role: user.role 
            },
            accessToken,
            refreshToken,
            refreshTokenExpiry
        });
    } catch (error) {
        logger.logError('Signup error', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;

        if (!emailOrPhone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email or phone is required' 
            });
        }

        // Build query - search by email OR phone
        const user = await User.findOne({ 
            $or: [
                { email: emailOrPhone },
                { phone: emailOrPhone }
            ]
        }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // ✅ Generate both access and refresh tokens
        const { accessToken, refreshToken, refreshTokenExpiry } = await generateTokens(user);
        
        logger.logInfo('User logged in successfully', {
            userId: user._id,
            email: user.email || 'N/A',
            phone: user.phone || 'N/A',
            role: user.role
        });
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: { 
                _id: user._id, 
                name: `${user.firstName} ${user.lastName}`, 
                email: user.email || null, 
                phone: user.phone || null, 
                role: user.role 
            },
            accessToken,
            refreshToken,
            refreshTokenExpiry
        });
    } catch (error) {
        logger.logError('Login error', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        // ✅ Clear refresh token from database on logout
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            await User.findByIdAndUpdate(decoded.id, {
                refreshToken: null,
                refreshTokenExpiry: null
            });
        }
        
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        // Even if there's an error, consider it logged out
        res.status(200).json({ success: true, message: 'Logged out' });
    }
};

// ✅ NEW: Refresh Token Endpoint
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(401).json({ 
                success: false, 
                message: 'Refresh token is required' 
            });
        }
        
        // Find user with this refresh token
        const user = await User.findOne({ 
            refreshToken: refreshToken 
        }).select('+refreshToken +refreshTokenExpiry');
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid refresh token' 
            });
        }
        
        // Check if refresh token is expired
        if (new Date() > user.refreshTokenExpiry) {
            return res.status(401).json({ 
                success: false, 
                message: 'Refresh token expired. Please login again.' 
            });
        }
        
        // Generate new access token
        const accessToken = generateAccessToken(user);
        
        logger.logInfo('Access token refreshed', { userId: user._id });
        
        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            accessToken,
            user: { 
                _id: user._id, 
                name: `${user.firstName} ${user.lastName}`, 
                email: user.email || null, 
                phone: user.phone || null, 
                role: user.role 
            }
        });
    } catch (error) {
        logger.logError('Refresh token error', error);
        res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired refresh token' 
        });
    }
};
