import { printCurrentWeather } from "./weatherAPI.js";
const city = process.argv[2];
printCurrentWeather(city);
