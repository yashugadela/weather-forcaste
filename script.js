let apiKey = "4bcf1aa9fc31849c3f11bccb9df8b631";
let unit = "metric";

function getWeather(cityFromInput = null, lat = null, lon = null) {
  let city = cityFromInput || document.getElementById("cityInput").value.trim();
  if (!city && !lat) return;

  let currentURL = lat
    ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
    : `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  fetch(currentURL)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        alert("City not found!");
        return;
      }

      let date = new Date().toISOString().split("T")[0];
      let name = `<strong>${data.name}</strong> (${date})`;
      let temp = `Temperature: ${data.main.temp} °C`;
      let wind = `Wind: ${data.wind.speed} M/S`;
      let humidity = `Humidity: ${data.main.humidity}%`;

      let icon = getWeatherIcon(data.weather[0].main);

      document.getElementById("currentWeather").innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <p>${name}</p>
            <p>${temp}</p>
            <p>${wind}</p>
            <p>${humidity}</p>
          </div>
          <div>${icon}</div>
        </div>
      `;

      document.getElementById("currentWeather").style.display = "block";
      document.getElementById("forecastTitle").style.display = "block";
      document.getElementById("forecast").style.display = "grid";

      getForecast(data.coord.lat, data.coord.lon);
    });
}

function getForecast(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      let forecastDiv = document.getElementById("forecast");
      forecastDiv.innerHTML = "";

      let daily = {};
      data.list.forEach(item => {
        let date = item.dt_txt.split(" ")[0];
        if (!daily[date] && item.dt_txt.includes("12:00:00")) {
          daily[date] = item;
        }
      });

      let dates = Object.keys(daily).slice(1, 5);
      dates.forEach(date => {
        let info = daily[date];
        let icon = getWeatherIcon(info.weather[0].main);
        forecastDiv.innerHTML += `
          <div class="forecast-card">
            <p><strong>(${date})</strong></p>
            <div>${icon}</div>
            <p>Temp: ${info.main.temp} °C</p>
            <p>Wind: ${info.wind.speed} M/S</p>
            <p>Humidity: ${info.main.humidity}%</p>
          </div>
        `;
      });
    });
}

function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(position => {
    let { latitude, longitude } = position.coords;
    getWeather(null, latitude, longitude);
  }, () => {
    alert("Location access denied.");
  });
}

function getWeatherIcon(condition) {
  switch (condition.toLowerCase()) {
    case "clear": return '<i class="bi bi-sun-fill"></i>';
    case "clouds": return '<i class="bi bi-cloud-fill"></i>';
    case "rain": return '<i class="bi bi-cloud-drizzle-fill"></i>';
    default: return '<i class="bi bi-cloud"></i>';
  }
}