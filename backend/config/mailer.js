const { Resend } = require('resend');
require('dotenv').config();

// Debugging check to ensure Render reads the key
if (!process.env.RESEND_API_KEY) {
  console.error("CRITICAL: RESEND_API_KEY is missing in Render settings!");
}

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = resend;