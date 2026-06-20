const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// router.use(auth) -> all routes in this file require login
router.use(auth);
// Provider-only area: patients (consumer role) cannot access these endpoints
router.use(role('admin', 'doctor', 'staff'));

// @route  POST /api/patients  -> patient onboarding
router.post('/', async (req, res) => {
  try {
    const patient = await Patient.create({ ...req.body, onboardedBy: req.user.id });
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: 'Could not create patient', error: err.message });
  }
});

// @route  GET /api/patients  -> all patients (with search)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    // If a search term is provided, filter by name/phone
    const filter = search
      ? { $or: [
          { name:  { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ] }
      : {};
    const patients = await Patient.find(filter).sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  GET /api/patients/:id  -> details of a single patient
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  PUT /api/patients/:id  -> update a patient
router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ message: 'Could not update', error: err.message });
  }
});

// @route  DELETE /api/patients/:id  -> delete a patient (admin only)
router.delete('/:id', role('admin'), async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
