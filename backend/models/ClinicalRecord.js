
  const mongoose = require('mongoose');

  // ClinicalRecord = the medical record for a single patient visit
  const recordSchema = new mongoose.Schema({
    patient:   { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    visitDate:    { type: Date, default: Date.now },     // when the visit happened
    diagnosis:    { type: String, required: true },      // illness/diagnosis
    prescription: { type: String },                      // medication
    notes:        { type: String },                      // extra notes

    // attached files (reports, x-ray, etc.) — a record can have multiple documents
    documents: [{
      fileName:     { type: String }, // name stored on the server
      originalName: { type: String }, // name the user originally provided
      url:          { type: String }, // path to open in the browser
      uploadedAt:   { type: Date, default: Date.now }
    }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }, { timestamps: true });

  module.exports = mongoose.model('ClinicalRecord', recordSchema);
