const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
  ...(process.env.DATABASE_URL 
    ? { ssl: { rejectUnauthorized: false } }
    : {
        user: 'postgres',
        host: 'localhost',
        database: 'hajj_umrah_db',
        password: process.env.DB_PASSWORD,
        port: 5432,
      }
  )
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error acquiring client from pool:', err.stack);
  }
  console.log('✅ Database connected successfully');
  release();
});

module.exports = pool;