const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Set up the direct connection to pgAdmin/PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hajj_umrah_db',
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


// --- USER REGISTRATION & AUTO-BOOKING ENDPOINT ---
app.post('/api/register', async (req, res) => {
  // We added 'packageId' to the data we expect from the frontend
  const { name, email, phone, password, nid, passport, packageId } = req.body;

  try {
    // 1. First, look up the cost of the package they selected
    const packageResult = await pool.query('SELECT cost FROM packages WHERE id = $1', [packageId]);
    
    if (packageResult.rows.length === 0) {
      return res.status(400).json({ error: 'Selected package does not exist.' });
    }
    
    const packageCost = packageResult.rows[0].cost;

    // 2. Scramble the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert the new User
    const newUserResult = await pool.query(
      `INSERT INTO users (name, email, phone, password, nid, passport) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, is_approved`,
      [name, email, phone, hashedPassword, nid, passport]
    );

    const newUserId = newUserResult.rows[0].id;

    // 4. IMMEDIATELY create their booking using their new ID and the package cost
    await pool.query(
      `INSERT INTO bookings (user_id, package_id, status, total_cost, amount_paid) 
       VALUES ($1, $2, $3, $4, $5)`,
      [newUserId, packageId, 'PENDING_APPROVAL', packageCost, 0]
    );

    res.status(201).json({ 
      message: 'Registration and Booking successful! Waiting for Admin approval.', 
      user: newUserResult.rows[0] 
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Registration failed. Email or phone number might already be in use.' });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if the user exists in the database
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'User not found. Please register first.' });
    }

    const user = userResult.rows[0];

    // 2. Compare the typed password with the scrambled database password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Incorrect password.' });
    }

    // 3. Generate the VIP Pass (JWT) containing their ID and Role
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // 4. Send the token and user details back to the frontend
    res.json({
      message: 'Login successful!',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        is_approved: user.is_approved
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// --- ADMIN: GET ALL USERS ---
app.get('/api/admin/users', async (req, res) => {
  try {
    // Fetch all users except passwords, order by newest first
    const users = await pool.query(
      'SELECT id, name, email, phone, role, is_approved, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error fetching users.' });
  }
});

// --- ADMIN: APPROVE A USER ---
app.put('/api/admin/approve-user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await pool.query(
      'UPDATE users SET is_approved = true WHERE id = $1 RETURNING id, name, is_approved',
      [id]
    );
    res.json({ message: 'User approved successfully!', user: updatedUser.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error approving user.' });
  }
});

// --- CLIENT: GET MY BOOKING ---
app.get('/api/my-booking/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // JOIN the bookings and packages tables
    const bookingResult = await pool.query(
      `SELECT bookings.*, packages.title, packages.cost, packages.duration 
       FROM bookings 
       JOIN packages ON bookings.package_id = packages.id 
       WHERE bookings.user_id = $1`,
      [userId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ message: 'No booking found for this user.' });
    }

    res.json(bookingResult.rows[0]);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error fetching booking.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});