const API_BASE = "https://api.openweathermap.org/data/2.5";
const $ = (id) => document.getElementById(id);
const form = $("search-form");
const cityInput = $("city-input");
const statusBox = $("status");
const weatherContent = $("weather-content");
const settingsPanel = $("settings-panel");
let apiKey = localStorage.getItem("atmos_openweather_key") || "";

function setStatus(message, type = "info", icon = "☀") {
  statusBox.className = `status ${type}`;
  statusBox.innerHTML = `<span class="status-icon">${icon}</span><span>${message}</span>`;
}
function showLoading() {
  statusBox.className = "status";
  statusBox.innerHTML = '<span class="status-icon">◌</span><span>Gathering weather signals…</span>';
  $("search-button").disabled = true;
  $("search-button").textContent = "Loading…";
}
function finishLoading() {
  $("search-button").disabled = false;
  $("search-button").innerHTML = 'Explore <span>↗</span>';
}
function weatherEmoji(main, iconCode = "") {
  const group = (main || "").toLowerCase();
  if (iconCode.endsWith("n")) return "🌙";
  if (group.includes("thunder")) return "⛈️";
  if (group.includes("drizzle") || group.includes("rain")) return "🌧️";
  if (group.includes("snow")) return "❄️";
  if (group.includes("cloud")) return "☁️";
  if (group.includes("mist") || group.includes("fog") || group.includes("haze")) return "🌫️";
  return "☀️";
}
function setTheme(main, iconCode = "") {
  document.body.classList.remove("theme-clear", "theme-rain", "theme-clouds", "theme-night", "theme-snow");
  const group = (main || "").toLowerCase();
  let theme = "theme-clear";
  if (iconCode.endsWith("n")) theme = "theme-night";
  else if (group.includes("rain") || group.includes("drizzle") || group.includes("thunder")) theme = "theme-rain";
  else if (group.includes("cloud") || group.includes("mist") || group.includes("fog") || group.includes("haze")) theme = "theme-clouds";
  else if (group.includes("snow")) theme = "theme-snow";
  document.body.classList.add(theme);
}
function formatClock(unix, timezone) {
  return new Intl.DateTimeFormat(undefined, {hour:"2-digit",minute:"2-digit",timeZone:"UTC"}).format(new Date((unix + timezone) * 1000));
}
function dayName(dateString, index) {
  if (index === 0) return "Today";
  return new Intl.DateTimeFormat(undefined, {weekday:"short"}).format(new Date(`${dateString}T12:00:00`));
}
async function getJSON(url) {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 404) throw new Error("We couldn't find that city. Check the spelling and try again.");
    if (response.status === 401) throw new Error("Your API key is invalid or not active yet. Check your key in settings.");
    if (response.status === 429) throw new Error("The weather service is receiving too many requests. Please try again shortly.");
    throw new Error(data.message || "Weather service is temporarily unavailable. Please try again.");
  }
  return data;
}
function renderForecast(items) {
  const byDay = {};
  items.forEach(item => {
    const date = item.dt_txt.split(" ")[0];
    (byDay[date] ||= []).push(item);
  });
  const days = Object.entries(byDay).slice(0, 5);
  $("forecast-grid").innerHTML = days.map(([date, entries], index) => {
    const midday = entries.find(x => x.dt_txt.includes("12:00:00")) || entries[Math.floor(entries.length / 2)];
    const temps = entries.map(x => x.main.temp);
    const low = Math.round(Math.min(...temps));
    const high = Math.round(Math.max(...temps));
    const main = midday.weather[0].main;
    return `<article class="forecast-card">
      <div class="forecast-day">${dayName(date,index)}</div>
      <div class="forecast-icon">${weatherEmoji(main, midday.weather[0].icon)}</div>
      <div class="forecast-desc">${midday.weather[0].description}</div>
      <div class="forecast-temps"><span>${high}°</span><span>${low}°</span></div>
    </article>`;
  }).join("");
}
function renderCurrent(data) {
  const weather = data.weather[0];
  setTheme(weather.main, weather.icon);
  $("city-name").textContent = `${data.name}, ${data.sys.country || ""}`;
  $("date-line").textContent = new Intl.DateTimeFormat(undefined,{weekday:"long",month:"long",day:"numeric"}).format(new Date());
  $("condition-text").textContent = weather.main;
  $("description").textContent = weather.description;
  $("main-icon").textContent = weatherEmoji(weather.main, weather.icon);
  $("temperature").textContent = Math.round(data.main.temp);
  $("feels-like").textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
  $("temp-range").textContent = `High ${Math.round(data.main.temp_max)}° · Low ${Math.round(data.main.temp_min)}°`;
  $("humidity").innerHTML = `${data.main.humidity}<small>%</small>`;
  $("humidity-bar").style.width = `${data.main.humidity}%`;
  $("wind").innerHTML = `${Number(data.wind.speed).toFixed(1)}<small> m/s</small>`;
  const direction = data.wind.deg == null ? "" : `Wind direction · ${data.wind.deg}°`;
  $("wind-direction").textContent = direction || "Air movement";
  $("pressure").innerHTML = `${data.main.pressure}<small> hPa</small>`;
  $("visibility").innerHTML = `${data.visibility == null ? "—" : (data.visibility/1000).toFixed(1)}<small> km</small>`;
  $("updated-at").textContent = `Updated ${new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`;
  $("sun-times").textContent = `Sunrise ${formatClock(data.sys.sunrise,data.timezone)} · Sunset ${formatClock(data.sys.sunset,data.timezone)}`;
  $("weather-content").classList.remove("hidden");
}
async function searchCity(city) {
  if (!apiKey) {
    settingsPanel.classList.remove("hidden");
    setStatus("Add your OpenWeatherMap API key in settings to start live weather search.", "error", "⚙");
    return;
  }
  if (!city.trim()) { setStatus("Please enter a city name to search.", "error", "ⓘ"); return; }
  showLoading();
  weatherContent.classList.add("hidden");
  try {
    const q = encodeURIComponent(city.trim());
    const [current, forecast] = await Promise.all([
      getJSON(`${API_BASE}/weather?q=${q}&appid=${encodeURIComponent(apiKey)}&units=metric`),
      getJSON(`${API_BASE}/forecast?q=${q}&appid=${encodeURIComponent(apiKey)}&units=metric`)
    ]);
    renderCurrent(current);
    renderForecast(forecast.list);
    setStatus(`Weather loaded for ${current.name}.`, "success", "✓");
    cityInput.value = current.name;
  } catch (error) {
    setStatus(error.message || "Something went wrong. Please try again.", "error", "!");
  } finally { finishLoading(); }
}
form.addEventListener("submit", event => { event.preventDefault(); searchCity(cityInput.value); });
$("settings-toggle").addEventListener("click", () => settingsPanel.classList.toggle("hidden"));
$("close-settings").addEventListener("click", () => settingsPanel.classList.add("hidden"));
$("key-form").addEventListener("submit", event => {
  event.preventDefault();
  const value = $("api-key").value.trim();
  if (!value) { setStatus("Paste an API key before saving.", "error", "!"); return; }
  apiKey = value;
  localStorage.setItem("atmos_openweather_key", apiKey);
  $("api-key").value = "";
  settingsPanel.classList.add("hidden");
  setStatus("API key saved in this browser. Search for a city to begin.", "success", "✓");
  if (cityInput.value.trim()) searchCity(cityInput.value);
});
$("remove-key").addEventListener("click", () => {
  localStorage.removeItem("atmos_openweather_key");
  apiKey = "";
  $("api-key").value = "";
  setStatus("Saved API key removed from this browser.", "info", "ⓘ");
});
function updateClock() {
  $("local-time").textContent = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
}
updateClock();
setInterval(updateClock, 30000);
if (!apiKey) {
  settingsPanel.classList.remove("hidden");
  setStatus("Welcome to Atmos. Add your free API key to view live weather.", "info", "✳");
} else {
  setStatus("API key detected. Search for a city to view live weather.", "success", "✓");
  cityInput.value = "Bengaluru";
}
