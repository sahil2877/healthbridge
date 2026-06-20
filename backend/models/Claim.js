const mongoose = require('mongoose');

// An insurance claim filed against a policy
const claimSchema = new mongoose.Schema({
  claimNumber:    { type: String, unique: true },
  policy:         { type: mongoose.Schema.Types.ObjectId, ref: 'InsurancePolicy', required: true },
  patient:        { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  invoice:        { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }, // optional link to a bill

  amountClaimed:  { type: Number, required: true },
  amountApproved: { type: Number, default: 0 },
  preAuthNo:      { type: String },
  notes:          { type: String },

  status: { type: String, enum: ['draft', 'submitted', 'approved', 'rejected', 'paid'], default: 'draft' },

  createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
