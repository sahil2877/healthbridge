const AuditLog = require('../models/AuditLog');

// Maps HTTP write methods to a human-readable action
const METHOD_ACTION = { POST: 'create', PUT: 'update', PATCH: 'update', DELETE: 'delete' };

// From "/api/patients/123" -> entity "patients"
function entityFromUrl(url) {
  const parts = url.split('?')[0].split('/').filter(Boolean); // [api, patients, 123]
  return parts[1] || 'unknown';
}

// Returns the last path segment if it looks like a Mongo ObjectId
function idFromUrl(url) {
  const parts = url.split('?')[0].split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  return /^[0-9a-fA-F]{24}$/.test(last) ? last : undefined;
}

// Automatically records every authenticated write request once the
// response finishes successfully. Read requests (GET) are ignored.
// Request bodies are intentionally NOT stored (may contain PHI/passwords).
module.exports = function auditLogger(req, res, next) {
  const action = METHOD_ACTION[req.method];
  if (!action) return next(); // only audit writes

  res.on('finish', () => {
    if (res.statusCode >= 400) return;   // skip failed requests
    if (!req.user) return;               // only authenticated actions

    AuditLog.create({
      actor: { id: req.user.id, name: req.user.name, role: req.user.role },
      action,
      entity: entityFromUrl(req.originalUrl),
      entityId: idFromUrl(req.originalUrl),
      method: req.method,
      path: req.originalUrl.split('?')[0],
      statusCode: res.statusCode,
      ip: req.ip
    }).catch(() => { /* never let audit failures affect the request */ });
  });

  next();
};
