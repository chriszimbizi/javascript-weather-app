// API key and URL
import apiKey from "./config.mjs";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";

// DOM elements
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const weatherIcon = document.querySelector(".weather-icon");

// Fetch weather data based on the provided city name
async function getWeather(city) {
  // Construct the API endpoint URL with the city name and API key
  const apiEndpoint = `${apiUrl}q=${city}&appid=${apiKey}`;

  // Send a request to the API endpoint and wait for the response
  const response = await fetch(apiEndpoint);

  // Check the response status
  if (response.status === 404) {
    // City not found: Display error message and hide weather information
    document.querySelector(".error-404").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    // Parse the response data as JSON
    const data = await response.json();

    // Update weather values with the retrieved data
    updateWeatherData(data);
  }
}

// Update weather information on the page
function updateWeatherData(data) {
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".description").innerHTML =
    data.weather[0].description;
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

  // Update weather icon based on weather conditions
  switch (data.weather[0].main) {
    case "Clouds":
      weatherIcon.src = "images/clouds.png";
      weatherIcon.alt = "Clouds";
      break;

    case "Clear":
      weatherIcon.src = "images/clear.png";
      weatherIcon.alt = "Clear Sky";
      break;

    case "Drizzle":
      weatherIcon.src = "images/drizzle.png";
      weatherIcon.alt = "Drizzle";

      break;

    case "Mist":
      weatherIcon.src = "images/mist.png";
      weatherIcon.alt = "Mist";
      break;

    case "Rain":
      weatherIcon.src = "images/rain.png";
      weatherIcon.alt = "Rain";
      break;

    case "Snow":
      weatherIcon.src = "images/snow.png";
      weatherIcon.alt = "Snow";
      break;

    default:
      weatherIcon.src = "";
  }

  // Show weather information and hide 404 error message
  document.querySelector(".error-404").style.display = "none";
  document.querySelector(".weather").style.display = "flex";
}

// Fetch weather data for the corresponding location
async function getWeatherByGeolocation(latitude, longitude) {
  // Construct the API endpoint URL with latitude, longitude, and API key
  const apiEndpoint = `${apiUrl}lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  // Send a GET request to the API endpoint and wait for the response
  const response = await fetch(apiEndpoint);

  // Check the response status code
  if (response.status === 404) {
    // City not found
    document.querySelector(".error-404").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    // Parse the response data as JSON
    const data = await response.json();

    // Update the weather information on the page
    updateWeatherData(data);
  }
}

// Event handler for the "Get Weather by Location" button
function handleLocationClick() {
  if (navigator.geolocation) {
    // Check if geolocation is supported by the browser
    navigator.geolocation.getCurrentPosition(
      // If supported, get the current position
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Call the function to fetch weather data based on the obtained coordinates
        getWeatherByGeolocation(latitude, longitude);
      },
      // If there is an error in getting the position
      (error) => {
        // Handle geolocation error
        console.error(error);
      }
    );
  } else {
    // Geolocation is not supported
    // Handle the error or show a message to the user
    console.error("Geolocation is not supported by your browser");
  }
}

// Event listener for search button click
searchBtn.addEventListener("click", () => {
  // Call getWeather function with the value from search input
  getWeather(searchBox.value);
});

// Event listener for enter key press on search input
searchBox.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    // Call getWeather function with the value from search input
    getWeather(searchBox.value);
  }
});

// Event listener for location button click
locationBtn.addEventListener("click", handleLocationClick);
