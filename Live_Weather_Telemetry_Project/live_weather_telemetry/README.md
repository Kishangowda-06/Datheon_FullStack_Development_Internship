# Atmos — Live Weather Telemetry Dashboard

A responsive weather dashboard built with HTML, CSS, vanilla JavaScript, Fetch API, and OpenWeatherMap.

## Features
- Global city search
- Current temperature, conditions, humidity, wind speed, pressure, visibility
- Five-day forecast derived from OpenWeatherMap's 3-hour forecast data
- Dynamic weather icons and weather-dependent page themes
- Loading, invalid-city, API-key, rate-limit, and network error handling
- Mobile-responsive layout
- API key saved in browser localStorage

## Requirements
- A modern browser
- Internet connection
- Free OpenWeatherMap API key

## Get an API key
1. Visit https://openweathermap.org/api
2. Create a free account and generate an API key.
3. A newly created key may take some time to activate.
4. Open the application and click the gear icon if settings are closed.
5. Paste the key into the API configuration field and save it.

The app calls:
- `https://api.openweathermap.org/data/2.5/weather` for current conditions
- `https://api.openweathermap.org/data/2.5/forecast` for the five-day forecast

## Run the project
### Option A — VS Code Live Server
1. Extract the ZIP.
2. Open the `live_weather_telemetry` folder in VS Code.
3. Install the **Live Server** extension if it is not already installed.
4. Right-click `index.html` and choose **Open with Live Server**.

### Option B — Python local server
Open a terminal in this folder and run:

```bash
python -m http.server 5500
```

Then visit `http://localhost:5500`.

On Windows, if `python` is not recognized, try `py -m http.server 5500`.

## Project structure
```
live_weather_telemetry/
├── index.html   # Page structure and dashboard components
├── style.css    # Responsive layout, cards, gradients, themes
├── app.js       # API requests, rendering, validation and errors
└── README.md    # Setup and project documentation
```

## How it works
1. The user enters a city and submits the search form.
2. JavaScript validates the city and checks that an API key is available.
3. `Promise.all()` requests current conditions and forecast data in parallel.
4. `fetch()` retrieves JSON; non-success HTTP responses are converted into readable errors.
5. The current weather metrics are inserted into the dashboard.
6. Forecast entries are grouped by calendar date and summarized into daily high/low temperatures.
7. Weather conditions select a matching emoji and CSS background theme.

## Notes about API keys
This is a front-end learning project. The key is stored in the browser's localStorage and sent to OpenWeatherMap from the browser. Do not use this architecture for a public production service with a private or paid key. A production deployment should proxy requests through a backend and keep the API key in a server-side environment variable.

## Troubleshooting
- **401 / invalid key:** check that the key was copied correctly and is active.
- **404 / city not found:** check spelling; try adding a country name, e.g. `Paris, FR`.
- **429 / too many requests:** wait and retry.
- **No data / network error:** check internet access and browser console.
- **CORS or file loading issues:** run through Live Server or the Python local server rather than opening the HTML as a `file://` URL.
