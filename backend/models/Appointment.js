
  const mongoose = require('mongoose');

  // Appointment = which patient, with which doctor, and when they meet
  const appointmentSchema = new mongoose.Schema({
    // Which patient the appointment is for (reference to the Patient model)
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },

    // With which doctor (reference to the User model)
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    date:    { type: Date, required: true },   // appointment date + time
    reason:  { type: String, required: true }, // reason for the visit (e.g. "Fever checkup")
    notes:   { type: String },                 // extra notes from the doctor

    // appointment state
    status:  { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },

    // Who booked it (the logged-in user)
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }, { timestamps: true }); // createdAt / updatedAt added automatically

  module.exports = mongoose.model('Appointment', appointmentSchema);
