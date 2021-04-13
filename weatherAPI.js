import axios from "axios";
import { OPEN_WEATHER_MAP_API_KEY } from "./credential.js";
import Table from "cli-table3";
import { DateTime } from "luxon";
import chalk from "chalk";

/**
 * Gets data
 * @param {} url
 * @returns
 */
async function getData(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    const errorMessages = {
      401: "API key este incorect. Vă rugăm verificați fișierul credential.js. ",
      404:
        "Denumirea orașului nu este validă.  " +
        "Vă rugăm verificați dacă ați introdus numele orașului corect! ",
      429: "Ați depășit limita de cereri către OpenWeatherMAp API. ",
      500: "Ne pare rău, a apărut o eroare internă a serverului. ",
      EAI_AGAIN:
        "Nu există o conexiune cu Internetul." +
        "Verificați dacă sunteți conectați la o sursă de internet. ",
      get ENOTFOUND() {
        return this.EAI_AGAIN;
      },
    };
    const errorCode = error.code || Number(error.response.data.cod);
    console.log(chalk.red.bgYellow.bold(errorMessages[errorCode]));
    process.exit();
  }
}

/**
 * @typedef {object} Coords
 * @property {number} lat - geographical latitude
 * @property {number} lon - geographical longitude
 */
/**
 * Prints current wather codintions
 * @param {string} cityName
 *                 name of city.optional "City,(State,),Country".(Use ISO country cod)
 * @returns {Coords} geographical coordinates of the city
 */
export async function printCurrentWeather(cityName) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;
  const data = await getData(OPEN_WEATHER_MAP_API);
  console.log(
    `În ${data.name} se prognozează ${data.weather[0].description}.` +
      `\nTemperatura curentă este de ${data.main.temp}°C.` +
      `\n Long: ${data.coord.lon} Lat: ${data.coord.lat}`
  );
  return data.coord;
}

/**
 * Makes a table with dates
 * @param {string} data
 * @returns {}
 */
function makeForecastTable(data) {
  let table = new Table({
    head: ["Data", "Temp max.", "Temp min.", "Viteza vantului"],
  });
  const dailyData = data.daily;
  dailyData.forEach((dayData) => {
    const date = DateTime.fromSeconds(dayData.dt)
      .setLocale("ro")
      .toLocaleString(DateTime.DATE_MED);
    const arr = [
      date,
      `${Math.round(dayData.temp.max)}°C`,
      `${Math.round(dayData.temp.min)}°C`,
      `${Math.round(dayData.wind_speed)}m/s`,
    ];
    table.push(arr);
  });
  return table;
}

/**
 * Prints weather forecast for 8 days
 * @param {Coords} coords - geographical coordonats of a location
 */
export async function printWeatherFor8Days({ lat, lon }) {
  const OPEN_WEATHER_MAP_API =
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}` +
    `&appid=${OPEN_WEATHER_MAP_API_KEY}&units=metric&lang=ro`;
  const data = await getData(OPEN_WEATHER_MAP_API);

  console.log(makeForecastTable(data).toString());
}
