// const apiKey = "fa5d34bf7bac4fdfd7384a12417d93a1";

// /* ---------------- ELEMENTS ---------------- */

// const cityNameEl = document.getElementById("city-name");
// const dateEl = document.getElementById("current-date");

// const metricEl = document.getElementById("metric");
// const weatherMainEl = document.getElementById("weather-main");
// const humidityEl = document.getElementById("humidity");
// const feelsLikeEl = document.getElementById("feels-like");

// const currentWeatherIconEl = document.getElementById("current-weather-icon");

// const todayWeatherIconEl = document.getElementById("today-weather-icon");
// const tempMinTodayEl = document.getElementById("temp-min-today");
// const tempMaxTodayEl = document.getElementById("temp-max-today");
// const todayWeatherMainEl = document.getElementById("today-weather-main");

// const futureForecastBox = document.getElementById("future-forecast-box");

// const celsiusBtn = document.getElementById("celsius-btn");
// const fahrenheitBtn = document.getElementById("fahrenheit-btn");

// /* ---------------- GLOBAL STATE ---------------- */

// let currentUnit = "metric";
// let currentLat = null;
// let currentLon = null;

// /* ---------------- DATE ---------------- */

// function showCurrentDate(){

// const today = new Date();

// const options = {
// weekday:"long",
// year:"numeric",
// month:"long",
// day:"numeric"
// };

// dateEl.textContent = today.toLocaleDateString("en-US", options);

// }

// /* ---------------- HELPERS ---------------- */

// function formatTemperature(value){
// return `${Math.round(value)}°`;
// }

// function getWeatherIcon(iconCode){
// return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
// }

// function getDayName(dateString){
// const date = new Date(dateString);
// return date.toLocaleDateString("en-US",{weekday:"short"});
// }

// function setActiveUnitButton(){

// if(currentUnit === "metric"){
// celsiusBtn.classList.add("active");
// fahrenheitBtn.classList.remove("active");
// }
// else{
// fahrenheitBtn.classList.add("active");
// celsiusBtn.classList.remove("active");
// }

// }

// /* ---------------- BACKGROUND ---------------- */

// function resetWeatherBackground(){

// document.body.classList.remove(
// "sunny",
// "clear-night",
// "cloudy",
// "rainy",
// "drizzle",
// "thunderstorm",
// "snowy",
// "misty",
// "default-weather"
// );

// }

// function setWeatherBackground(weatherMain,iconCode){

// resetWeatherBackground();

// const weather = weatherMain.toLowerCase();

// if(weather === "clear"){

// if(iconCode.endsWith("n")){
// document.body.classList.add("clear-night");
// }
// else{
// document.body.classList.add("sunny");
// }

// }

// else if(weather === "clouds"){
// document.body.classList.add("cloudy");
// }

// else if(weather === "rain"){
// document.body.classList.add("rainy");
// }

// else if(weather === "drizzle"){
// document.body.classList.add("drizzle");
// }

// else if(weather === "thunderstorm"){
// document.body.classList.add("thunderstorm");
// }

// else if(weather === "snow"){
// document.body.classList.add("snowy");
// }

// else if(
// weather === "mist" ||
// weather === "haze" ||
// weather === "fog" ||
// weather === "smoke"
// ){
// document.body.classList.add("misty");
// }

// else{
// document.body.classList.add("default-weather");
// }

// }

// function clearIcons(){

// currentWeatherIconEl.src = "";
// todayWeatherIconEl.src = "";

// }

// /* ---------------- ERROR ---------------- */

// function showError(message){

// cityNameEl.textContent = message;
// metricEl.textContent = "--°";
// weatherMainEl.textContent = "Unable to load weather";
// humidityEl.textContent = "--";
// feelsLikeEl.textContent = "--°";

// tempMinTodayEl.textContent = "--°";
// tempMaxTodayEl.textContent = "--°";

// todayWeatherMainEl.textContent = "No data";

// clearIcons();

// futureForecastBox.innerHTML = `<div class="error-text">${message}</div>`;

// resetWeatherBackground();
// document.body.classList.add("default-weather");

// }

// /* ---------------- API CALLS ---------------- */

// async function fetchCurrentWeather(lat,lon){

// const url =
// `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}`;

// const response = await fetch(url);
// const data = await response.json();

// if(!response.ok){
// throw new Error(data.message || "Weather fetch failed");
// }

// return data;

// }

// async function fetchForecast(lat,lon){

// const url =
// `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}`;

// const response = await fetch(url);
// const data = await response.json();

// if(!response.ok){
// throw new Error(data.message || "Forecast fetch failed");
// }

// return data;

// }

// /* ---------------- GEO CITY ---------------- */

// async function fetchCoordinatesByCity(city){

// const url =
// `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

// const response = await fetch(url);
// const data = await response.json();

// if(!data.length){
// throw new Error("City not found");
// }

// return {
// lat:data[0].lat,
// lon:data[0].lon
// };

// }

// /* ---------------- CURRENT WEATHER ---------------- */

// function renderCurrentWeather(data){

// cityNameEl.textContent =
// `${data.name}, ${data.sys.country}`;

// metricEl.textContent =
// formatTemperature(data.main.temp);

// weatherMainEl.textContent =
// data.weather[0].main;

// humidityEl.textContent =
// data.main.humidity;

// feelsLikeEl.textContent =
// formatTemperature(data.main.feels_like);

// currentWeatherIconEl.src =
// getWeatherIcon(data.weather[0].icon);

// setWeatherBackground(
// data.weather[0].main,
// data.weather[0].icon
// );

// }

// /* ---------------- GROUP FORECAST ---------------- */

// function groupForecastByDate(list){

// const grouped = {};

// list.forEach(item=>{

// const dateKey = item.dt_txt.split(" ")[0];

// if(!grouped[dateKey]){
// grouped[dateKey] = [];
// }

// grouped[dateKey].push(item);

// });

// return grouped;

// }

// /* ---------------- TODAY FORECAST ---------------- */

// function renderTodayForecast(groupedForecast){

// const dates = Object.keys(groupedForecast);

// if(!dates.length){

// tempMinTodayEl.textContent="--°";
// tempMaxTodayEl.textContent="--°";
// todayWeatherMainEl.textContent="No data";
// todayWeatherIconEl.src="";

// return;

// }

// const todayData = groupedForecast[dates[0]];

// let minTemp = todayData[0].main.temp_min;
// let maxTemp = todayData[0].main.temp_max;

// todayData.forEach(item=>{

// if(item.main.temp_min < minTemp)
// minTemp = item.main.temp_min;

// if(item.main.temp_max > maxTemp)
// maxTemp = item.main.temp_max;

// });

// const mid = todayData[Math.floor(todayData.length/2)];

// tempMinTodayEl.textContent =
// formatTemperature(minTemp);

// tempMaxTodayEl.textContent =
// formatTemperature(maxTemp);

// todayWeatherMainEl.textContent =
// mid.weather[0].main;

// todayWeatherIconEl.src =
// getWeatherIcon(mid.weather[0].icon);

// }

// /* ---------------- FUTURE FORECAST ---------------- */

// function renderFutureForecast(groupedForecast){

// const dates = Object.keys(groupedForecast);

// if(dates.length <= 1){

// futureForecastBox.innerHTML =
// `<div class="error-text">No forecast available</div>`;

// return;

// }

// const nextDays = dates.slice(1,6);

// futureForecastBox.innerHTML = "";

// nextDays.forEach(dateKey=>{

// const dayData = groupedForecast[dateKey];

// let minTemp = dayData[0].main.temp_min;
// let maxTemp = dayData[0].main.temp_max;

// dayData.forEach(item=>{

// if(item.main.temp_min < minTemp)
// minTemp = item.main.temp_min;

// if(item.main.temp_max > maxTemp)
// maxTemp = item.main.temp_max;

// });

// const mid = dayData[Math.floor(dayData.length/2)];

// const forecastItem =
// document.createElement("div");

// forecastItem.className = "forecast-item";

// forecastItem.innerHTML =

// `
// <div class="forecast-day">${getDayName(dateKey)}</div>

// <div class="forecast-icon">
// <img src="${getWeatherIcon(mid.weather[0].icon)}">
// </div>

// <div class="forecast-desc">
// ${mid.weather[0].description}
// </div>

// <div class="forecast-temp">
// ${formatTemperature(minTemp)} /
// ${formatTemperature(maxTemp)}
// </div>
// `;

// futureForecastBox.appendChild(forecastItem);

// });

// }

// /* ---------------- LOAD WEATHER ---------------- */

// async function loadWeather(lat,lon){

// try{

// currentLat = lat;
// currentLon = lon;

// cityNameEl.textContent = "Loading weather...";

// futureForecastBox.innerHTML =
// `<div class="loading-text">Loading forecast...</div>`;

// const [currentWeatherData,forecastData] =
// await Promise.all([

// fetchCurrentWeather(lat,lon),
// fetchForecast(lat,lon)

// ]);

// renderCurrentWeather(currentWeatherData);

// const groupedForecast =
// groupForecastByDate(forecastData.list);

// renderTodayForecast(groupedForecast);
// renderFutureForecast(groupedForecast);

// }

// catch(error){

// console.error("Weather error:",error.message);

// showError("Failed to load weather data");

// }

// }

// /* ---------------- DEFAULT CITY ---------------- */

// async function loadDefaultCityWeather(){

// try{

// const cityData =
// await fetchCoordinatesByCity("New York");

// await loadWeather(
// cityData.lat,
// cityData.lon
// );

// }

// catch(error){

// console.error(error);

// showError("Could not load default weather");

// }

// }

// /* ---------------- GEOLOCATION ---------------- */

// function getUserLocation(){

// if(!navigator.geolocation){

// loadDefaultCityWeather();
// return;

// }

// navigator.geolocation.getCurrentPosition(

// position=>{

// const lat = position.coords.latitude;
// const lon = position.coords.longitude;

// loadWeather(lat,lon);

// },

// error=>{

// console.error("Location denied");

// loadDefaultCityWeather();

// }

// );

// }

// /* ---------------- UNIT SWITCH ---------------- */

// celsiusBtn.addEventListener("click",()=>{

// if(currentUnit !== "metric"){

// currentUnit = "metric";
// setActiveUnitButton();

// if(currentLat && currentLon){
// loadWeather(currentLat,currentLon);
// }

// }

// });

// fahrenheitBtn.addEventListener("click",()=>{

// if(currentUnit !== "imperial"){

// currentUnit = "imperial";
// setActiveUnitButton();

// if(currentLat && currentLon){
// loadWeather(currentLat,currentLon);
// }

// }

// });

// /* ---------------- INIT ---------------- */

// showCurrentDate();

// setActiveUnitButton();

// document.body.classList.add("default-weather");

// getUserLocation();





const apiKey = "fa5d34bf7bac4fdfd7384a12417d93a1";

/* ---------------- ELEMENTS ---------------- */

const cityNameEl = document.getElementById("city-name");
const dateEl = document.getElementById("current-date");

const metricEl = document.getElementById("metric");
const weatherMainEl = document.getElementById("weather-main");
const humidityEl = document.getElementById("humidity");
const feelsLikeEl = document.getElementById("feels-like");

const currentWeatherIconEl = document.getElementById("current-weather-icon");

const todayWeatherIconEl = document.getElementById("today-weather-icon");
const tempMinTodayEl = document.getElementById("temp-min-today");
const tempMaxTodayEl = document.getElementById("temp-max-today");
const todayWeatherMainEl = document.getElementById("today-weather-main");

const futureForecastBox = document.getElementById("future-forecast-box");

const celsiusBtn = document.getElementById("celsius-btn");
const fahrenheitBtn = document.getElementById("fahrenheit-btn");

/* ---------------- GLOBAL STATE ---------------- */

let currentUnit = "metric";
let currentLat = null;
let currentLon = null;

/* ---------------- DATE ---------------- */

function showCurrentDate() {
  const today = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  dateEl.textContent = today.toLocaleDateString("en-US", options);
}

/* ---------------- HELPERS ---------------- */

function formatTemperature(value) {
  return `${Math.round(value)}°`;
}

function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function getDayNameFromDateKey(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

function setActiveUnitButton() {
  if (currentUnit === "metric") {
    celsiusBtn.classList.add("active");
    fahrenheitBtn.classList.remove("active");
  } else {
    fahrenheitBtn.classList.add("active");
    celsiusBtn.classList.remove("active");
  }
}

function resetWeatherBackground() {
  document.body.classList.remove(
    "sunny",
    "clear-night",
    "cloudy",
    "rainy",
    "drizzle",
    "thunderstorm",
    "snowy",
    "misty",
    "default-weather"
  );
}

function setWeatherBackground(weatherMain, iconCode) {
  resetWeatherBackground();

  const weather = weatherMain.toLowerCase();

  if (weather === "clear") {
    if (iconCode.endsWith("n")) {
      document.body.classList.add("clear-night");
    } else {
      document.body.classList.add("sunny");
    }
  } else if (weather === "clouds") {
    document.body.classList.add("cloudy");
  } else if (weather === "rain") {
    document.body.classList.add("rainy");
  } else if (weather === "drizzle") {
    document.body.classList.add("drizzle");
  } else if (weather === "thunderstorm") {
    document.body.classList.add("thunderstorm");
  } else if (weather === "snow") {
    document.body.classList.add("snowy");
  } else if (
    weather === "mist" ||
    weather === "haze" ||
    weather === "fog" ||
    weather === "smoke"
  ) {
    document.body.classList.add("misty");
  } else {
    document.body.classList.add("default-weather");
  }
}

function clearIcons() {
  currentWeatherIconEl.src = "";
  todayWeatherIconEl.src = "";
}

function showError(message) {
  cityNameEl.textContent = message;
  metricEl.textContent = "--°";
  weatherMainEl.textContent = "Unable to load weather";
  humidityEl.textContent = "--";
  feelsLikeEl.textContent = "--°";

  tempMinTodayEl.textContent = "--°";
  tempMaxTodayEl.textContent = "--°";
  todayWeatherMainEl.textContent = "No data";

  clearIcons();

  futureForecastBox.innerHTML = `<div class="error-text">${message}</div>`;

  resetWeatherBackground();
  document.body.classList.add("default-weather");
}

function getLocalDateKeyFromUnix(timestamp, timezoneOffsetSeconds) {
  const localMs = (timestamp + timezoneOffsetSeconds) * 1000;
  const localDate = new Date(localMs);

  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(localDate.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatWeatherDescription(description) {
  const desc = description.toLowerCase();

  const weatherMap = {
    "clear sky": "Sunny",
    "few clouds": "Partly Cloudy",
    "scattered clouds": "Mostly Cloudy",
    "broken clouds": "Cloudy",
    "overcast clouds": "Overcast",
    "light rain": "Light Rain",
    "moderate rain": "Rain",
    "heavy intensity rain": "Heavy Rain",
    "very heavy rain": "Heavy Rain",
    "light snow": "Light Snow",
    "snow": "Snow",
    "mist": "Misty",
    "haze": "Hazy",
    "fog": "Foggy",
    "thunderstorm": "Thunderstorm"
  };

  return weatherMap[desc] || desc.replace(/\b\w/g, (char) => char.toUpperCase());
}

/* ---------------- API CALLS ---------------- */

async function fetchCurrentWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Weather fetch failed");
  }

  return data;
}

async function fetchForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Forecast fetch failed");
  }

  return data;
}

/* ---------------- GEO CITY ---------------- */

async function fetchCoordinatesByCity(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.length) {
    throw new Error("City not found");
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon
  };
}

/* ---------------- CURRENT WEATHER ---------------- */

function renderCurrentWeather(data) {
  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  metricEl.textContent = formatTemperature(data.main.temp);
  weatherMainEl.textContent = formatWeatherDescription(data.weather[0].description);
  humidityEl.textContent = data.main.humidity;
  feelsLikeEl.textContent = formatTemperature(data.main.feels_like);
  currentWeatherIconEl.src = getWeatherIcon(data.weather[0].icon);

  setWeatherBackground(data.weather[0].main, data.weather[0].icon);
}

/* ---------------- GROUP FORECAST ---------------- */

function groupForecastByDate(list, timezoneOffsetSeconds) {
  const grouped = {};

  list.forEach((item) => {
    const dateKey = getLocalDateKeyFromUnix(item.dt, timezoneOffsetSeconds);

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(item);
  });

  return grouped;
}

function getRepresentativeForecastItem(dayData, timezoneOffsetSeconds) {
  let bestItem = dayData[0];
  let bestDistance = Infinity;

  dayData.forEach((item) => {
    const localMs = (item.dt + timezoneOffsetSeconds) * 1000;
    const localDate = new Date(localMs);
    const hour = localDate.getUTCHours();
    const distanceFromNoon = Math.abs(hour - 12);

    if (distanceFromNoon < bestDistance) {
      bestDistance = distanceFromNoon;
      bestItem = item;
    }
  });

  return bestItem;
}

/* ---------------- TODAY FORECAST ---------------- */

function renderTodayForecast(groupedForecast, todayKey, timezoneOffsetSeconds) {
  const todayData = groupedForecast[todayKey];

  if (!todayData || !todayData.length) {
    tempMinTodayEl.textContent = "--°";
    tempMaxTodayEl.textContent = "--°";
    todayWeatherMainEl.textContent = "No data";
    todayWeatherIconEl.src = "";
    return;
  }

  let minTemp = todayData[0].main.temp_min;
  let maxTemp = todayData[0].main.temp_max;

  todayData.forEach((item) => {
    if (item.main.temp_min < minTemp) minTemp = item.main.temp_min;
    if (item.main.temp_max > maxTemp) maxTemp = item.main.temp_max;
  });

  const representativeItem = getRepresentativeForecastItem(
    todayData,
    timezoneOffsetSeconds
  );

  tempMinTodayEl.textContent = formatTemperature(minTemp);
  tempMaxTodayEl.textContent = formatTemperature(maxTemp);
  todayWeatherMainEl.textContent = formatWeatherDescription(
    representativeItem.weather[0].description
  );
  todayWeatherIconEl.src = getWeatherIcon(representativeItem.weather[0].icon);
}

/* ---------------- FUTURE FORECAST ---------------- */

function renderFutureForecast(groupedForecast, todayKey, timezoneOffsetSeconds) {
  const dates = Object.keys(groupedForecast).sort();

  const futureDates = dates.filter((dateKey) => dateKey > todayKey).slice(0, 5);

  if (!futureDates.length) {
    futureForecastBox.innerHTML = `<div class="error-text">No forecast available</div>`;
    return;
  }

  futureForecastBox.innerHTML = "";

  futureDates.forEach((dateKey) => {
    const dayData = groupedForecast[dateKey];

    let minTemp = dayData[0].main.temp_min;
    let maxTemp = dayData[0].main.temp_max;

    dayData.forEach((item) => {
      if (item.main.temp_min < minTemp) minTemp = item.main.temp_min;
      if (item.main.temp_max > maxTemp) maxTemp = item.main.temp_max;
    });

    const representativeItem = getRepresentativeForecastItem(
      dayData,
      timezoneOffsetSeconds
    );

    const forecastItem = document.createElement("div");
    forecastItem.className = "forecast-item";

    forecastItem.innerHTML = `
      <div class="forecast-day">${getDayNameFromDateKey(dateKey)}</div>
      <div class="forecast-icon">
        <img src="${getWeatherIcon(representativeItem.weather[0].icon)}" alt="${representativeItem.weather[0].description}">
      </div>
      <div class="forecast-desc">${formatWeatherDescription(representativeItem.weather[0].description)}</div>
      <div class="forecast-temp">${formatTemperature(minTemp)} / ${formatTemperature(maxTemp)}</div>
    `;

    futureForecastBox.appendChild(forecastItem);
  });
}

/* ---------------- LOAD WEATHER ---------------- */

async function loadWeather(lat, lon) {
  try {
    currentLat = lat;
    currentLon = lon;

    cityNameEl.textContent = "Loading weather...";
    futureForecastBox.innerHTML = `<div class="loading-text">Loading forecast...</div>`;

    const [currentWeatherData, forecastData] = await Promise.all([
      fetchCurrentWeather(lat, lon),
      fetchForecast(lat, lon)
    ]);

    renderCurrentWeather(currentWeatherData);

    const timezoneOffsetSeconds = currentWeatherData.timezone;
    const todayKey = getLocalDateKeyFromUnix(
      currentWeatherData.dt,
      timezoneOffsetSeconds
    );

    const groupedForecast = groupForecastByDate(
      forecastData.list,
      timezoneOffsetSeconds
    );

    renderTodayForecast(groupedForecast, todayKey, timezoneOffsetSeconds);
    renderFutureForecast(groupedForecast, todayKey, timezoneOffsetSeconds);
  } catch (error) {
    console.error("Weather error:", error.message);
    showError("Failed to load weather data");
  }
}

/* ---------------- DEFAULT CITY ---------------- */

async function loadDefaultCityWeather() {
  try {
    const cityData = await fetchCoordinatesByCity("New York");
    await loadWeather(cityData.lat, cityData.lon);
  } catch (error) {
    console.error(error);
    showError("Could not load default weather");
  }
}

/* ---------------- GEOLOCATION ---------------- */

function getUserLocation() {
  if (!navigator.geolocation) {
    loadDefaultCityWeather();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      loadWeather(lat, lon);
    },
    () => {
      loadDefaultCityWeather();
    }
  );
}

/* ---------------- UNIT SWITCH ---------------- */

celsiusBtn.addEventListener("click", () => {
  if (currentUnit !== "metric") {
    currentUnit = "metric";
    setActiveUnitButton();

    if (currentLat !== null && currentLon !== null) {
      loadWeather(currentLat, currentLon);
    }
  }
});

fahrenheitBtn.addEventListener("click", () => {
  if (currentUnit !== "imperial") {
    currentUnit = "imperial";
    setActiveUnitButton();

    if (currentLat !== null && currentLon !== null) {
      loadWeather(currentLat, currentLon);
    }
  }
});

/* ---------------- INIT ---------------- */

showCurrentDate();
setActiveUnitButton();
document.body.classList.add("default-weather");
getUserLocation();