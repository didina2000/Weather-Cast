import axios from "axios";
import { OPEN_WEATHER_MAP_API_KEY } from "./credential.js";

export async function printCurrentWeather(cityName) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;
  try {
    const response = await axios.get(OPEN_WEATHER_MAP_API);
    const data = response.data;
    console.log(
      `În ${data.name} se prognozeaza ${data.weather[0].description}.` +
        `\nTemperatura curentă este de ${data.main.temp}°C. ` +
        `\n Long: ${data.coord.lon} Lat: ${data.coord.lat}`
    );
    printWeatherFor7Days(data.coord.lat, data.coord.lon);
  } catch (error) {
    console.log(error.message);
  }
}

export async function printWeatherFor7Days(lat, long) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;
  try {
    const response = await axios.get(OPEN_WEATHER_MAP_API);
    let data = response.data;
    console.log(data.daily.length);
  } catch (error) {
    console.log(error);
  }
}
