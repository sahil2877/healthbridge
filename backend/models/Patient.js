const mongoose = require('mongoose');

// Patient = jo onboard hota hai (resume ka "patient onboarding")
const patientSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  age:         { type: Number, required: true },
  gender:      { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  phone:       { type: String, required: true },
  email:       { type: String },
  address:     { type: String },
  bloodGroup:  { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-','Unknown'], default: 'Unknown' },

  // kis user ne onboard kiya (User model se reference)
  onboardedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
