const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patient');

// Helper: creates a JWT token
function createToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role }, // payload
    process.env.JWT_SECRET,
    { expiresIn: '7d' }                                  // expires after 7 days
  );
}

// @route  POST /api/auth/register
// @desc   Create a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, age, gender, phone, bloodGroup } = req.body;

    // Check whether the email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // Hash the password (never store plain text)
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed, role });

    // For a patient signup, create their clinical Patient record ONCE here with the
    // details they entered. This is the single source of truth and prevents the
    // portal from lazily creating duplicate blank records later (race condition).
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

    const token = createToken(user);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  POST /api/auth/login
// @desc   Log in and receive a token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Verify the password matches
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = createToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
