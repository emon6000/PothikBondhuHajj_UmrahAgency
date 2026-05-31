const nodemailer = require('nodemailer');
require('dotenv').config();

// Debugging check
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("CRITICAL: EMAIL_USER or EMAIL_PASS is missing in Render settings!");
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  // Add these to force the connection to break if it hangs
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
});

module.exports = transporter;