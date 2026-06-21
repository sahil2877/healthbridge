const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const notify = require('../utils/notify');

router.use(auth);

// @route  GET /api/consultations/doctors  -> doctors a patient can consult (any logged-in)
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name email').sort({ name: 1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  POST /api/consultations  -> request a consultation (any logged-in user)
router.post('/', async (req, res) => {
  try {
    const { doctor, reason, patient } = req.body;
    if (!doctor) return res.status(400).json({ message: 'Doctor is required' });

    const roomId = 'healthbridge-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    const consultation = await Consultation.create({
      requestedBy: req.user.id, doctor, patient, reason, roomId
    });

    notify(doctor, {
      type: 'consult',
      title: 'New teleconsultation request',
      body: reason ? `Reason: ${reason}` : 'A patient requested a video consultation.',
      link: '/consultations'
    });

    res.status(201).json(consultation);
  } catch (err) {
    res.status(400).json({ message: 'Could not create consultation', error: err.message });
  }
});

// @route  GET /api/consultations  -> list (scoped by role)
router.get('/', async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'patient') filter = { requestedBy: req.user.id };
    else if (req.user.role === 'doctor') filter = { doctor: req.user.id };
    // admin / staff see all

    const consultations = await Consultation.find(filter)
      .populate('doctor', 'name')
      .populate('requestedBy', 'name role')
      .populate('patient', 'name phone')
      .sort({ createdAt: -1 });
    res.json(consultations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  GET /api/consultations/:id  -> one (participants only)
router.get('/:id', async (req, res) => {
  try {
    const c = await Consultation.findById(req.params.id)
      .populate('doctor', 'name')
      .populate('requestedBy', 'name role')
      .populate('patient', 'name phone');
    if (!c) return res.status(404).json({ message: 'Consultation not found' });

    const isParticipant =
      String(c.requestedBy?._id) === req.user.id ||
      String(c.doctor?._id) === req.user.id ||
      req.user.role === 'admin' || req.user.role === 'staff';
    if (!isParticipant) return res.status(403).json({ message: 'Access denied' });

    res.json(c);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  PATCH /api/consultations/:id/status  -> start / end / cancel
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === 'in_progress') update.startedAt = new Date();
    if (status === 'completed') update.endedAt = new Date();

    const c = await Consultation.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!c) return res.status(404).json({ message: 'Consultation not found' });
    res.json(c);
  } catch (err) {
    res.status(400).json({ message: 'Could not update', error: err.message });
  }
});

// @route  PUT /api/consultations/:id  -> doctor adds a post-call summary
router.put('/:id', role('admin', 'doctor'), async (req, res) => {
  try {
    const c = await Consultation.findByIdAndUpdate(req.params.id, { summary: req.body.summary }, { new: true });
    if (!c) return res.status(404).json({ message: 'Consultation not found' });
    res.json(c);
  } catch (err) {
    res.status(400).json({ message: 'Could not update', error: err.message });
  }
});

module.exports = router;
