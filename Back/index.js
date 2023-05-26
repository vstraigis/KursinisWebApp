const express = require('express');
const db = require('./db');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const authorization = require('./middleware/authorization');



// Middleware
app.use(express.json()); 
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

// License routes
app.use("/licenses", require("./routes/licenseRoutes"));

// Admin routes
app.use("/admin", require("./routes/adminRoutes"));

// settings routes
app.use("/user", require("./routes/settingsRoutes"));

// Calendar routes
app.use("/trips/", require("./routes/calendarRoutes"));

// api routes

app.use("/api", require("./routes/apiRoutes"));

// ------------------------------------------------- //

app.get('/lakedata', async (req, res) => {
  try {
    const search = req.query.search;

    const allLakes = await db.lake.findMany({
      where: search
        ? {
          name: {
            contains: search,
            mode: 'insensitive', 
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



app.post('/save-lakes', authorization, async (req, res) => {
  try {
    const userId  = req.user;
    const { lakeIds } = req.body;

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
// ------------------------------------------------- //

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});