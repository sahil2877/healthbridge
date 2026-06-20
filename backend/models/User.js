const mongoose = require('mongoose');

// User = the staff/doctor/admin who logs into the system
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },           // stored in hashed form
  role:     { type: String, enum: ['admin', 'doctor', 'staff'], default: 'staff' }
}, { timestamps: true }); // createdAt and updatedAt are added automatically

module.exports = mongoose.model('User', userSchema);
