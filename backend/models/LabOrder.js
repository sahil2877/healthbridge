const mongoose = require('mongoose');

// One catalog item captured on an order
const orderItemSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  price: { type: Number, default: 0 }
}, { _id: false });

// A lab booking with a home-collection + reporting status workflow
const labOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },

  // Who booked it (works for both patient-portal and provider bookings)
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Optional link to a clinical Patient record (provider bookings)
  patient:  { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },

  // Contact snapshot (used when there is no Patient record, e.g. portal booking)
  contactName:  { type: String },
  contactPhone: { type: String },

  items: { type: [orderItemSchema], required: true },
  total: { type: Number, default: 0 },

  collectionAddress: { type: String },
  collectionSlot:    { type: String },

  status: {
    type: String,
    enum: ['booked', 'collected', 'in_lab', 'report_ready', 'cancelled'],
    default: 'booked'
  },
  reportUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('LabOrder', labOrderSchema);
