// Role-based access control.
// Usage: router.delete('/:id', role('admin'), handler)
//        router.post('/', role('admin', 'doctor'), handler)
// Must run AFTER the auth middleware (it relies on req.user set by auth).
function role(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
}

module.exports = role;
