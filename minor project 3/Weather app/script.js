// Open-Meteo APIs — no API key required
const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";


const WEATHER_CODES = {
  0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"], 45: ["Fog", "🌫️"], 48: ["Depositing rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌦️"], 55: ["Dense drizzle", "🌧️"],
  61: ["Slight rain", "🌧️"], 63: ["Rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
  71: ["Slight snow", "🌨️"], 73: ["Snow", "🌨️"], 75: ["Heavy snow", "❄️"],
  80: ["Rain showers", "🌦️"], 81: ["Rain showers", "🌧️"], 82: ["Violent showers", "⛈️"],
  95: ["Thunderstorm", "⛈️"], 96: ["Thunderstorm w/ hail", "⛈️"], 99: ["Severe thunderstorm", "⛈️"]
};

const form = document.getElementById("searchForm");
const input = document.getElementById("cityInput");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("errorMsg");
const card = document.getElementById("weatherCard");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) return;
  await getWeather(city);
});

async function getWeather(city) {
  showLoading();
  try {
   
    const geoRes = await fetch(`${GEOCODE_URL}?name=${encodeURIComponent(city)}&count=1`);
    if (!geoRes.ok) throw new Error("Geocoding request failed");
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${city}" not found. Please check the spelling.`);
    }

    const { latitude, longitude, name, country } = geoData.results[0];

   
    const params = new URLSearchParams({
      latitude,
      longitude,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code",
      timezone: "auto"
    });

    const weatherRes = await fetch(`${WEATHER_URL}?${params}`);
    if (!weatherRes.ok) throw new Error("Weather request failed");
    const weatherData = await weatherRes.json();

    renderWeather({ name, country, ...weatherData.current });
  } catch (err) {
    showError(err.message || "Something went wrong. Please try again.");
  }
}

function renderWeather({ name, country, temperature_2m, relative_humidity_2m, apparent_temperature, wind_speed_10m, weather_code, time }) {
  const [conditionText, icon] = WEATHER_CODES[weather_code] || ["Unknown", "❓"];

  document.getElementById("cityName").textContent = `${name}, ${country}`;
  document.getElementById("dateTime").textContent = new Date(time).toLocaleString();
  document.getElementById("temperature").textContent = `${Math.round(temperature_2m)}°C`;
  document.getElementById("weatherIcon").textContent = icon;
  document.getElementById("condition").textContent = conditionText;
  document.getElementById("humidity").textContent = `${relative_humidity_2m}%`;
  document.getElementById("wind").textContent = `${wind_speed_10m} km/h`;
  document.getElementById("feelsLike").textContent = `${Math.round(apparent_temperature)}°C`;

  loading.classList.add("hidden");
  errorMsg.classList.add("hidden");
  card.classList.remove("hidden");
}

function showLoading() {
  loading.classList.remove("hidden");
  errorMsg.classList.add("hidden");
  card.classList.add("hidden");
}

function showError(message) {
  loading.classList.add("hidden");
  card.classList.add("hidden");
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
}