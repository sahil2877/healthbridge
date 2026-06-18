const mongoose = require('mongoose');

// User = staff/doctor/admin jo system mein login karta hai
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },           // hashed form mein store hoga
  role:     { type: String, enum: ['admin', 'doctor', 'staff'], default: 'staff' }
}, { timestamps: true }); // createdAt aur updatedAt automatic add ho jate hain

module.exports = mongoose.model('User', userSchema);
