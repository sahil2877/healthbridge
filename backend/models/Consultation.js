const mongoose = require('mongoose');

// A teleconsultation between a patient (user) and a doctor.
// The actual video call happens in a shared room (roomId) embedded on the client.
const consultationSchema = new mongoose.Schema({
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // usually the patient
  doctor:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient:     { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }, // optional clinical link

  reason:  { type: String },
  roomId:  { type: String, required: true },   // unique video room name
  status:  { type: String, enum: ['requested', 'in_progress', 'completed', 'cancelled'], default: 'requested' },
  summary: { type: String },                   // doctor's post-call notes

  startedAt: { type: Date },
  endedAt:   { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
