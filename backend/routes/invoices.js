const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.use(auth); // all routes require login
router.use(role('admin', 'doctor', 'staff')); // provider-only area

// Recompute money fields from items, payments, tax and discount
function recalc(invoice) {
  invoice.items.forEach((it) => { it.amount = (it.qty || 1) * (it.unitPrice || 0); });
  invoice.subtotal = invoice.items.reduce((sum, it) => sum + it.amount, 0);
  invoice.total = invoice.subtotal + (invoice.tax || 0) - (invoice.discount || 0);
  invoice.amountPaid = (invoice.payments || []).reduce((sum, p) => sum + p.amount, 0);

  if (invoice.amountPaid <= 0) invoice.status = 'unpaid';
  else if (invoice.amountPaid < invoice.total) invoice.status = 'partial';
  else invoice.status = 'paid';
}

// @route  POST /api/invoices  -> create an invoice (admin or staff)
router.post('/', role('admin', 'staff'), async (req, res) => {
  try {
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' });
    }
    const invoice = new Invoice({ ...req.body, createdBy: req.user.id });
    invoice.invoiceNumber = 'INV-' + Date.now().toString().slice(-6);
    recalc(invoice);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ message: 'Could not create invoice', error: err.message });
  }
});

// @route  GET /api/invoices  -> all invoices (optional ?patient= & ?status=)
router.get('/', async (req, res) => {
  try {
    const { patient, status } = req.query;
    const filter = {};
    if (patient) filter.patient = patient;
    if (status) filter.status = status;
    const invoices = await Invoice.find(filter)
      .populate('patient', 'name phone age gender')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  GET /api/invoices/:id  -> a single invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('patient', 'name phone age gender bloodGroup address');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  PUT /api/invoices/:id  -> update invoice items/tax/discount (admin or staff)
router.put('/:id', role('admin', 'staff'), async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // Only allow editable fields; payments are added via the dedicated route
    ['items', 'tax', 'discount', 'dueDate', 'notes'].forEach((f) => {
      if (req.body[f] !== undefined) invoice[f] = req.body[f];
    });
    recalc(invoice);
    await invoice.save();
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: 'Could not update invoice', error: err.message });
  }
});

// @route  POST /api/invoices/:id/payments  -> record a payment (admin or staff)
router.post('/:id/payments', role('admin', 'staff'), async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const { amount, method, reference } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Valid payment amount required' });

    invoice.payments.push({ amount, method, reference, recordedBy: req.user.id });
    recalc(invoice);
    await invoice.save();
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: 'Could not record payment', error: err.message });
  }
});

// @route  DELETE /api/invoices/:id  -> delete (admin only)
router.delete('/:id', role('admin'), async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
