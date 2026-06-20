const express = require('express');
const router = express.Router();
const Policy = require('../models/InsurancePolicy');
const Claim = require('../models/Claim');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.use(auth);
router.use(role('admin', 'doctor', 'staff')); // provider-only area

/* ----------------------------- Policies ----------------------------- */

// @route  POST /api/insurance/policies  (admin or staff)
router.post('/policies', role('admin', 'staff'), async (req, res) => {
  try {
    const policy = await Policy.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(policy);
  } catch (err) {
    res.status(400).json({ message: 'Could not create policy', error: err.message });
  }
});

// @route  GET /api/insurance/policies  (optional ?patient=)
router.get('/policies', async (req, res) => {
  try {
    const { patient } = req.query;
    const filter = patient ? { patient } : {};
    const policies = await Policy.find(filter)
      .populate('patient', 'name phone')
      .sort({ createdAt: -1 });
    res.json(policies);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  GET /api/insurance/policies/:id
router.get('/policies/:id', async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id).populate('patient', 'name phone');
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  PUT /api/insurance/policies/:id  (admin or staff)
router.put('/policies/:id', role('admin', 'staff'), async (req, res) => {
  try {
    const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json(policy);
  } catch (err) {
    res.status(400).json({ message: 'Could not update policy', error: err.message });
  }
});

// @route  DELETE /api/insurance/policies/:id  (admin)
router.delete('/policies/:id', role('admin'), async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json({ message: 'Policy deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* ------------------------------ Claims ------------------------------ */

// @route  POST /api/insurance/claims  (admin or staff)
router.post('/claims', role('admin', 'staff'), async (req, res) => {
  try {
    const claim = new Claim({ ...req.body, createdBy: req.user.id });
    claim.claimNumber = 'CLM-' + Date.now().toString().slice(-6);
    await claim.save();
    res.status(201).json(claim);
  } catch (err) {
    res.status(400).json({ message: 'Could not create claim', error: err.message });
  }
});

// @route  GET /api/insurance/claims  (optional ?patient= &status=)
router.get('/claims', async (req, res) => {
  try {
    const { patient, status } = req.query;
    const filter = {};
    if (patient) filter.patient = patient;
    if (status) filter.status = status;
    const claims = await Claim.find(filter)
      .populate('patient', 'name phone')
      .populate('policy', 'payerName policyNumber')
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  GET /api/insurance/claims/:id
router.get('/claims/:id', async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('patient', 'name phone')
      .populate('policy', 'payerName policyNumber coverageAmount');
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    res.json(claim);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  PUT /api/insurance/claims/:id  (admin or staff) — update status/approval
router.put('/claims/:id', role('admin', 'staff'), async (req, res) => {
  try {
    const claim = await Claim.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    res.json(claim);
  } catch (err) {
    res.status(400).json({ message: 'Could not update claim', error: err.message });
  }
});

// @route  DELETE /api/insurance/claims/:id  (admin)
router.delete('/claims/:id', role('admin'), async (req, res) => {
  try {
    const claim = await Claim.findByIdAndDelete(req.params.id);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    res.json({ message: 'Claim deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
