const { Pool } = require('pg');

const pool = new Pool({
  user: 'valentinas',
  host: 'localhost',
  database: 'pelekas',
  password: 'pelekas123',
  port: 5432,
});

module.exports = pool;