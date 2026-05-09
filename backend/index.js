const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- MIDDLEWARE: THE SECURITY GUARD ---
const verifyAdmin = (req, res, next) => {
  // 1. Look for the "Authorization" header in the incoming request
  const authHeader = req.headers['authorization'];
  
  // 2. The token usually looks like "Bearer eyJhbGciOi...", so we split it to just get the token
  const token = authHeader && authHeader.split(' ')[1];

  // 3. If there is no token, kick them out immediately
  if (!token) {
    return res.status(401).json({ error: 'Access Denied. No token provided.' });
  }

  // 4. Verify the token is real and hasn't been tampered with
  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    
    // 5. Check if the user trying to access the route is actually an Admin
    if (user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Admin privileges required.' });
    }

    // 6. If everything is perfect, attach the user info to the request and let them pass!
    req.user = user;
    next(); // This tells Express to move on to the actual route logic
  });
};


// --- DATABASE CONNECTION ---
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hajj_umrah_db', // Make sure this matches your actual DB name!
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected successfully!', time: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================

// --- PASSWORDLESS REGISTRATION & AUTO-BOOKING ---
// --- PASSWORDLESS REGISTRATION & AUTO-EMAIL ---
app.post('/api/register', async (req, res) => {
  const { name, email, phone, nid, passport, packageId } = req.body;

  try {
    // 1. Insert User
    const newUserResult = await pool.query(
      `INSERT INTO users (name, email, phone, nid, passport) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, email, phone, nid, passport]
    );
    const newUserId = newUserResult.rows[0].id;

    // 2. Get Package Cost
    const packageResult = await pool.query('SELECT cost FROM packages WHERE id = $1', [packageId]);
    if (packageResult.rows.length === 0) return res.status(404).json({ error: 'Package not found.' });
    const packageCost = packageResult.rows[0].cost;

    // 3. Create Booking & Capture the Tracking ID
    const newBooking = await pool.query(
      `INSERT INTO bookings (user_id, package_id, status, total_cost, amount_paid) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [newUserId, packageId, 'PENDING_APPROVAL', packageCost, 0]
    );
    const trackingId = newBooking.rows[0].id;

    // 4. FIRE THE AUTOMATED EMAIL
    try {
      await resend.emails.send({
        from: 'Pothik Bondhu <onboarding@resend.dev>', // Your verified domain goes here later
        to: email, // During testing, this MUST be your personal Resend account email!
        subject: 'Registration Received - Your Tracking ID',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #064e3b;">Welcome to Pothik Bondhu</h2>
            <p>Dear ${name},</p>
            <p>Your pre-registration has been successfully submitted to our agency. We are currently reviewing your documents.</p>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 0.9em; color: #64748b;">Your Secure Tracking ID:</p>
              <h3 style="margin: 5px 0 0 0; color: #0f172a;">${trackingId}</h3>
            </div>
            <p>You can track the live status of your Visa and Journey Progress at any time by pasting this ID into our tracking portal:</p>
            <a href="http://localhost:5173/track" style="display: inline-block; background: #064e3b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Track My Status</a>
          </div>
        `
      });
      console.log("Email sent successfully to", email);
    } catch (emailError) {
      // If the email fails (e.g. invalid testing email), we still want the database registration to succeed
      console.error("Database succeeded, but email failed to send:", emailError);
    }

    res.status(201).json({ message: 'Registration successful! Check your email for your Tracking ID.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// --- TRACK BOOKING STATUS ---
app.get('/api/track/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
  try {
    const trackResult = await pool.query(`
      SELECT b.id, b.status, b.amount_paid, b.total_cost, p.title as package_name, u.name as client_name
      FROM bookings b
      JOIN packages p ON b.package_id = p.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = $1
    `, [bookingId]);

    if (trackResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid Tracking ID. Please check your link.' });
    }
    res.json(trackResult.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error tracking booking.' });
  }
});

// --- GET PACKAGES ---
app.get('/api/packages', async (req, res) => {
  try {
    const allPackages = await pool.query('SELECT * FROM packages ORDER BY cost ASC');
    res.json(allPackages.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching packages.' });
  }
});

app.get('/api/packages/:id', async (req, res) => {
  try {
    const packageInfo = await pool.query('SELECT * FROM packages WHERE id = $1', [req.params.id]);
    if (packageInfo.rows.length === 0) return res.status(404).json({ message: 'Package not found' });
    res.json(packageInfo.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching package details.' });
  }
});


// ==========================================
// 2. ADMIN & AUTH ROUTES
// ==========================================

// --- ADMIN LOGIN ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(400).json({ error: 'User not found.' });

    const user = userResult.rows[0];

    // Block standard clients from trying to log in
    if (user.role !== 'ADMIN' || !user.password_hash) {
      return res.status(403).json({ error: 'Clients must use the Tracking Portal to view status.' });
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
      token: token,
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// --- ADMIN DASHBOARD DATA ---
app.get('/api/admin/users', verifyAdmin,async (req, res) => {
  try {
    const users = await pool.query("SELECT id, name, email, phone, role, is_approved, created_at FROM users WHERE role = 'CLIENT' ORDER BY created_at DESC");
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching users.' });
  }
});

// --- ADMIN DASHBOARD DATA ---
app.get('/api/admin/bookings', verifyAdmin, async (req, res) => {
  try {
    const bookings = await pool.query(`
      SELECT b.id, u.name as client_name, u.phone, p.title as package_name, b.status, b.amount_paid, b.total_cost 
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN packages p ON b.package_id = p.id
      WHERE u.is_approved = true /* <--- THIS IS THE MAGIC FIX */
      ORDER BY b.created_at DESC
    `);
    res.json(bookings.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error fetching bookings.' });
  }
});

// --- ADMIN CONTROLS ---
app.put('/api/admin/approve-user/:id',verifyAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE users SET is_approved = true WHERE id = $1', [req.params.id]);
    res.json({ message: 'User approved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error approving user.' });
  }
});

app.put('/api/admin/update-payment/:id',verifyAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE bookings SET amount_paid = $1 WHERE id = $2', [req.body.amount_paid, req.params.id]);
    res.json({ message: 'Payment logged successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating payment.' });
  }
});

app.put('/api/admin/update-booking-status/:id',verifyAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', [req.body.status, req.params.id]);
    res.json({ message: 'Status updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating status.' });
  }
});


// ==========================================
// 3. DEVELOPMENT / SETUP TOOLS
// ==========================================

// --- TEMPORARY ROUTE TO CREATE ADMIN (Run once, then delete!) ---
app.get('/api/setup-admin',verifyAdmin, async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("admin123", salt); // New admin password
    
    await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, role, is_approved) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['Agency Admin', 'admin@pothikbondhu.com', '00000000000', password, 'ADMIN', true]
    );
    
    res.send("Admin account created successfully! Email: admin@pothikbondhu.com | Password: admin123");
  } catch (error) {
    res.send("Admin already exists or error occurred: " + error.message);
  }
});

// --- ADMIN: CREATE NEW PACKAGE ---
app.post('/api/admin/packages',verifyAdmin, async (req, res) => {
  const { title, type, duration, cost, features } = req.body;
  try {
    await pool.query(
      `INSERT INTO packages (id, title, type, duration, cost, features) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)`,
      [title, type, duration, cost, features]
    );
    res.status(201).json({ message: 'Package created successfully!' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error creating package.' });
  }
});

// --- ADMIN: DELETE PACKAGE ---
app.delete('/api/admin/packages/:id',verifyAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM packages WHERE id = $1', [req.params.id]);
    res.json({ message: 'Package deleted successfully!' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error deleting package.' });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});