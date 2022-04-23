const asyncRequest = require('async-request');

const ACCESS_KEY = 'dbb17b35870c95c296f8c04dcba0f2ec';
const getWeather = async (location) => {
  const url = `http://api.weatherstack.com/current?access_key=${ACCESS_KEY}&query=${location}`;
  try {
    const res = await asyncRequest(url);
    const data = JSON.parse(res.body);
    console.log(data);
    const weather = {
      isSuccess: true,
      region: data.location.region,
      country: data.location.country,
      temperature: data.current.temperature,
      wind_speed: data.current.wind_speed,
      precip: data.current.precip,
      cloudcover: data.current.cloudcover,
    };
    return weather;
  } catch (err) {
    console.error(err);
    return {
      isSuccess: false,
      err,
    };
  }
};

const express = require('express');
const app = express();
const path = require('path');
const pathPublic = path.join(__dirname, './public');

app.use(express.static(pathPublic));
// http://localhost:7000/
app.get('/', async (req, res) => {
  const params = req.query;
  const location = params.address;
  if (location) {
    const weather = await getWeather(location);
    res.render('weather', {
      status: true,
      region: weather.region,
      country: weather.country,
      temperature: weather.temperature,
      wind_speed: weather.wind_speed,
      precip: weather.precip,
      cloudcover: weather.cloudcover,
    });
  } else {
    res.render('weather', {
      status: false,
    });
  }
});

app.set('view engine', 'hbs'); //pug

const port = 7000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
