// One-time seed for the lab test catalog.
// Run:  node seed/seedLabPackages.js
require('dotenv').config();
const mongoose = require('mongoose');
const LabPackage = require('../models/LabPackage');

const PACKAGES = [
  { name: 'Healthy India Full Body Checkup', tests: 81, price: 1143, mrp: 4999, category: 'Popular' },
  { name: 'Full Body Checkup Lite',          tests: 80, price: 1046, mrp: 3999, category: 'Popular' },
  { name: 'Vitamin Deficiency Assessment',   tests: 2,  price: 831,  mrp: 1500, category: 'Vitamins' },
  { name: 'Vitamin Plus Package',            tests: 3,  price: 1000, mrp: 1800, category: 'Vitamins' },
  { name: 'Thyroid Profile Total',           tests: 3,  price: 399,  mrp: 900,  category: 'Thyroid' },
  { name: 'Kidney Function Test (KFT)',       tests: 10, price: 504,  mrp: 1681, category: 'Kidney' },
  { name: 'Liver Function Test (LFT)',        tests: 11, price: 499,  mrp: 1600, category: 'Liver' },
  { name: 'Comprehensive Allergy Panel',     tests: 4,  price: 1299, mrp: 2600, category: 'Allergy' }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await LabPackage.deleteMany({});           // reset catalog
  await LabPackage.insertMany(PACKAGES);
  console.log(`Seeded ${PACKAGES.length} lab packages`);
  await mongoose.disconnect();
})();
