const mongoose = require('mongoose');

// MongoDB se connect karne ka function
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // connection fail ho to server band kar do
  }
}

module.exports = connectDB;
