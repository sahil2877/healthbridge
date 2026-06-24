const mongoose = require('mongoose');

// User = the staff/doctor/admin who logs into the system
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },           // stored in hashed form
  role:     { type: String, enum: ['admin', 'doctor', 'staff', 'patient'], default: 'staff' }
}, {
  timestamps: true, // createdAt and updatedAt are added automatically
  // Expose the `id` virtual (string form of _id) in API responses. The whole
  // app/front-end treats `id` as the canonical user identifier (auth responses
  // already return `id`), so list endpoints must include it too — otherwise
  // doctor dropdowns that bind to `d.id` submit an empty value.
  toJSON: { virtuals: true }
});

module.exports = mongoose.model('User', userSchema);
