const mongoose = require('mongoose');

// A single prescribed drug line within a prescription
const itemSchema = new mongoose.Schema({
  drugName:     { type: String, required: true },
  dosage:       { type: String },              // e.g. "500mg"
  frequency:    { type: String },              // e.g. "1-0-1" or "Twice a day"
  durationDays: { type: Number },              // number of days
  instructions: { type: String }               // e.g. "After food"
}, { _id: false });

// Prescription = a set of drugs prescribed by a doctor to a patient
const prescriptionSchema = new mongoose.Schema({
  patient:   { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  diagnosis: { type: String },                 // optional context for the Rx
  items:     { type: [itemSchema], required: true },
  notes:     { type: String },                 // advice / follow-up

  status:    { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
