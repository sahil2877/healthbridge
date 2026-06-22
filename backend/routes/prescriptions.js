const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { getOrCreateSelfPatient } = require('../utils/selfPatient');

router.use(auth); // all routes require login
// Reads below are role-scoped per handler (patients see only their own);
// mutating routes are individually guarded with role('admin', 'doctor').

// @route  POST /api/prescriptions  -> create a prescription (admin or doctor)
router.post('/', role('admin', 'doctor'), async (req, res) => {
  try {
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ message: 'At least one medicine is required' });
    }
    const prescription = await Prescription.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ message: 'Could not create prescription', error: err.message });
  }
});

// @route  GET /api/prescriptions  -> prescriptions (optionally filter by ?patient=<id>)
// Patients are scoped to their own record regardless of the query.
router.get('/', async (req, res) => {
  try {
    const { patient } = req.query;
    let filter = patient ? { patient } : {};
    if (req.user.role === 'patient') {
      const self = await getOrCreateSelfPatient(req.user);
      filter = { patient: self._id };
    }
    const prescriptions = await Prescription.find(filter)
      .populate('patient', 'name phone age gender')
      .populate('doctor', 'name role')
      .sort({ createdAt: -1 }); // most recent first
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  GET /api/prescriptions/:id  -> a single prescription
router.get('/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name phone age gender bloodGroup')
      .populate('doctor', 'name role email');
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });

    if (req.user.role === 'patient') {
      const self = await getOrCreateSelfPatient(req.user);
      const owner = prescription.patient?._id || prescription.patient;
      if (String(owner) !== String(self._id)) return res.status(403).json({ message: 'Access denied' });
    }
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  PUT /api/prescriptions/:id  -> update (admin or doctor)
router.put('/:id', role('admin', 'doctor'), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    res.status(400).json({ message: 'Could not update', error: err.message });
  }
});

// @route  DELETE /api/prescriptions/:id  -> delete (admin or doctor)
router.delete('/:id', role('admin', 'doctor'), async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.json({ message: 'Prescription deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
