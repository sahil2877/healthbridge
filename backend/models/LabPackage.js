const mongoose = require('mongoose');

// A bookable lab test package shown in the catalog
const labPackageSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  tests:    { type: Number, default: 1 },     // number of tests included
  price:    { type: Number, required: true }, // offer price (₹)
  mrp:      { type: Number },                  // strikethrough price
  category: { type: String, default: 'Popular' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('LabPackage', labPackageSchema);
