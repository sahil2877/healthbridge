 const express = require('express');
  const router = express.Router();
  const Appointment = require('../models/Appointment');
  const auth = require('../middleware/auth');
  const role = require('../middleware/role');

  // All routes in this file require login
  router.use(auth);

  // @route  POST /api/appointments  -> book a new appointment
  router.post('/', async (req, res) => {
    try {
      const appointment = await Appointment.create({ ...req.body, bookedBy: req.user.id });
      res.status(201).json(appointment);
    } catch (err) {
      res.status(400).json({ message: 'Could not book appointment', error: err.message });
    }
  });

  // @route  GET /api/appointments  -> all appointments (with filters)
  // optional query: ?status=scheduled  ?patient=<id>  ?doctor=<id>
  router.get('/', async (req, res) => {
    try {
      const { status, patient, doctor } = req.query;
      const filter = {};
      if (status)  filter.status  = status;
      if (patient) filter.patient = patient;
      if (doctor)  filter.doctor  = doctor;

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
      res.json(appointment);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  // @route  PUT /api/appointments/:id  -> update (reschedule or change status)
  router.put('/:id', async (req, res) => {
    try {
      const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
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
