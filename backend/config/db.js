const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Check if MONGODB_URI is defined
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is not defined in .env file');
            console.error('💡 Please check backend/.env file');
            process.exit(1);
        }

        console.log('🔄 Connecting to MongoDB...');
        console.log('📍 URI:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@')); // Hide credentials in log
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.error('💡 Check if MongoDB is running or connection string is correct');
        process.exit(1);
    }
};

module.exports = connectDB;
