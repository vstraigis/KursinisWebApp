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

app.get('/lakedata', async (req, res) => {
  try {
    const search = req.query.search;

    const allLakes = await db.lake.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: 'insensitive', // Use 'insensitive' for case-insensitive search
            },
          }
        : {},
      include: { lakeVisits: true },
    });

    res.json(allLakes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching lake data');
  }
});

app.post('/trips', async (req, res) => {
  try {
    // Get trip data from request body
    const { userId, date, events } = req.body;

    // Save trip to the database
    const newTrip = await db.trip.create({
      data: {
        date: new Date(date),
        name: events[0].title, // Save the trip name
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    // Send the saved trip as a response
    res.status(201).json(newTrip);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving trip');
  }
});

//get user info
app.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user from the database
    const user = await db.user.findUnique({
      where: { id: parseInt(userId) },
    });

    // Send the user as a response
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user');
  }
});

// Get all trips for a user
app.get('/trips/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch trips from the database
    const trips = await db.trip.findMany({
      where: { userId: parseInt(userId) },
    });


    // Send the trips as a response
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching trips');
  }
});

// Delete a trip by ID
app.delete('/trips/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    await db.trip.delete({ where: { id: parseInt(tripId) } });
    res.status(204).send('Trip deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting trip');
  }
});

app.post('/save-lakes', async (req, res) => {
  try {
    const { userId, lakeIds } = req.body;

    // Delete all existing LakeVisit records for this user
    await db.lakeVisit.deleteMany({ where: { userId: parseInt(userId) } });

    // Create new LakeVisit records for the checked lakes
    const newLakeVisits = await db.lakeVisit.createMany({
      data: lakeIds.map((lakeId) => ({
        userId: parseInt(userId),
        lakeId: parseInt(lakeId),
      })),
    });

    res.status(201).json(newLakeVisits);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving checked lakes');
  }
});

app.get('/visited-lakes/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch visited lakes from the database
    const visitedLakes = await db.lakeVisit.findMany({
      where: { userId: parseInt(userId) },
      select: { lake: { select: { name: true } } },
    });

    const visitedLakeNames = visitedLakes.map((lakeVisit) => lakeVisit.lake.name);

    // Send the visited lake names as a response
    res.json(visitedLakeNames);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching visited lakes');
  }
});

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