import axios from "axios";
import { OPEN_WEATHER_MAP_API_KEY } from "./credential.js";
import Table from "cli-table3";
import { DateTime } from "luxon";
import chalk from "chalk";

async function getData(url) {
  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    //console.log(error.code);
    const errorMessages = {
      401: "API key este incorect. Va rugam verificati fisierul credential.js. ",
      404:
        "Denumirea orasului nu este valida. " +
        "Va rugam verificati ati introdus numele orasului corect. ",
      429: "Ati depasit limita de cereri actre OpenWeatherMAp API. ",
      500: "Ne pare rau, a aparut o eroare interna a serverului. ",
      EAI_AGAIN:
        "Nu exita o conexiune cu internetul." +
        "Verificati daca sunteti conectati la o sursa de internet. ",
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
    `În ${data.name} se prognozeaza ${data.weather[0].description}.` +
      `\nTemperatura curentă este de ${data.main.temp}°C. ` +
      `\n Long: ${data.coord.lon} Lat: ${data.coord.lat}`
  );
  return data.coord;
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
      `${dayData.temp.max}°C`,
      `${dayData.temp.min}°C`,
      `${dayData.wind_speed}km/h`,
    ];
    table.push(arr);
  });

  console.log(table.toString());
}
