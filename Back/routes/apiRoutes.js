const authorization = require("../middleware/authorization");
const router = require("express").Router();
require("dotenv").config();

router.get("/maps", authorization, async (req, res) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        res.json({ apiKey });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching Google Maps API key");
      }
    });




router.get("/weather/:x/:y", authorization, async (req, res) => {
    try {
        const x = req.params.x;
        const y = req.params.y;

        const apiKey = process.env.WEATHER_API_KEY;

        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${y}&lon=${x}&units=metric&appid=${apiKey}`
        );
        const weatherData = await weatherResponse.json(); // convert the response to JSON format
       

        res.json(weatherData);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error fetching weather data");
    }
});

module.exports = router;