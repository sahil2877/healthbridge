const mongoose = require('mongoose');

// Patient = a person who is onboarded ("patient onboarding")
const patientSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  age:         { type: Number, required: true },
  gender:      { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  phone:       { type: String, required: true },
  email:       { type: String },
  address:     { type: String },
  bloodGroup:  { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-','Unknown'], default: 'Unknown' },

  // Which user onboarded this patient (reference to the User model)
  onboardedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
