const express = require('express');
const pool = require('./db');

const app = express();

// API endpoints go here

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});