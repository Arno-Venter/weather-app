let lat;
let lon;

function setLat(latitude) {
  lat = latitude;
}

function findState() {
  // const success = (position) => {
  //   lat = position.coords.latitude;
  //   lon = position.coords.longitude;
  //   console.log(lat);
  // };

  // const error = (position) => {
  //   alert("You need to allow location access!");
  // };

  // navigator.geolocation.getCurrentPosition(success, error);

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      reject
    );
  });
}

function mapWeatherCode(code) {
  switch (code) {
    case 0:
    case 1:
    case 2:
      return "icons/sun.svg";
      break;
    case 3:
    case 45:
    case 48:
      return "icons/cloud.svg";
      break;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 71:
    case 73:
    case 75:
    case 77:
    case 80:
    case 81:
    case 82:
    case 85:
    case 86:
    case 95:
    case 96:
    case 99:
      return "icons/rain.svg";
      break;
  }
}

function parseWeather(weather, day) {
  let precip_sum = 0;
  for (
    let i = 0;
    weather.hourly.precipitation.length < 24;
    i++
  )
    precip_sum += weather.hourly.precipitation[i];

  let weatherIcon = mapWeatherCode(
    weather.current_weather.weathercode
  );

  return {
    temp_current: weather.current_weather.temperature,
    temp_high: weather.daily.temperature_2m_max[day],
    temp_low: weather.daily.temperature_2m_min[day],
    fl_low: weather.daily.apparent_temperature_min[day],
    fl_high: weather.daily.apparent_temperature_max[day],
    wind: weather.current_weather.windspeed,
    precip: weather.daily.precipitation_probability_max[0],
    icon: weatherIcon,
  };
}

function parseDailyWeather(weather) {
  let codes = [];
  for (let i = 0; i < weather.daily.weathercode.length; i++)
    codes[i] = weather.daily.weathercode[i];

  return {
    fl_max: weather.daily.apparent_temperature_max,
    fl_min: weather.daily.apparent_temperature_min,
    precip: weather.daily.precipitation_probability_max,
    temp_max: weather.daily.temperature_2m_max,
    temp_min: weather.daily.temperature_2m_min,
    icons: codes,
    date: weather.daily.time,
  };
}

function setDailyWeather(weather) {
  for (let i = 0; i < 7; i++) {
    let date = document.querySelector(
      `[data-day${i}-date]`
    );
    let icon = document.querySelector(
      `[data-day${i}-icon]`
    );
    let max = document.querySelector(`[data-day${i}-max]`);
    let min = document.querySelector(`[data-day${i}-min]`);
    let precip = document.querySelector(
      `[data-day${i}-precip]`
    );

    date.textContent = weather.date[i];
    icon.src = mapWeatherCode(weather.icons[i]);
    max.textContent = weather.temp_max[i];
    min.textContent = weather.temp_min[i];
    precip.textContent = weather.precip[i];
  }
}

async function getWeather() {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max&current_weather=true&forecast_days=7&timezone=auto`
  );
  const jsonData = await response.json();
  console.log(jsonData);
  return jsonData;
}

function setQuickWeather(weather) {
  let icon = document.querySelector("[data-current-icon]");
  if (weather.icon == "icons/sun.svg")
    icon.classList.add("icon-sun-turn");
  else icon.classList.add("icon-rain-updown");
  icon.src = weather.icon;

  let currentTemp = document.querySelector(
    "[data-current-temp]"
  );
  currentTemp.textContent = weather.temp_current;

  let high = document.querySelector("[data-current-high]");
  high.textContent = weather.temp_high;

  let low = document.querySelector("[data-current-low]");
  low.textContent = weather.temp_low;

  let fl_high = document.querySelector(
    "[data-current-fl-high]"
  );
  fl_high.textContent = weather.fl_high;

  let fl_low = document.querySelector(
    "[data-current-fl-low]"
  );
  fl_low.textContent = weather.fl_low;

  let wind = document.querySelector("[data-current-wind]");
  wind.textContent = weather.wind;

  let precip = document.querySelector(
    "[data-current-precip]"
  );
  precip.textContent = weather.precip;
}

findState()
  .then((geo) => {
    lat = geo.coords.latitude;
    lon = geo.coords.longitude;
  })
  .then(async () => {
    let weather = await getWeather();
    let currentWeatherData = parseWeather(weather, 0);
    setQuickWeather(currentWeatherData);
    let dailyWeatherData = parseDailyWeather(weather);
    setDailyWeather(dailyWeatherData);
  });
