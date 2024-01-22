const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = process.env;

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) return res.status(401).json({ message: "you don't have the right, O you don't have the right" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    console.error('Token verification error:', err);
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};