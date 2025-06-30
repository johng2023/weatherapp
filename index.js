import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
const port = 3000;
app.use(express.static('public'));

const apiKey = process.env.WEATHER_API_KEY;

function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/weather', async (req, res) => {
    const cityName = capitalizeWords(req.body['city-input']);
    try {
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`)
        const latitude = response.data[0].lat;
        const longitude = response.data[0].lon;
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`)
        const description = capitalizeWords(weatherResponse.data.weather[0].description);
        const temperature = weatherResponse.data.main.temp;
        res.render('weather.ejs', { city: cityName, weather: description, temp: temperature});
    } catch (error) {
        console.error(error.message);
    }
   
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})