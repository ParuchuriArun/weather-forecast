let apiKey = "fa5d34bf7bac4fdfd7384a12417d93a1";

let searchinput = document.querySelector(".searchinput");
let cityBox = document.querySelector(".city-box");
let normalMessage = document.querySelector(".normal-message");
let errorMessage = document.querySelector(".error-message");
let addedMessage = document.querySelector(".added-message");
let section = document.querySelector(".add-section");
let navBtn = document.querySelector(".button");
let navIcon = document.querySelector(".btn-icon");

let isOpen = false;

// DATE
let date = new Date().getDate();
let months_name = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
let months = new Date().getMonth();
let year = new Date().getFullYear();

document.querySelector(".date").innerHTML = `${months_name[months]} ${date}, ${year}`;

// LOCAL STORAGE
function getSavedCities() {
  return JSON.parse(localStorage.getItem("cities")) || [];
}

function saveCities(cities) {
  localStorage.setItem("cities", JSON.stringify(cities));
}

// CREATE UNIQUE CITY ID
function createCityId(lat, lon) {
  return `${lat}_${lon}`;
}

// GET WEATHER ICON FROM OPENWEATHER
function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// RENDER WEATHER CARD
function renderCityCard(cityInfo, weatherData) {

  let weatherBox = document.createElement("div");
  weatherBox.className = "weather-box";
  weatherBox.dataset.id = cityInfo.id;

  let nameDiv = document.createElement("div");
  nameDiv.className = "name";

  let cityElement = document.createElement("div");
  cityElement.className = "city-name";
  cityElement.innerHTML = cityInfo.name;

  let tempElement = document.createElement("div");
  tempElement.className = "weather-temp";
  tempElement.innerHTML = Math.floor(weatherData.main.temp) + "°";

  let weatherIconDiv = document.createElement("div");
  weatherIconDiv.className = "weather-icon";

  let weatherImg = document.createElement("img");

  // DAY / NIGHT CHECK
  let iconCode = weatherData.weather[0].icon;
  let isNight = iconCode.includes("n");

  if (isNight) {
    weatherImg.src = "img/night.png";
  } else {
    weatherImg.src = getWeatherIconUrl(iconCode);
  }

  weatherImg.alt = weatherData.weather[0].description;

  let deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

  deleteBtn.addEventListener("click", function () {

    weatherBox.remove();

    let cities = getSavedCities();
    let updatedCities = cities.filter(city => city.id !== cityInfo.id);
    saveCities(updatedCities);

  });

  weatherIconDiv.appendChild(weatherImg);
  nameDiv.appendChild(cityElement);
  nameDiv.appendChild(tempElement);

  weatherBox.appendChild(deleteBtn);
  weatherBox.appendChild(nameDiv);
  weatherBox.appendChild(weatherIconDiv);

  cityBox.prepend(weatherBox);
}

// SEARCH CITY AND ADD
async function addCityBySearch(cityName) {

  try {

    let geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
    );

    let geoData = await geoResponse.json();

    if (geoData.length === 0) {
      return null;
    }

    let lat = geoData[0].lat;
    let lon = geoData[0].lon;

    let displayName = geoData[0].name;
    if (geoData[0].state) {
      displayName += ", " + geoData[0].state;
    }

    let cityId = createCityId(lat, lon);

    let savedCities = getSavedCities();

    let alreadySaved = savedCities.some(city => city.id === cityId);
    let alreadyRendered = document.querySelector(`.weather-box[data-id="${cityId}"]`);

    if (alreadySaved || alreadyRendered) {
      return { id: cityId, name: displayName, lat: lat, lon: lon };
    }

    let weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    let weatherData = await weatherResponse.json();

    let cityInfo = {
      id: cityId,
      name: displayName,
      lat: lat,
      lon: lon
    };

    renderCityCard(cityInfo, weatherData);

    savedCities.push(cityInfo);
    saveCities(savedCities);

    return cityInfo;

  } catch (error) {
    return null;
  }

}

// LOAD SAVED CITY
async function loadSavedCity(cityInfo) {

  try {

    let weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${cityInfo.lat}&lon=${cityInfo.lon}&units=metric&appid=${apiKey}`
    );

    let weatherData = await weatherResponse.json();

    if (!document.querySelector(`.weather-box[data-id="${cityInfo.id}"]`)) {
      renderCityCard(cityInfo, weatherData);
    }

  } catch (error) {
    console.log("Error loading saved city:", error);
  }

}

// ADD CITY ON ENTER
searchinput.addEventListener("keydown", async function (event) {

  if (event.key === "Enter") {

    let cityName = searchinput.value.trim();

    if (cityName === "") return;

    let result = await addCityBySearch(cityName);

    if (result) {

      normalMessage.style.display = "none";
      errorMessage.style.display = "none";
      addedMessage.style.display = "block";

      setTimeout(() => {

        section.style.top = "-60rem";
        navIcon.className = "fa-solid fa-circle-plus btn-icon";
        isOpen = false;

        normalMessage.style.display = "block";
        errorMessage.style.display = "none";
        addedMessage.style.display = "none";

      }, 500);

    } else {

      normalMessage.style.display = "none";
      errorMessage.style.display = "block";
      addedMessage.style.display = "none";

    }

    searchinput.value = "";

  }

});

// LOAD SAVED CITIES ON PAGE LOAD
window.addEventListener("load", function () {

  let cities = getSavedCities();

  cities.forEach(cityInfo => {
    loadSavedCity(cityInfo);
  });

});

// TOGGLE BUTTON
navBtn.addEventListener("click", () => {

  if (!isOpen) {

    section.style.top = "120px";
    navIcon.className = "fa-solid fa-circle-xmark btn-icon";
    isOpen = true;

  } else {

    section.style.top = "-60rem";
    navIcon.className = "fa-solid fa-circle-plus btn-icon";
    isOpen = false;

  }

});