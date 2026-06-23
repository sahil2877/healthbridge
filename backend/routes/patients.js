const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const ClinicalRecord = require('../models/ClinicalRecord');
const Prescription = require('../models/Prescription');
const Invoice = require('../models/Invoice');
const Screening = require('../models/Screening');
const LabOrder = require('../models/LabOrder');
const Consultation = require('../models/Consultation');
const InsurancePolicy = require('../models/InsurancePolicy');
const Claim = require('../models/Claim');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { getOrCreateSelfPatient } = require('../utils/selfPatient');

// router.use(auth) -> all routes in this file require login
router.use(auth);

// @route  GET /api/patients/me  -> the logged-in patient's own clinical record
// Accessible to patients (declared before the provider-only guard below).
router.get('/me', async (req, res) => {
  try {
    const patient = await getOrCreateSelfPatient(req.user);
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Provider-only area: patients (consumer role) cannot access the endpoints below
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

// @route  DELETE /api/patients/:id  -> delete a patient + all related records (admin only)
router.delete('/:id', role('admin'), async (req, res) => {
  try {
    const patientId = req.params.id;

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Cascade-delete every related record so no orphaned references remain.
    // Appointments list, records, prescriptions etc. would show blank data
    // when their linked patient no longer exists.
    await Promise.all([
      Appointment.deleteMany({ patient: patientId }),
      ClinicalRecord.deleteMany({ patient: patientId }),
      Prescription.deleteMany({ patient: patientId }),
      Invoice.deleteMany({ patient: patientId }),
      Screening.deleteMany({ patient: patientId }),
      LabOrder.deleteMany({ patient: patientId }),
      Consultation.deleteMany({ patient: patientId }),
      InsurancePolicy.deleteMany({ patient: patientId }),
      Claim.deleteMany({ patient: patientId }),
    ]);

    await Patient.findByIdAndDelete(patientId);

    res.json({ message: 'Patient and all related records deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
