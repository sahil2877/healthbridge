const mongoose = require('mongoose');

// AuditLog = an immutable record of a sensitive (write) action.
// The actor is denormalized (snapshot) so the trail stays accurate even
// if the user is later renamed or deleted.
const auditLogSchema = new mongoose.Schema({
  actor: {
    id:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    role: { type: String }
  },
  action:     { type: String },   // create | update | delete
  entity:     { type: String },   // patients | appointments | invoices | ...
  entityId:   { type: String },
  method:     { type: String },   // POST | PUT | PATCH | DELETE
  path:       { type: String },
  statusCode: { type: Number },
  ip:         { type: String },
  at:         { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
