const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper: ek JWT token banata hai
function createToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role }, // payload
    process.env.JWT_SECRET,
    { expiresIn: '7d' }                                  // 7 din baad expire
  );
}

// @route  POST /api/auth/register
// @desc   Naya user banao
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // email already exist to nahi karta?
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    // password ko hash karo (plain text kabhi store nahi karte)
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed, role });
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
// @desc   Login karo aur token pao
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // password match karo
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
