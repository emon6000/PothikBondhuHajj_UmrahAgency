const express = require('express');
const pool = require('../config/db');
const transporter = require('../config/mailer');

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

// Retrieve all packages
router.get('/packages', async (req, res) => {
  try {
    const allPackages = await pool.query('SELECT * FROM packages ORDER BY cost ASC');
    res.json(allPackages.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching packages.' });
  }
});

// Retrieve a specific package by ID
router.get('/packages/:id', async (req, res) => {
  try {
    const packageInfo = await pool.query('SELECT * FROM packages WHERE id = $1', [req.params.id]);
    if (packageInfo.rows.length === 0)
      return res.status(404).json({ message: 'Package not found' });
    res.json(packageInfo.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching package details.' });
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
    if (trackResult.rows.length === 0)
      return res.status(404).json({ error: 'Invalid Tracking ID.' });
    res.json(trackResult.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error tracking booking.' });
  }
});

// Register a new user and create a booking
router.post('/register', async (req, res) => {
  const { name, email, phone, nid, passport, packageId } = req.body;
  try {
    const newUserResult = await pool.query(
      `INSERT INTO users (name, email, phone, nid, passport) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, email, phone, nid, passport]
    );
    const newUserId = newUserResult.rows[0].id;

    const packageResult = await pool.query('SELECT cost FROM packages WHERE id = $1', [packageId]);
    if (packageResult.rows.length === 0)
      return res.status(404).json({ error: 'Package not found.' });

    const newBooking = await pool.query(
      `INSERT INTO bookings (user_id, package_id, status, total_cost, amount_paid) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [newUserId, packageId, 'PENDING_APPROVAL', packageResult.rows[0].cost, 0]
    );
    const trackingId = newBooking.rows[0].id;

    try {
      await transporter.sendMail({
        from: `"Pothik Bondhu Agency" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Registration Received - Pothik Bondhu',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 10px;">
            <h2 style="color: #064e3b; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Assalamu Alaikum, ${name}!</h2>
            <p style="font-size: 16px; line-height: 1.5;">Your registration request has been successfully received by our system.</p>
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 5px solid #d97706;">
              <p style="margin: 0; color: #92400e; font-size: 15px;"><strong>Status: Pending Review</strong></p>
              <p style="margin: 5px 0 0 0; color: #b45309; font-size: 14px;">Our team is currently verifying your documents. Please wait for admin confirmation.</p>
            </div>
            <p style="font-size: 15px; line-height: 1.5;">Once your profile is approved, we will send you a second email containing your Secure Tracking ID.</p>
          </div>
        `,
      });
      res
        .status(201)
        .json({ message: 'Registration successful! Check your email for next steps.' });
    } catch (emailError) {
      res.status(201).json({ message: 'Registration successful, but email delivery failed.' });
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
    await pool.query(`UPDATE bookings SET amount_paid = amount_paid + $1 WHERE id = $2`, [
      amount,
      bookingId,
    ]);
    res.json({ message: 'Payment successful!', transaction_id: txnId });
  } catch (error) {
    res.status(500).json({ error: 'Server error processing payment.' });
  }
});

module.exports = router;
