const express = require('express');
const pool = require('../config/db');
const verifyAdmin = require('../middleware/auth');

const router = express.Router();

router.use(verifyAdmin);

// Retrieve all client user records
router.get('/users', async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT * FROM users WHERE role = 'CLIENT' ORDER BY created_at DESC"
    );
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// Retrieve booking summary for admin dashboard
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await pool.query(
      `SELECT b.id, u.name as client_name, u.phone, p.title as package_name, b.status, b.amount_paid, b.total_cost
       FROM bookings b JOIN users u ON b.user_id = u.id JOIN packages p ON b.package_id = p.id
       WHERE u.is_approved = true ORDER BY b.created_at DESC`
    );
    res.json(bookings.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
});

// Approve a user's account and email them a tracking ID
router.put('/approve-user/:id', async (req, res) => {
  try {
    await pool.query('UPDATE users SET is_approved = true WHERE id = $1', [req.params.id]);

    const userData = await pool.query(
      `SELECT u.name, u.email, b.id as tracking_id 
       FROM users u 
       JOIN bookings b ON u.id = b.user_id 
       WHERE u.id = $1`,
      [req.params.id]
    );

    if (userData.rows.length > 0) {
      const { name, email, tracking_id } = userData.rows[0];

      try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: 'Pothik Bondhu Agency', email: process.env.EMAIL_USER }, 
            to: [{ email: email }],
            subject: 'Account Approved - Your Secure Tracking ID',
            htmlContent: `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 10px;">
                <h2 style="color: #064e3b; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">Assalamu Alaikum, ${name}!</h2>
                <p style="font-size: 16px; line-height: 1.5;">Great news! Your registration has been officially approved by the Pothik Bondhu Admin.</p>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border-left: 5px solid #064e3b;">
                  <p style="margin: 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Secure Tracking ID</p>
                  <h3 style="margin: 10px 0 0 0; color: #0f172a; font-size: 24px;">${tracking_id}</h3>
                </div>
              </div>
            `
          })
        });
      } catch (emailErr) {
        console.error('Failed to send approval email via Brevo:', emailErr);
      }
    }
    res.json({ message: 'User approved and tracking ID emailed successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error approving user.' });
  }
});

// Reject and remove a client user record
router.delete('/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User rejected and removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting user' });
  }
});

// Delete a booking record
router.delete('/bookings/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
    res.json({ message: 'Booking canceled' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting booking' });
  }
});

// Update an existing booking status
router.put('/update-booking-status/:id', async (req, res) => {
  try {
    await pool.query('UPDATE bookings SET status = $1 WHERE id = $2', [req.body.status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating status' });
  }
});

// Retrieve payment history for a booking
router.get('/payments/:bookingId', async (req, res) => {
  try {
    const history = await pool.query(
      'SELECT * FROM payments WHERE booking_id = $1 ORDER BY created_at DESC',
      [req.params.bookingId]
    );
    res.json(history.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching payments' });
  }
});

// -------------------------------------------------------------
// RELATIONAL PACKAGE MANAGEMENT (JUNCTION TABLE LOGIC)
// -------------------------------------------------------------

// Retrieve all available services for the Admin Checkboxes
router.get('/services', async (req, res) => {
  try {
    const services = await pool.query('SELECT * FROM services ORDER BY category, service_name');
    res.json(services.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching services' });
  }
});

// Create a new travel package and link checkboxes
router.post('/packages', async (req, res) => {
  const { title, type, duration, cost, service_ids } = req.body;
  
  try {
    await pool.query('BEGIN'); // Start transaction

    // Insert into packages table (ignoring 'features' column)
    const packageResult = await pool.query(
      `INSERT INTO packages (id, title, type, duration, cost) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING id`,
      [title, type, duration, cost]
    );
    const newPackageId = packageResult.rows[0].id;

    // Insert the checked services into the package_services junction table
    if (service_ids && Array.isArray(service_ids) && service_ids.length > 0) {
      for (let serviceId of service_ids) {
        await pool.query(
          `INSERT INTO package_services (package_id, service_id, is_included) VALUES ($1, $2, true)`,
          [newPackageId, serviceId]
        );
      }
    }

    await pool.query('COMMIT'); // Commit transaction
    res.status(201).json({ message: 'Package created successfully' });
  } catch (error) {
    await pool.query('ROLLBACK'); // Undo if anything fails
    console.error("Create Package Error:", error);
    res.status(500).json({ error: 'Server error creating package' });
  }
});

// Update an existing travel package and its linked checkboxes
router.put('/packages/:id', async (req, res) => {
  const { title, type, duration, cost, service_ids } = req.body;
  const packageId = req.params.id;

  try {
    await pool.query('BEGIN');

    // Update main package details
    await pool.query(
      `UPDATE packages SET title = $1, type = $2, duration = $3, cost = $4 WHERE id = $5`,
      [title, type, duration, cost, packageId]
    );

    // Delete old checkboxes/relationships for this package
    await pool.query(`DELETE FROM package_services WHERE package_id = $1`, [packageId]);

    // Insert the newly checked services
    if (service_ids && Array.isArray(service_ids) && service_ids.length > 0) {
      for (let serviceId of service_ids) {
        await pool.query(
          `INSERT INTO package_services (package_id, service_id, is_included) VALUES ($1, $2, true)`,
          [packageId, serviceId]
        );
      }
    }

    await pool.query('COMMIT');
    res.json({ message: 'Package updated successfully' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Error updating package:", error);
    res.status(500).json({ error: 'Server error updating package' });
  }
});

// Delete an existing travel package
router.delete('/packages/:id', async (req, res) => {
  try {
    await pool.query('BEGIN');
    // Must delete from junction table first to prevent Foreign Key constraint errors
    await pool.query('DELETE FROM package_services WHERE package_id = $1', [req.params.id]);
    await pool.query('DELETE FROM packages WHERE id = $1', [req.params.id]);
    await pool.query('COMMIT');
    res.json({ message: 'Package deleted' });
  } catch (error) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Server error deleting package' });
  }
});

module.exports = router;