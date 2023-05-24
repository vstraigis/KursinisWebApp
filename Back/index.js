const express = require('express');
const db = require('./db');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const authorization = require('./middleware/authorization');
const admincheck = require('./middleware/admincheck');

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


// Get all trips for a user
app.get('/trips', authorization, async (req, res) => {
  try {
    
    const userId  = req.user
    
    
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
app.delete('/trips', authorization, async (req, res) => {
  try {

    const tripId = req.headers.tripid;


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

app.get('/visited-lakes', authorization, async (req, res) => {
  try {
  
    const userId  = req.user;

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


app.put('/user/update',authorization, async (req, res) => {
  // Update user information logic here

  const id  = req.user;
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
    res.status(400).json({ error: 'Error updating user information' });
  }
});

app.put('/user/changepassword', authorization, async (req, res) => {
  const  id  = req.user;
  
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

app.delete("/user/delete", authorization, async (req, res) => {
  const  id  = req.user;

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

app.get('/admin/lakes', admincheck, async (req, res) => {
  try {
    const lakes = await db.lake.findMany();
    res.json(lakes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching lakes');
  }
});

app.put('/admin/lakes/:id', admincheck, async (req, res) => {
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

app.delete('/admin/lakes/:id', admincheck, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // First, delete the related rows in the LakeVisit table
    await db.lakeVisit.deleteMany({
      where: { lakeId: id },
    });

    // Now you can delete the lake
    await db.lake.delete({
      where: { id },
    });

    res.status(200).send('Lake deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting lake');
  }
});

app.get('/user/visitedLakes', authorization, async (req, res) => {
  try {
    const  userId  = req.user;

    // Fetch visited lakes from the database
    const visitedLakes = await db.lakeVisit.findMany({
      where: { userId: parseInt(userId) },
      include: { lake: true },
    });

    const visitedLakesCount = visitedLakes.reduce((acc, lakeVisit) => {
      const lakeName = lakeVisit.lake.name;
      if (acc[lakeName]) {
        acc[lakeName]++;
      } else {
        acc[lakeName] = 1;
      }
      return acc;
    }, {});

    const result = Object.entries(visitedLakesCount).map(([name, count]) => ({
      name,
      count,
    }));

    // Send the visited lakes distribution as a response
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching visited lakes distribution');
  }
});

// Get the number of licenses for a user
app.get('/user/licenses', authorization, async (req, res) => {
  try {
    const  userId  = req.user;

    // Fetch licenses from the database
    const licenses = await db.license.findMany({
      where: { userId: parseInt(userId) },
    });

    // Send the licenses count as a response
    res.json(licenses);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching licenses count');
  }
});

// Get all of the user data for data download
app.get('/download/data', authorization, async (req, res) => {
  try {
    const  userId  = req.user;

    // Fetch user data from the database
    const user = await db.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        visitedLakes: {
          include: {
            lake: true,
          },
        },
        licenses: true,
        trips: true,
      },
    });

    // Destructure the user object and exclude the password field
    const { password, ...userDataWithoutPassword } = user;

    // Prepare the user data with lake names instead of lake ids
    const userData = {
      ...userDataWithoutPassword,
      visitedLakes: user.visitedLakes.map((lakeVisit) => ({
        ...lakeVisit,
        lakeId: lakeVisit.lake.name,
      })),
    };

    // Send the user data as a response
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user data');
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