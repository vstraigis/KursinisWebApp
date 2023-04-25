const express = require('express');
const db = require('./db');

const app = express();

// Root path route
app.get('/', (req, res) => {
  res.send('Welcome to the PERN Stack Application API!');
});

// Example usage with Prisma:
app.get('/users', async (req, res) => {
  try {
    const mockupUser = {
      email: "mockup@example.com",
      password: "mockupPassword",
      role: "USER",
    };

    await db.user.create({ data: mockupUser }); 
    
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