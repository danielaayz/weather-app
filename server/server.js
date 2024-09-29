const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Tillåt CORS för att frontend ska kunna göra anrop till servern
app.use(cors());

// Route för att hämta väderdata
app.get("/api/weather", async (req, res) => {
   const city = req.query.city;
   const apiKey = process.env.OPENWEATHER_API_KEY;

   try {
      const response = await axios.get(
         `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      res.json(response.data);
      console.log(response.data);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather data" });
   }
});

// NY ROUTE: Route för att söka städer
app.get("/api/city-search", async (req, res) => {
   const city = req.query.city;
   const apiKey = process.env.OPENWEATHER_API_KEY;

   try {
      // Anropar OpenWeatherMap Geocoding API för att hämta stadförslag
      const response = await axios.get(
         `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
      );
      res.json(response.data); // Returnerar resultatet till frontend
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch city data" });
   }
});

// Startat servern
app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
