const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const auth = require('../middleware/auth');

// router.use(auth) -> is file ke saare routes par login zaroori
router.use(auth);

// @route  POST /api/patients  -> patient onboarding
router.post('/', async (req, res) => {
  try {
    const patient = await Patient.create({ ...req.body, onboardedBy: req.user.id });
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ message: 'Could not create patient', error: err.message });
  }
});

// @route  GET /api/patients  -> saare patients (search ke saath)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    // agar search diya hai to name/phone par filter karo
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

// @route  GET /api/patients/:id  -> ek patient ki detail
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  PUT /api/patients/:id  -> update
router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(400).json({ message: 'Could not update', error: err.message });
  }
});

// @route  DELETE /api/patients/:id  -> delete
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
