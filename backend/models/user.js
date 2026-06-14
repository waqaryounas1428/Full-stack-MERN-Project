const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },  // ✅ CHANGED: Not required, can be null
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshToken: { type: String, select: false }, // ✅ NEW: Store refresh token
    refreshTokenExpiry: { type: Date, select: false }, // ✅ NEW: Token expiry date
}, { timestamps: true });

// Password hash karna before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Password compare karna
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
