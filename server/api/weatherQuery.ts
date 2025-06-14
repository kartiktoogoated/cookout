import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get('/', async (req, res) => {
    const city = req.query.city || "Noida";
    try {
        const { data } = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
            params: {
                q: city,
                appid: process.env.WEATHER_API_KEY,
                units: "metric",
            }
        });

        // Return only what frontend needs
        res.json({
            city: data.name,
            temp: data.main.temp,
            condition: data.weather[0].description,
        })
    } catch (err:any) {
        console.error("Failed to fetch weather:", err.message);
        res.status(500).json({ error: "Weather fetch failed" });
      }
    });

 export default router;    