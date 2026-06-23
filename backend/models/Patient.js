const mongoose = require('mongoose');

// Patient = a person who is onboarded ("patient onboarding")
const patientSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  // age/gender/phone are required during provider onboarding but optional for a
  // self-service record created from a patient login (the patient fills these later).
  age:         { type: Number },
  gender:      { type: String, enum: ['Male', 'Female', 'Other'] },
  phone:       { type: String },
  email:       { type: String },
  address:     { type: String },
  bloodGroup:  { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-','Unknown'], default: 'Unknown' },

  // Medical profile — key history for safer clinical decisions
  allergies:           { type: String },   // e.g. "Penicillin, Peanuts"
  chronicConditions:   { type: String },   // e.g. "Diabetes Type 2, Hypertension"
  currentMedications:  { type: String },   // e.g. "Metformin 500mg, Lisinopril 10mg"

  // Emergency contact
  emergencyContactName:  { type: String },
  emergencyContactPhone: { type: String },

  // Physical measurements (helpful for dosage calculations, BMI, etc.)
  height: { type: Number },   // cm
  weight: { type: Number },   // kg

  // The patient-portal login this record belongs to (links a User to clinical data)
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Which user onboarded this patient (reference to the User model)
  onboardedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
