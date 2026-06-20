
  const express = require('express');
  const router = express.Router();
  const Record = require('../models/ClinicalRecord');
  const auth = require('../middleware/auth');
  const role = require('../middleware/role');
  const upload = require('../middleware/upload');

  router.use(auth); // all routes require login

  // @route  POST /api/records  -> create a new clinical record (text data only)
  router.post('/', async (req, res) => {
    try {
      const record = await Record.create({ ...req.body, createdBy: req.user.id });
      res.status(201).json(record);
    } catch (err) {
      res.status(400).json({ message: 'Could not create record', error: err.message });
    }
  });

  // @route  GET /api/records  -> all records (optionally filter by ?patient=<id>)
  router.get('/', async (req, res) => {
    try {
      const { patient } = req.query;
      const filter = patient ? { patient } : {};
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
      res.json(record);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  // @route  PUT /api/records/:id  -> update the record text
  router.put('/:id', async (req, res) => {
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
  router.post('/:id/documents', upload.array('files', 5), async (req, res) => {
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
