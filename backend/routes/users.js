const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
// Models needed to cascade-clean a patient-role user's clinical data on delete
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

const ROLES = ['admin', 'doctor', 'staff', 'patient'];

router.use(auth); // all routes require login
router.use(role('admin', 'doctor', 'staff')); // provider-only area

// @route  GET /api/users  -> list users (optionally filter by ?role=doctor)
// Used by the frontend to populate the "doctor" dropdown when booking, and by
// the admin User Management page. Passwords are never returned.
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('name email role createdAt').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Everything below is admin-only user management.
router.use(role('admin'));

// @route  GET /api/users/:id  -> single user (no password)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email role createdAt');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  POST /api/users  -> create a new user (admin only)
// For a patient-role user, also create their linked clinical Patient record once
// (mirrors the /auth/register behaviour, the single source of truth).
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, age, gender, phone, bloodGroup } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }
    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed, role });

    if (role === 'patient') {
      await Patient.create({
        name,
        email,
        age:        age || undefined,
        gender:     gender || undefined,
        phone:      phone || undefined,
        bloodGroup: bloodGroup || 'Unknown',
        user:       user._id
      });
    }

    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(400).json({ message: 'Could not create user', error: err.message });
  }
});

// @route  PUT /api/users/:id  -> update name / email / role (not password)
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (role && !ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Email must stay unique across other users
    if (email) {
      const clash = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (clash) return res.status(400).json({ message: 'Email already in use by another user' });
    }

    const update = {};
    if (name)  update.name = name;
    if (email) update.email = email;
    if (role)  update.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true })
      .select('name email role createdAt');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Keep the linked Patient record's basic info in sync for patient users
    if (user.role === 'patient') {
      await Patient.findOneAndUpdate({ user: user._id }, {
        ...(name ? { name } : {}),
        ...(email ? { email } : {})
      });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Could not update user', error: err.message });
  }
});

// @route  PUT /api/users/:id/password  -> admin resets a user's password
router.put('/:id/password', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.findByIdAndUpdate(req.params.id, { password: hashed }, { new: true })
      .select('name email role');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(400).json({ message: 'Could not update password', error: err.message });
  }
});

// @route  DELETE /api/users/:id  -> delete a user (admin only)
// Admins cannot delete themselves. Deleting a patient-role user also cascades to
// their clinical Patient record and all related data (no orphaned references).
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (String(userId) === String(req.user.id)) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'patient') {
      const patient = await Patient.findOne({ user: userId });
      if (patient) {
        const patientId = patient._id;
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
      }
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
