const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// Check database connection
router.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected successfully!', time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Retrieve all packages WITH their linked services attached
router.get('/packages', async (req, res) => {
  try {
    const query = `
      SELECT p.id, p.title, p.type, p.duration, p.cost,
             COALESCE(
               json_agg(
                 json_build_object(
                   'service_id', s.service_id, 
                   'service_name', s.service_name, 
                   'category', s.category
                 )
               ) FILTER (WHERE s.service_id IS NOT NULL), '[]'
             ) as services
      FROM packages p
      LEFT JOIN package_services ps ON p.id = ps.package_id
      LEFT JOIN services s ON ps.service_id = s.service_id
      GROUP BY p.id
      ORDER BY p.cost ASC;
    `;
    const allPackages = await pool.query(query);
    res.json(allPackages.rows);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Server error fetching packages.' });
  }
});

// Retrieve a specific package by ID
router.get('/packages/:id', async (req, res) => {
  try {
    const packageInfo = await pool.query('SELECT * FROM packages WHERE id = $1', [req.params.id]);
    if (packageInfo.rows.length === 0) return res.status(404).json({ message: 'Package not found' });
    res.json(packageInfo.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching package details.' });
  }
});

// Retrieve services for a specific package
router.get('/packages/:id/services', async (req, res) => {
  try {
    const query = `
      SELECT s.service_name, s.category, ps.is_included
      FROM package_services ps
      JOIN services s ON ps.service_id = s.service_id
      WHERE ps.package_id = $1
      ORDER BY ps.is_included DESC, s.category ASC;
    `;
    const result = await pool.query(query, [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Retrieve booking status by tracking ID
router.get('/track/:bookingId', async (req, res) => {
  try {
    const trackResult = await pool.query(
      `SELECT b.id, b.status, b.amount_paid, b.total_cost, p.title as package_name, u.name as client_name
       FROM bookings b JOIN packages p ON b.package_id = p.id JOIN users u ON b.user_id = u.id
       WHERE b.id = $1`,
      [req.params.bookingId]
    );
    if (trackResult.rows.length === 0) return res.status(404).json({ error: 'Invalid Tracking ID.' });
    res.json(trackResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error tracking booking.' });
  }
});

// Register a new user and create a booking
router.post('/register', async (req, res) => {
  const { name, email, phone, nid, passport, packageId, password } = req.body;
  try {
    const newUserResult = await pool.query(
      `INSERT INTO users (name, email, phone, nid, passport, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [name, email, phone, nid, passport, password]
    );
    const newUserId = newUserResult.rows[0].id;

    const packageResult = await pool.query('SELECT cost FROM packages WHERE id = $1', [packageId]);
    if (packageResult.rows.length === 0) return res.status(404).json({ error: 'Package not found.' });

    const newBooking = await pool.query(
      `INSERT INTO bookings (user_id, package_id, status, total_cost, amount_paid) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [newUserId, packageId, 'PENDING_APPROVAL', packageResult.rows[0].cost, 0]
    );
    const trackingId = newBooking.rows[0].id;

    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'accept': 'application/json', 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json' },
        body: JSON.stringify({
          sender: { name: 'Pothik Bondhu Agency', email: process.env.EMAIL_USER }, 
          to: [{ email: email }],
          subject: 'Registration Received - Pothik Bondhu',
          htmlContent: `<h2>Registration Received</h2><p>Admin is reviewing your application.</p>`
        })
      });
      res.status(201).json({ message: 'Registration successful! Check your email.' });
    } catch (emailError) {
      res.status(201).json({ message: 'Registration successful, email failed.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Process a booking payment
router.post('/process-payment', async (req, res) => {
  const { bookingId, amount, method } = req.body;
  try {
    const txnId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    await pool.query(
      `INSERT INTO payments (booking_id, amount, method, transaction_id) VALUES ($1, $2, $3, $4)`,
      [bookingId, amount, method, txnId]
    );
    await pool.query(`UPDATE bookings SET amount_paid = amount_paid + $1 WHERE id = $2`, [amount, bookingId]);
    res.json({ message: 'Payment successful!', transaction_id: txnId });
  } catch (error) {
    res.status(500).json({ error: 'Server error processing payment.' });
  }
});

module.exports = router;