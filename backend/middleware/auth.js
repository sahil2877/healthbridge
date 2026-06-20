const jwt = require('jsonwebtoken');

// This function runs before every protected request
function auth(req, res, next) {
  // The token arrives in the "Authorization: Bearer <token>" header
  const header = req.header('Authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // is the token valid?
    req.user = decoded; // pass the user info on to the routes
    next();             // all good -> continue
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = auth;
