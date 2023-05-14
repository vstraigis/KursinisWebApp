const express = require('express');
const db = require('./db');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const authorization = require('./middleware/authorization');

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

app.use("/licenses", require("./routes/licenseRoutes"));

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

app.post('/trips', authorization, async (req, res) => {
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
app.get('/user/:userId', authorization, async (req, res) => {
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
app.get('/trips/:userId', authorization, async (req, res) => {
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
app.delete('/trips/:tripId', authorization, async (req, res) => {
  try {
    const { tripId } = req.params;
    await db.trip.delete({ where: { id: parseInt(tripId) } });
    res.status(204).send('Trip deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting trip');
  }
});

app.post('/save-lakes', authorization, async (req, res) => {
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

app.get('/visited-lakes/:userId', authorization, async (req, res) => {
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


app.put('/user/:id/update',authorization, async (req, res) => {
  // Update user information logic here
  console.log(req.body);
  const { id } = req.params;
  const { firstName, lastName, birthDate } = req.body;

  try {
    const updatedUser = await db.user.update({
      where: { id: parseInt(id) },
      data: {
        name: firstName,
        lastName: lastName,
        birthDay: new Date(birthDate),
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error updating user information' });
  }
});

app.put('/user/:id/changepassword', authorization, async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    // Encrypt the new password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user password in the database
    const updatedUser = await db.user.update({
      where: { id: parseInt(id) },
      data: { password: encryptedPassword },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Error changing user password' });
  }
});

app.delete("/user/:id/delete", authorization, async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the associated lake visits
    await db.lakeVisit.deleteMany({
      where: {
        userId: parseInt(id),
      },
    });

    // Delete the associated licenses
    await db.license.deleteMany({
      where: {
        userId: parseInt(id),
      },
    });
    // Delete the associated trips
    await db.trip.deleteMany({
      where: {
         userId: parseInt(id), 
        },
      });

    // Delete the user
    const deletedUser = await db.user.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
});

app.get('/admin/lakes', authorization, async (req, res) => {
  try {
    const lakes = await db.lake.findMany();
    res.json(lakes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching lakes');
  }
});

app.put('/admin/lakes/:id', authorization, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, isRented, isPrivate } = req.body;

    await db.lake.update({
      where: { id },
      data: { name, isRented, isPrivate },
    });

    res.status(200).send('Lake updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating lake');
  }
});

app.delete('/admin/lakes/:id', authorization, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    await db.lake.delete({
      where: { id },
    });

    res.status(200).send('Lake deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting lake');
  }
});
//--------------------------------------------------------------------------//

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