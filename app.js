const express = require("express");
const dotenv = require("dotenv");
const hbs = require("hbs");
const path = require("path");

dotenv.config();

const PORT = process.env.SERVER_PORT;
const API_URL = process.env.API_URL;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const app = express();
app.use(express.json());
app.set("view engine", hbs);

hbs.registerPartials(path.join(__dirname, "views/partials"));

const cities = [
  { name: "Ковель", lat: 51.2153, lon: 24.7087 },
  { name: "Тернопіль", lat: 49.5535, lon: 25.5948 },
  { name: "Одеса", lat: 46.4825, lon: 30.7233 },
  { name: "Київ", lat: 50.4501, lon: 30.5234 },
  { name: "Черкаси", lat: 49.4444, lon: 32.0598 },
  { name: "Обухів", lat: 50.1081, lon: 30.6425 },
];

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server is started on port ${PORT}!`));
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.render("weather.hbs", { cities: cities });
});

app.get("/weather/:city", async (req, res) => {
  try {
    const cityName = req.params.city;

    const cityData = cities.find((city) => city.name === cityName);

    if (!cityData) {
      throw new Error("City not found");
    }

    const url = `${API_URL}?lat=${cityData.lat}&lon=${cityData.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Weather data not available");
    }

    const weatherData = await response.json();

    res.render("weather-details.hbs", {
      city: cityName,
      weatherIcon: weatherData.current.weather[0].icon,
      weatherDescription: weatherData.current.weather[0].description,
      temperature: weatherData.current.temp.toFixed(0),
      humidity: weatherData.current.humidity,
      pressure: weatherData.current.pressure,
    });
  } catch (error) {
    console.error("Full error details:", error);
    res.status(500).send("Something went wrong!");
  }
});

start();
