import express from 'express';
import dotenv from 'dotenv';
import client from './redis.js';
dotenv.config();


const app = express();
const API_KEY = process.env.API_KEY;

await client.connect();

app.get('/weather', async (req, res) => {

  const LOCATION = req.query.location || '';
  const url = `${process.env.URL}${encodeURIComponent(LOCATION)}?unitGroup=metric&key=${API_KEY}`;
  console.log('Fetching weather URL:', url);
  try {
    let cached = await client.get(LOCATION);
    console.log('Redis response:', cached);
    if(cached){
        const weatherData = JSON.parse(cached);
        return res.json(weatherData);
    }
    const response = await fetch(url);
    const data = await response.json();
      if (!data.days || !data.days[0]) {
      return res.status(404).json({ error: 'Weather data not found' });
    }
    const weatherData = {
                "Forecast": data.days[0].description, 
                "Temp Max": data.days[0].tempmax, 
                "Feels like": data.days[0].feelslikemax, 
                "Min Temp": data.days[0].tempmin
              }

        await client.set(LOCATION, JSON.stringify(weatherData), { EX: 3 });
        res.json(weatherData);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});
app.listen(3000, () => {
  console.log('Server running on port 3000');
});