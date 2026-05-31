const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const verifyAdmin = require('../middleware/auth');

const router = express.Router();

// Authenticate admin users and return JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(400).json({ error: 'User not found.' });

    const user = userResult.rows[0];
    if (user.role !== 'ADMIN' || !user.password_hash) {
      return res
        .status(403)
        .json({ error: 'Clients must use the Tracking Portal to view status.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) return res.status(400).json({ error: 'Incorrect password.' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'super_secret_key',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// Create initial admin account, protected by JWT
router.get('/setup-admin', verifyAdmin, async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('admin123', salt);
    await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, role, is_approved) VALUES ($1, $2, $3, $4, $5, $6)`,
      ['Agency Admin', 'admin@pothikbondhu.com', '00000000000', password, 'ADMIN', true]
    );
    res.send('Admin account created successfully!');
  } catch (error) {
    res.send('Admin already exists or error occurred.');
  }
});

module.exports = router;
