const express = require('express');
const router = express.Router();
const LabPackage = require('../models/LabPackage');
const LabOrder = require('../models/LabOrder');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const notify = require('../utils/notify');

router.use(auth); // all routes require login

/* --------------------------- Catalog --------------------------- */

// @route  GET /api/lab/packages  -> catalog (any logged-in user, optional ?category=)
router.get('/packages', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    const packages = await LabPackage.find(filter).sort({ price: 1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/* ---------------------------- Orders --------------------------- */

// @route  POST /api/lab/orders  -> book lab tests (any logged-in user)
router.post('/orders', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' });
    }
    const order = new LabOrder({
      ...req.body,
      bookedBy: req.user.id,
      contactName: req.body.contactName || req.user.name,
      total: items.reduce((sum, it) => sum + (it.price || 0), 0)
    });
    order.orderNumber = 'LAB-' + Date.now().toString().slice(-6);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: 'Could not place order', error: err.message });
  }
});

// @route  GET /api/lab/orders  -> list orders
// Patients only see their own; providers see all (optional ?status=)
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (req.user.role === 'patient') filter.bookedBy = req.user.id; // ownership scoping

    const orders = await LabOrder.find(filter)
      .populate('patient', 'name phone')
      .populate('bookedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  GET /api/lab/orders/:id  -> one order (own, or any for providers)
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await LabOrder.findById(req.params.id)
      .populate('patient', 'name phone')
      .populate('bookedBy', 'name role');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // A patient may only view their own order
    if (req.user.role === 'patient' && String(order.bookedBy?._id) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  PATCH /api/lab/orders/:id/status  -> update status / attach report (providers)
router.patch('/orders/:id/status', role('admin', 'doctor', 'staff'), async (req, res) => {
  try {
    const { status, reportUrl } = req.body;
    const update = {};
    if (status) update.status = status;
    if (reportUrl !== undefined) update.reportUrl = reportUrl;

    const order = await LabOrder.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Notify the patient who booked about the status change
    if (status) {
      const labels = { collected: 'Sample collected', in_lab: 'Sample in lab', report_ready: 'Report ready', cancelled: 'Order cancelled' };
      notify(order.bookedBy, {
        type: 'lab',
        title: `Lab order ${order.orderNumber}: ${labels[status] || status}`,
        body: status === 'report_ready' ? 'Your report is ready to view.' : 'Your lab order status was updated.',
        link: '/portal/orders'
      });
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Could not update order', error: err.message });
  }
});

module.exports = router;
