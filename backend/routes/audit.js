const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.use(auth);

// @route  GET /api/audit  -> view the audit trail (admin only)
// optional filters: ?entity= &action= &limit=
router.get('/', role('admin'), async (req, res) => {
  try {
    const { entity, action, limit } = req.query;
    const filter = {};
    if (entity) filter.entity = entity;
    if (action) filter.action = action;

    const logs = await AuditLog.find(filter)
      .sort({ at: -1 })
      .limit(Math.min(Number(limit) || 200, 500));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
