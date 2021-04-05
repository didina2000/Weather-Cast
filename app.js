import axios from "axios";
//const argv = process.argv;
import { OPEN_WEATHER_MAP_API_KEY } from "./credential.js";
const city = process.argv[2];
async function printCurrentWeather(cityName) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;
  try {
    const response = await axios.get(OPEN_WEATHER_MAP_API);
    let data = response.data;
    console.log(
      `În ${data.name} se prognozeaza ${data.weather[0].description}.` +
        `\nTemperatura curentă este de ${data.main.temp}°C.`
    );
  } catch (error) {
    console.log(error);
  }
}
printCurrentWeather(city);
