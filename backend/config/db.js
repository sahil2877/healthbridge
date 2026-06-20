const mongoose = require('mongoose');

// Function to connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); // if the connection fails, shut down the server
  }
}

module.exports = connectDB;
