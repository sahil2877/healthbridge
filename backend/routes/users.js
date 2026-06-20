const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.use(auth); // all routes require login
router.use(role('admin', 'doctor', 'staff')); // provider-only area

// @route  GET /api/users  -> list users (optionally filter by ?role=doctor)
// Used by the frontend to populate the "doctor" dropdown when booking.
// Passwords are never returned.
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('name email role').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
