const express = require('express');
const jwt     = require('jsonwebtoken');
const router  = express.Router();
const authMiddleware = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const adminEmail    = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    { email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: { email, role: 'admin' },
    message: 'Login successful',
  });
});

// GET /api/auth/verify  (protected)
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
