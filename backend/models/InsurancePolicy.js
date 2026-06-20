const mongoose = require('mongoose');

// An insurance policy held by a patient
const policySchema = new mongoose.Schema({
  patient:        { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  payerName:      { type: String, required: true },   // insurance company
  policyNumber:   { type: String, required: true },
  holderName:     { type: String },                   // policy holder (may differ from patient)
  coverageAmount: { type: Number, default: 0 },
  validFrom:      { type: Date },
  validTo:        { type: Date },
  notes:          { type: String },
  createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('InsurancePolicy', policySchema);
