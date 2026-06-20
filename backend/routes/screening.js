const express = require('express');
const router = express.Router();
const Screening = require('../models/Screening');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.use(auth); // all routes require login
router.use(role('admin', 'doctor', 'staff')); // provider-only area

// --- Helper: compute BMI, risk and recommendations from the vitals ---
function evaluate({ heightCm, weightKg, systolic, diastolic, smoker, diabetic }) {
  // BMI = weight(kg) / height(m)^2, rounded to 1 decimal
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  let bmiCategory;
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi < 25) bmiCategory = 'Normal';
  else if (bmi < 30) bmiCategory = 'Overweight';
  else bmiCategory = 'Obese';

  // Build a simple additive risk score
  let riskScore = 0;
  const recommendations = [];

  if (bmiCategory === 'Overweight') {
    riskScore += 1;
    recommendations.push('Maintain a balanced diet and exercise to reach a healthy weight.');
  } else if (bmiCategory === 'Obese') {
    riskScore += 2;
    recommendations.push('Consult a dietitian; weight reduction strongly advised.');
  } else if (bmiCategory === 'Underweight') {
    riskScore += 1;
    recommendations.push('Increase nutritional intake; consider a dietary assessment.');
  }

  // Blood pressure check (only if both values are provided)
  if (systolic && diastolic) {
    if (systolic >= 140 || diastolic >= 90) {
      riskScore += 2;
      recommendations.push('Blood pressure is high; monitor regularly and consult a physician.');
    } else if (systolic >= 130 || diastolic >= 85) {
      riskScore += 1;
      recommendations.push('Blood pressure is slightly elevated; reduce salt and monitor.');
    }
  }

  if (smoker) {
    riskScore += 2;
    recommendations.push('Smoking detected; a cessation program is recommended.');
  }
  if (diabetic) {
    riskScore += 2;
    recommendations.push('Diabetic patient; keep blood sugar under regular control.');
  }

  // Map the numeric score to a level
  let riskLevel;
  if (riskScore <= 1) riskLevel = 'Low';
  else if (riskScore <= 3) riskLevel = 'Medium';
  else riskLevel = 'High';

  if (recommendations.length === 0) {
    recommendations.push('Vitals are within healthy ranges. Keep up the good lifestyle.');
  }

  return { bmi, bmiCategory, riskScore, riskLevel, recommendations };
}

// @route  POST /api/screening  -> run a screening for a patient
router.post('/', async (req, res) => {
  try {
    const result = evaluate(req.body);
    const screening = await Screening.create({
      ...req.body,
      ...result,
      screenedBy: req.user.id
    });
    res.status(201).json(screening);
  } catch (err) {
    res.status(400).json({ message: 'Could not create screening', error: err.message });
  }
});

// @route  GET /api/screening  -> all screenings (optionally filter by ?patient=<id>)
router.get('/', async (req, res) => {
  try {
    const { patient } = req.query;
    const filter = patient ? { patient } : {};
    const screenings = await Screening.find(filter)
      .populate('patient', 'name phone age gender')
      .populate('screenedBy', 'name role')
      .sort({ createdAt: -1 }); // most recent first
    res.json(screenings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  GET /api/screening/:id  -> a single screening
router.get('/:id', async (req, res) => {
  try {
    const screening = await Screening.findById(req.params.id)
      .populate('patient', 'name phone age gender')
      .populate('screenedBy', 'name role');
    if (!screening) return res.status(404).json({ message: 'Screening not found' });
    res.json(screening);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
