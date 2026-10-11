
const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const message = document.getElementById("message");

const weatherCodes = {
  0: ["Clear sky", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],
  48: ["Fog", "🌫️"],
  51: ["Light drizzle", "🌦️"],
  53: ["Moderate drizzle", "🌦️"],
  55: ["Heavy drizzle", "🌧️"],
  56: ["Freezing drizzle", "🌧️"],
  57: ["Freezing drizzle", "🌧️"],
  61: ["Slight rain", "🌦️"],
  63: ["Moderate rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],
  66: ["Freezing rain", "🌧️"],
  67: ["Freezing rain", "🌧️"],
  71: ["Slight snowfall", "🌨️"],
  73: ["Moderate snowfall", "🌨️"],
  75: ["Heavy snowfall", "❄️"],
  77: ["Snow grains", "🌨️"],
  80: ["Rain showers", "🌦️"],
  81: ["Moderate rain showers", "🌧️"],
  82: ["Heavy rain showers", "⛈️"],
  85: ["Snow showers", "🌨️"],
  86: ["Heavy snow showers", "❄️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm with hail", "⛈️"],
  99: ["Thunderstorm with heavy hail", "⛈️"]
};

async function getWeather(city) {
  searchButton.disabled = true;
  searchButton.textContent = "Searching...";
  message.textContent = "Getting weather information...";

  try {
    // Find the city using the geocoding API.
    const geoUrl =
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(city) +
      "&count=1&language=en&format=json";

    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error("Could not search for the city. Try again.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found. Check the spelling.");
    }

    const place = geoData.results[0];

    // Retrieve weather data using the city's coordinates.
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}` +
      `&longitude=${place.longitude}` +
      "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m" +
      "&timezone=auto";

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Could not retrieve weather data. Try again.");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    if (!current) {
      throw new Error("Weather information is currently unavailable.");
    }

    const [description, icon] =
      weatherCodes[current.weather_code] ||
      ["Weather information available", "🌡️"];

    document.getElementById("city-name").textContent = place.name;

    document.getElementById("country-name").textContent =
      [place.admin1, place.country].filter(Boolean).join(", ");

    document.getElementById("weather-icon").textContent =
      current.is_day === 0 && current.weather_code === 0 ? "🌙" : icon;

    document.getElementById("temperature").textContent =
      Math.round(current.temperature_2m);

    document.getElementById("weather-description").textContent =
      description;

    document.getElementById("feels-like").textContent =
      `${Math.round(current.apparent_temperature)} °C`;

    document.getElementById("humidity").textContent =
      `${current.relative_humidity_2m} %`;

    document.getElementById("wind-speed").textContent =
      `${current.wind_speed_10m} km/h`;

    document.getElementById("updated-time").textContent =
      `Observation time: ${current.time.replace("T", " ")} (local time)`;

    message.textContent = "Weather information loaded successfully.";
  } catch (error) {
    message.textContent =
      error.message || "Something went wrong. Check your internet connection.";
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = "Search";
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (city) {
    getWeather(city);
  }
});

// Show Bengaluru weather when the website first opens.
getWeather("Bengaluru");
