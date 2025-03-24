const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

app.get("/hourly-forecast", async (req, res) => {
    const { city } = req.query;

    if (!city) return res.status(400).json({ error: "City is required" });

    try {
        const response = await axios.get(
            `${BASE_URL}forecast?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
        );

        const data = response.data.list;

        // Organize forecast by day
        const dailyForecast = {};
        data.forEach((entry) => {
            const date = entry.dt_txt.split(" ")[0]; // Extract date
            if (!dailyForecast[date]) dailyForecast[date] = [];
            dailyForecast[date].push({
                time: entry.dt_txt.split(" ")[1], // Extract time
                temp: entry.main.temp,
                description: entry.weather[0].description,
            });
        });

        res.json(dailyForecast);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not fetch weather data" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
