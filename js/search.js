// let apiKey = "fa5d34bf7bac4fdfd7384a12417d93a1";
// let searchinput = document.querySelector(`.searchinput`);

// async function search(city, state, country){
//     let url = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city},${state},${country}&appid=${apiKey}`);

//     if(url.ok){
//     let data = await url.json();
//     console.log(data);
    
//     let box = document.querySelector(".return");
//     box.style.display = "block";

//     let message = document.querySelector(".message");
//     message.style.display = "none";

//     let errormessage = document.querySelector( ".error-message");
//         errormessage.style.display = "none";

//     let weatherImg = document.querySelector(".weather-img");
//     document.querySelector(".city-name").innerHTML = data.name;
//     document.querySelector(".weather-temp").innerHTML = Math.floor(data.main.temp) + '°';
//     document.querySelector(".wind").innerHTML = Math.floor(data.wind.speed) + " m/s";
//     document.querySelector(".pressure").innerHTML = Math.floor(data.main.pressure) + " hPa";
//     document.querySelector('.humidity').innerHTML = Math.floor(data.main.humidity)+ "%";
//     document.querySelector(".sunrise").innerHTML =  new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
//     document.querySelector(".sunset").innerHTML =  new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});

//     if (data.weather[0].main === "Rain") {
//         weatherImg.src = "img/rain.png";
//       } else if (data.weather[0].main === "Clear") {
//         weatherImg.src = "img/sun.png";
//       } else if (data.weather[0].main === "Snow") {
//         weatherImg.src = "img/snow.png";
//       } else if (
//         data.weather[0].main === "Clouds" ||
//         data.weather[0].main === "Smoke"
//       ) {
//         weatherImg.src = "img/cloud.png";
//       } else if (
//         data.weather[0].main === "Mist" ||
//         data.weather[0].main === "Fog"
//       ) {
//         weatherImg.src = "img/mist.png";
//       } else if (data.weather[0].main === "Haze") {
//         weatherImg.src = "img/haze.png";
//       } else if (data.weather[0].main === "Thunderstorm") {
//         weatherImg.src = "img/thunderstorm.png";
//       }
//     } else {
//       let box = document.querySelector(".return");
//       box.style.display = "none";

//       let message = document.querySelector(".message");
//       message.style.display = "none";

//       let errormessage = document.querySelector(".error-message");
//       errormessage.style.display = "block";
//     }
// }


// searchinput.addEventListener('keydown', function(event) {
//     if (event.keyCode === 13 || event.which === 13) {
//         search(searchinput.value);
//         console.log("worked")
//       }
//   });


let apiKey = "fa5d34bf7bac4fdfd7384a12417d93a1";
let searchinput = document.querySelector(".searchinput");

// Convert sunrise/sunset using correct timezone
function formatLocalTime(unixTime, timezoneOffset) {

    let localTime = new Date((unixTime + timezoneOffset) * 1000);

    let hours = localTime.getUTCHours();
    let minutes = localTime.getUTCMinutes();

    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    minutes = minutes.toString().padStart(2,"0");

    return `${hours}:${minutes} ${ampm}`;
}


// Weather image selector
function getWeatherImage(condition){

    if(condition === "Rain" || condition === "Drizzle"){
        return "img/rain.png";
    }

    else if(condition === "Clear"){
        return "img/sun.png";
    }

    else if(condition === "Snow"){
        return "img/snow.png";
    }

    else if(condition === "Clouds"){
        return "img/cloud.png";
    }

    else if(condition === "Mist" || condition === "Fog"){
        return "img/mist.png";
    }

    else if(condition === "Haze"){
        return "img/haze.png";
    }

    else if(condition === "Thunderstorm"){
        return "img/thunderstorm.png";
    }

    else{
        return "img/cloud.png";
    }
}


async function search(place){

    let box = document.querySelector(".return");
    let message = document.querySelector(".message");
    let errormessage = document.querySelector(".error-message");

    try{

        if(place.trim() === ""){
            box.style.display = "none";
            message.style.display = "block";
            errormessage.style.display = "none";
            return;
        }

        // STEP 1: Get location coordinates from geocoding API
        let geoResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(place)}&limit=5&appid=${apiKey}`
        );

        let geoData = await geoResponse.json();

        if(!geoData || geoData.length === 0){

            box.style.display = "none";
            message.style.display = "none";
            errormessage.style.display = "block";
            return;
        }

        // pick best result
        let location = geoData[0];

        let lat = location.lat;
        let lon = location.lon;


        // STEP 2: Fetch weather using lat/lon
        let weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );

        let data = await weatherResponse.json();

        console.log(data);

        box.style.display = "block";
        message.style.display = "none";
        errormessage.style.display = "none";

        let weatherImg = document.querySelector(".weather-img");


        // Location name display
        let displayName = location.name;

        if(location.state){
            displayName += `, ${location.state}`;
        }

        if(location.country){
            displayName += `, ${location.country}`;
        }

        document.querySelector(".city-name").innerHTML = displayName;

        document.querySelector(".weather-temp").innerHTML =
        Math.floor(data.main.temp) + "°";

        document.querySelector(".wind").innerHTML =
        Math.floor(data.wind.speed) + " m/s";

        document.querySelector(".pressure").innerHTML =
        Math.floor(data.main.pressure) + " hPa";

        document.querySelector(".humidity").innerHTML =
        Math.floor(data.main.humidity) + "%";


        // Correct timezone sunrise/sunset
        document.querySelector(".sunrise").innerHTML =
        formatLocalTime(data.sys.sunrise, data.timezone);

        document.querySelector(".sunset").innerHTML =
        formatLocalTime(data.sys.sunset, data.timezone);


        // Weather image
        weatherImg.src = getWeatherImage(data.weather[0].main);

    }

    catch(error){

        console.error(error);

        let box = document.querySelector(".return");
        box.style.display = "none";

        let message = document.querySelector(".message");
        message.style.display = "none";

        let errormessage = document.querySelector(".error-message");
        errormessage.style.display = "block";
    }
}


// Enter key search
searchinput.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        search(searchinput.value);

        console.log("worked");
    }

});