const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const notify = require('../utils/notify');
const { getOrCreateSelfPatient } = require('../utils/selfPatient');

// All routes in this file require login. NOTE: unlike before, this router is no
// longer provider-only — patients may book and view their *own* appointments.
// Each handler scopes/guards access by role.
router.use(auth);

// @route  POST /api/appointments  -> book (provider) or request (patient) an appointment
// A provider booking is confirmed immediately ('scheduled'); a patient can only
// *request* a slot ('requested') which the clinic must confirm afterwards.
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body, bookedBy: req.user.id };

    if (req.user.role === 'patient') {
      // Patients cannot choose an arbitrary patient — always their own record —
      // and cannot self-confirm; the appointment starts as a pending request.
      const self = await getOrCreateSelfPatient(req.user);
      data.patient = self._id;
      data.status = 'requested';
    }

    const appointment = await Appointment.create(data);

    // Notify the assigned doctor — a request needs action, a booking is informational.
    const isRequest = appointment.status === 'requested';
    notify(appointment.doctor, {
      type: 'appointment',
      title: isRequest ? 'New appointment request' : 'New appointment booked',
      body: isRequest
        ? `A patient requested ${new Date(appointment.date).toLocaleString()}. Confirm or decline it.`
        : `An appointment was scheduled for ${new Date(appointment.date).toLocaleString()}.`,
      link: '/appointments'
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ message: 'Could not book appointment', error: err.message });
  }
});

// @route  GET /api/appointments  -> appointments (with filters)
// Patients only see appointments they booked; providers see all.
// optional query: ?status=scheduled  ?patient=<id>  ?doctor=<id>
router.get('/', async (req, res) => {
  try {
    const { status, patient, doctor } = req.query;
    const filter = {};
    if (status)  filter.status  = status;
    if (patient) filter.patient = patient;
    if (doctor)  filter.doctor  = doctor;
    if (req.user.role === 'patient') filter.bookedBy = req.user.id; // ownership scoping

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name phone age gender') // include some patient details
      .populate('doctor', 'name email role')         // include doctor details
      .sort({ date: 1 });                            // sort by date (earliest first)

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  GET /api/appointments/:id  -> details of a single appointment
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name phone age gender')
      .populate('doctor', 'name email role');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // A patient may only view their own appointment
    if (req.user.role === 'patient' && String(appointment.bookedBy) !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route  PUT /api/appointments/:id  -> update (reschedule, confirm/decline, change status)
// Patients may only cancel their own pending/confirmed appointment. Providers may
// confirm or decline a request (and the patient is notified of the decision).
router.put('/:id', async (req, res) => {
  try {
    const existing = await Appointment.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Appointment not found' });

    if (req.user.role === 'patient') {
      if (String(existing.bookedBy) !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      // A patient can only cancel — never self-confirm or edit the slot/doctor.
      if (req.body.status !== 'cancelled') {
        return res.status(403).json({ message: 'You can only cancel your appointment; the clinic confirms requests.' });
      }
      existing.status = 'cancelled';
      await existing.save();
      return res.json(existing);
    }

    // Provider update. If a pending request is being confirmed/declined, tell the patient.
    const wasRequested = existing.status === 'requested';
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (wasRequested && (appointment.status === 'scheduled' || appointment.status === 'cancelled')) {
      const confirmed = appointment.status === 'scheduled';
      notify(appointment.bookedBy, {
        type: 'appointment',
        title: confirmed ? 'Appointment confirmed' : 'Appointment request declined',
        body: confirmed
          ? `Your appointment on ${new Date(appointment.date).toLocaleString()} is confirmed.`
          : 'Your appointment request was declined. Please pick another slot.',
        link: '/portal/appointments'
      });
    }
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: 'Could not update', error: err.message });
  }
});

// @route  DELETE /api/appointments/:id  -> delete an appointment (admin or doctor)
router.delete('/:id', role('admin', 'doctor'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
