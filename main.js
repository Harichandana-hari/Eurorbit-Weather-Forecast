
const select = document.getElementById("city-select");
const loader = document.getElementById("loader");
const weatherContainer = document.getElementById("weatherCardsContainer");
const url ="https://www.7timer.info/doc.php?lang=en#civil";


const weatherCodes = {
    clear: "Clear sky",
    pcloudy: "Partly cloudy",
    mcloudy: "Mostly cloudy",
    cloudy: "Cloudy",
    fog: "Foggy",
    lightrain: "Light rain",
    rain: "Rain",
    oshower: "Occasional showers",
    ishower: "Isolated showers",
    ts: "Thunderstorm",
    tsrain: "Thunderstorm with rain",
    snow: "Snow",
    lightsnow: "Light Snow"
};

// const weatherIcons = {
//     clear: "https://openweathermap.org/img/wn/01d@2x.png", // Clear sky
//     pcloudy: "https://openweathermap.org/img/wn/02d@2x.png", // Partly cloudy
//     mcloudy: "https://openweathermap.org/img/wn/03d@2x.png", // Mostly cloudy
//     cloudy: "https://openweathermap.org/img/wn/04d@2x.png", // Cloudy
//     fog: "https://openweathermap.org/img/wn/50d@2x.png", // Fog
//     lightrain: "https://openweathermap.org/img/wn/10d@2x.png", // Light rain
//     rain: "https://openweathermap.org/img/wn/09d@2x.png", // Rain
//     oshower: "https://openweathermap.org/img/wn/09d@2x.png", // Occasional showers
//     ishower: "https://openweathermap.org/img/wn/09d@2x.png", // Isolated showers
//     ts: "https://openweathermap.org/img/wn/11d@2x.png", // Thunderstorm
//     tsrain: "https://openweathermap.org/img/wn/11d@2x.png", // Thunderstorm with rain
//     snow: "https://openweathermap.org/img/wn/13d@2x.png" // Snow
// };

const weatherIcons = {
    clear: "wi-day-sunny", // Clear sky
    pcloudy: "wi-day-cloudy", // Partly cloudy
    mcloudy: "wi-cloud", // Mostly cloudy
    cloudy: "wi-cloudy", // Cloudy
    fog: "wi-fog", // Fog
    lightrain: "wi-day-rain", // Light rain
    rain: "wi-rain", // Rain
    oshower: "wi-showers", // Occasional showers
    ishower: "wi-day-showers", // Isolated showers
    ts: "wi-thunderstorm", // Thunderstorm
    tsrain: "wi-storm-showers", // Thunderstorm with rain
    snow: "wi-snow", // Snow
    lightsnow: "wi-day-snow"

};


const getWeatherCondition = (weather) => weatherCodes[weather] || "Unknown weather condition";

function formatDate(date){
    
    // const year = parseInt(dateString.substring(0, 4), 10);
    // const month = parseInt(dateString.substring(4, 6), 10);
    // const day = parseInt(dateString.substring(6, 8), 10);

    const year = Math.floor(date / 10000);
    const month = Math.floor((date % 10000) / 100) - 1;
    const day = date % 100;

    const dateObj = new Date(year, month, day);
    const options={
        year: "numeric",
        month: "long",
        day: "numeric"
    }
  
    //console.log(dateObj.toLocaleDateString("en-GB", options));
    return dateObj.toLocaleDateString("en-GB", options);
}

//<img src=${weatherIconURL} alt=${weatherCondition} class="weather-icon" />

function displayWeatherCards(data){
    weatherContainer.innerHTML = '';

    data.dataseries.forEach( entry => {
        const {date, weather, temp2m: { max, min} } = entry;
        const formattedDate = formatDate(date);
        const weatherCondition = getWeatherCondition(weather);
        const weatherIconCode = weatherIcons[weather] || weatherIcons.clear;
        //console.log(`Date: ${formattedDate},  weather: ${weatherCondition},  Maxtemp: ${max},  Mintemp: ${min}`);

        const card = document.createElement("div");
        card.classList.add("weather-card");

        card.innerHTML = `
            <h3>${formattedDate}</h3>
            <i class="wi ${weatherIconCode} weather-icon" ></i>
            
            <p class="weather-text"><strong>${weatherCondition}</strong><p>
            <p>High: ${max} °C</p>
            <p>Low: ${min} °C</p>
        `;

        weatherContainer.appendChild(card);

    })
}

function fetchWeather(lat, lon) {
    loader.style.display = "block";
    const url = `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civillight&output=json`;

    fetch(url).then(response => {
        if (!response.ok){
            throw new Error(`HTTP error status: ${response.status}`);
        }
        loader.style.display = "none";
        return response.json();
    })
    .then(data => {
        console.log(data);
        displayWeatherCards(data);
    })
    
} 


select.addEventListener('change', function () {
    weatherContainer.innerHTML = '';
    const selectedValue = this.value;
    if (selectedValue){
        const [lat, lon] = selectedValue.split(',');
        fetchWeather(lat, lon);
    }
})

async function loadCities(){
    try {
        const response = await fetch('city_coordinates.csv');
        console.log("Response received:", response);
        const data = await response.text();
        if (data != ""){
            console.log("csv located");
        }
        const rows = data.split('\n').slice(1)

        rows.forEach(row => {
            const [lat,lon,city,country] = row.split(',');

            if(city && country) {
                const option = document.createElement('option');
                option.value = `${lat},${lon}`;
                option.textContent = `${city}, ${country}`;
                select.appendChild(option);
            }
        })

    }
    catch(error){
        console.error("error loading cities", error);
    }
}

window.onload = loadCities;