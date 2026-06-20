const mongoose = require('mongoose');

// Screening = an intelligent health check for a patient.
// The vitals (height, weight, BP, lifestyle flags) are provided as input,
// while BMI, bmiCategory, riskScore, riskLevel and recommendations are
// computed by the server and stored here.
const screeningSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },

  // --- Inputs (vitals) ---
  heightCm:  { type: Number, required: true }, // height in centimetres
  weightKg:  { type: Number, required: true }, // weight in kilograms
  systolic:  { type: Number },                 // upper blood pressure number
  diastolic: { type: Number },                 // lower blood pressure number
  smoker:    { type: Boolean, default: false },
  diabetic:  { type: Boolean, default: false },

  // --- Computed results ---
  bmi:          { type: Number },
  bmiCategory:  { type: String },  // Underweight / Normal / Overweight / Obese
  riskScore:    { type: Number },  // numeric score used to derive riskLevel
  riskLevel:    { type: String, enum: ['Low', 'Medium', 'High'] },
  recommendations: [{ type: String }],

  screenedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Screening', screeningSchema);
