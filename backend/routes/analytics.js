const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Invoice = require('../models/Invoice');
const Screening = require('../models/Screening');
const ClinicalRecord = require('../models/ClinicalRecord');

router.use(auth);

// Convert an aggregation of { _id, count } into a plain { key: count } map
function toMap(rows) {
  const map = {};
  rows.forEach((r) => { map[r._id || 'unknown'] = r.count; });
  return map;
}

// @route  GET /api/analytics/overview  -> dashboard data (providers only)
router.get('/overview', role('admin', 'doctor', 'staff'), async (req, res) => {
  try {
    const [
      patients, doctors, appointments, prescriptions, invoices, screenings, records,
      apptStatus, screeningRisk, revenueAgg, patientsTrend,
      recentInvoices, recentAppointments
    ] = await Promise.all([
      Patient.countDocuments(),
      User.countDocuments({ role: 'doctor' }),
      Appointment.countDocuments(),
      Prescription.countDocuments(),
      Invoice.countDocuments(),
      Screening.countDocuments(),
      ClinicalRecord.countDocuments(),

      Appointment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Screening.aggregate([{ $group: { _id: '$riskLevel', count: { $sum: 1 } } }]),
      Invoice.aggregate([{ $group: { _id: null, billed: { $sum: '$total' }, collected: { $sum: '$amountPaid' } } }]),
      Patient.aggregate([
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),

      Invoice.find().populate('patient', 'name').sort({ createdAt: -1 }).limit(5),
      Appointment.find().populate('patient', 'name').populate('doctor', 'name').sort({ createdAt: -1 }).limit(5)
    ]);

    const revenue = revenueAgg[0] || { billed: 0, collected: 0 };

    res.json({
      counts: { patients, doctors, appointments, prescriptions, invoices, screenings, records },
      appointmentsByStatus: toMap(apptStatus),
      screeningByRisk: toMap(screeningRisk),
      revenue: {
        billed: revenue.billed || 0,
        collected: revenue.collected || 0,
        outstanding: (revenue.billed || 0) - (revenue.collected || 0)
      },
      patientsTrend: patientsTrend.map((p) => ({ month: p._id, count: p.count })),
      recentInvoices,
      recentAppointments
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
