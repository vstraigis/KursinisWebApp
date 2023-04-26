const express = require('express');
const db = require('./db');
const app = express();
const cors = require('cors');

// Middleware
app.use(express.json()); // req.body
app.use(cors());

// Routes

// Root path route
app.get('/', (req, res) => {
  res.send('Welcome to the PERN Stack Application API!');
});


// Register and login routes
app.use('/auth', require('./routes/jwtAuth'));

// Dashboard route
app.use('/dashboard', require('./routes/dashboard'));



// Example usage with Prisma:
app.get('/users', async (req, res) => {
  try {
    const allUsers = await db.user.findMany();
    res.json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching users');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});