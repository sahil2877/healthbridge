const jwt = require('jsonwebtoken');

// Yeh function har protected request se pehle chalega
function auth(req, res, next) {
  // Token "Authorization: Bearer <token>" header mein aata hai
  const header = req.header('Authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // token sahi hai?
    req.user = decoded; // user ki info aage routes ko mil jati hai
    next();             // sab theek -> aage badho
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = auth;
