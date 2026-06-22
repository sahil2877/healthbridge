
  const express = require('express');
  const router = express.Router();
  const Record = require('../models/ClinicalRecord');
  const auth = require('../middleware/auth');
  const role = require('../middleware/role');
  const upload = require('../middleware/upload');
  const { getOrCreateSelfPatient } = require('../utils/selfPatient');

  router.use(auth); // all routes require login
  // Reads are role-scoped per handler (patients see only their own records);
  // mutating routes are individually guarded for providers.

  // @route  POST /api/records  -> create a new clinical record (text data only)
  router.post('/', role('admin', 'doctor', 'staff'), async (req, res) => {
    try {
      const record = await Record.create({ ...req.body, createdBy: req.user.id });
      res.status(201).json(record);
    } catch (err) {
      res.status(400).json({ message: 'Could not create record', error: err.message });
    }
  });

  // @route  GET /api/records  -> records (optionally filter by ?patient=<id>)
  // Patients are scoped to their own record regardless of the query.
  router.get('/', async (req, res) => {
    try {
      const { patient } = req.query;
      let filter = patient ? { patient } : {};
      if (req.user.role === 'patient') {
        const self = await getOrCreateSelfPatient(req.user);
        filter = { patient: self._id };
      }
      const records = await Record.find(filter)
        .populate('patient', 'name phone age gender')
        .populate('doctor', 'name role')
        .sort({ visitDate: -1 }); // most recent visit first
      res.json(records);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  // @route  GET /api/records/:id  -> a single record
  router.get('/:id', async (req, res) => {
    try {
      const record = await Record.findById(req.params.id)
        .populate('patient', 'name phone age gender')
        .populate('doctor', 'name role');
      if (!record) return res.status(404).json({ message: 'Record not found' });

      if (req.user.role === 'patient') {
        const self = await getOrCreateSelfPatient(req.user);
        const owner = record.patient?._id || record.patient;
        if (String(owner) !== String(self._id)) return res.status(403).json({ message: 'Access denied' });
      }
      res.json(record);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  // @route  PUT /api/records/:id  -> update the record text
  router.put('/:id', role('admin', 'doctor', 'staff'), async (req, res) => {
    try {
      const record = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!record) return res.status(404).json({ message: 'Record not found' });
      res.json(record);
    } catch (err) {
      res.status(400).json({ message: 'Could not update', error: err.message });
    }
  });

  // @route  DELETE /api/records/:id  -> delete a record (admin or doctor)
  router.delete('/:id', role('admin', 'doctor'), async (req, res) => {
    try {
      const record = await Record.findByIdAndDelete(req.params.id);
      if (!record) return res.status(404).json({ message: 'Record not found' });
      res.json({ message: 'Record deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  // @route  POST /api/records/:id/documents  -> upload file(s) to a record
  // The form-data field must be named "files" (max 5 files)
  router.post('/:id/documents', role('admin', 'doctor', 'staff'), upload.array('files', 5), async (req, res) => {
    try {
      const record = await Record.findById(req.params.id);
      if (!record) return res.status(404).json({ message: 'Record not found' });

      // Add the uploaded files to the record's documents
      const docs = (req.files || []).map(f => ({
        fileName: f.filename,
        originalName: f.originalname,
        url: `/uploads/${f.filename}`
      }));
      record.documents.push(...docs);
      await record.save();

      res.json(record);
    } catch (err) {
      res.status(400).json({ message: 'Upload failed', error: err.message });
    }
  });

  module.exports = router;
