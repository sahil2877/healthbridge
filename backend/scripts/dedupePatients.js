// One-time cleanup: remove duplicate Patient records created by the old
// race condition (multiple blank records for the same `user`).
//
// For each group of patients sharing the same `user`, we keep the single
// "best" record (most filled-in fields, oldest as tiebreaker) and repoint any
// clinical data from the duplicates onto the keeper before deleting them.
//
// Run from the backend folder:  node scripts/dedupePatients.js
require('dotenv').config();
const mongoose = require('mongoose');

const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const ClinicalRecord = require('../models/ClinicalRecord');
const Prescription = require('../models/Prescription');
const Invoice = require('../models/Invoice');
const Screening = require('../models/Screening');
const LabOrder = require('../models/LabOrder');
const Consultation = require('../models/Consultation');
const InsurancePolicy = require('../models/InsurancePolicy');
const Claim = require('../models/Claim');

// How "complete" a patient record is — higher wins.
function score(p) {
  let s = 0;
  for (const f of ['age', 'gender', 'phone', 'email', 'address', 'allergies',
                   'chronicConditions', 'currentMedications', 'emergencyContactName',
                   'emergencyContactPhone', 'height', 'weight']) {
    if (p[f] !== undefined && p[f] !== null && p[f] !== '') s++;
  }
  if (p.bloodGroup && p.bloodGroup !== 'Unknown') s++;
  return s;
}

async function repoint(fromId, toId) {
  const filter = { patient: fromId };
  const update = { $set: { patient: toId } };
  await Promise.all([
    Appointment.updateMany(filter, update),
    ClinicalRecord.updateMany(filter, update),
    Prescription.updateMany(filter, update),
    Invoice.updateMany(filter, update),
    Screening.updateMany(filter, update),
    LabOrder.updateMany(filter, update),
    Consultation.updateMany(filter, update),
    InsurancePolicy.updateMany(filter, update),
    Claim.updateMany(filter, update),
  ]);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Scanning for duplicate patients by user...');

  // Group only records that have a `user` link (portal patients).
  const groups = await Patient.aggregate([
    { $match: { user: { $ne: null } } },
    { $group: { _id: '$user', ids: { $push: '$_id' }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  console.log(`Found ${groups.length} user(s) with duplicate patient records.`);
  let removed = 0;

  for (const g of groups) {
    const docs = await Patient.find({ _id: { $in: g.ids } });
    // Pick the keeper: most complete, then oldest.
    docs.sort((a, b) => score(b) - score(a) || a.createdAt - b.createdAt);
    const keeper = docs[0];
    const dupes = docs.slice(1);

    for (const d of dupes) {
      await repoint(d._id, keeper._id);
      await Patient.findByIdAndDelete(d._id);
      removed++;
    }
    console.log(`  user ${g._id}: kept ${keeper._id}, removed ${dupes.length}`);
  }

  console.log(`Done. Removed ${removed} duplicate patient record(s).`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
