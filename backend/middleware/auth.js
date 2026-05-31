const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify JWT and ensure the user has admin privileges
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    if (user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin privileges required.' });
    }
    req.user = user;
    next();
  });
};

module.exports = verifyAdmin;
