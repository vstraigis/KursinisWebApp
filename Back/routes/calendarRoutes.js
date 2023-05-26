const authorization = require("../middleware/authorization");
const router = require("express").Router();
const db = require("../db");

router.post('/', authorization, async (req, res) => {
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
router.get('/', authorization, async (req, res) => {
    try {

        const userId = req.user


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
router.delete('/', authorization, async (req, res) => {
    try {

        const tripId = req.headers.tripid;


        await db.trip.delete({ where: { id: parseInt(tripId) } });
        res.status(204).send('Trip deleted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting trip');
    }
});

module.exports = router;