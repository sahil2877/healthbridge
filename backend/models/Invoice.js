const mongoose = require('mongoose');

// A billable line on an invoice
const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  qty:         { type: Number, default: 1 },
  unitPrice:   { type: Number, required: true },
  amount:      { type: Number, default: 0 },   // qty * unitPrice (computed)
  sourceType:  { type: String, enum: ['consultation', 'lab', 'pharmacy', 'other'], default: 'other' }
}, { _id: false });

// A payment recorded against an invoice
const paymentSchema = new mongoose.Schema({
  amount:     { type: Number, required: true },
  method:     { type: String, enum: ['cash', 'card', 'upi', 'wallet'], default: 'cash' },
  reference:  { type: String },
  paidAt:     { type: Date, default: Date.now },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  patient:  { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },

  items:    { type: [itemSchema], required: true },
  payments: { type: [paymentSchema], default: [] },

  // Money fields (in rupees)
  subtotal:   { type: Number, default: 0 },
  tax:        { type: Number, default: 0 },     // tax amount
  discount:   { type: Number, default: 0 },     // discount amount
  total:      { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },

  status:  { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
  dueDate: { type: Date },
  notes:   { type: String },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
