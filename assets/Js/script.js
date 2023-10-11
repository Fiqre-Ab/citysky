var search = document.getElementById("search");
var searchBtn = document.querySelector(".search-btn");
var container = document.querySelector(".container");
var list = document.getElementById("list");
var weather = document.querySelector(".weather");
var foreCast = document.querySelector(".foreCast");
var forecastContainer = document.getElementById("forecast-container");

var cityName = document.getElementById("cityName");
var cityDate = document.getElementById("cityDate");
var cityIcon = document.getElementById("cityIcon");
var temperature = document.getElementById("temperature");
var humidity = document.getElementById("humidity");
var windSpeed = document.getElementById("windSpeed");
var weatherDescription = document.getElementById("weather-description");

searchBtn.addEventListener("click", handleSearch);

// Load the searched cities from local storage on page load

function handleSearch() {
  var city = search.value.trim(); // Trim the city name to remove leading/trailing whitespace
  var key = "4674469ff19f3bf2b5c1466bb4d0e1c6";
  var weatherApi =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    key;
  if (city === "") {
    alert("Please ENTER the city value");
  } else {
    localStorage.setItem("lastSearchedCity", city);
    callApi(city);
  }

  function callApi(city) {
    search.value = "";
    fetch(weatherApi)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network service is down, it's not working");
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        display(data);
        // Add the searched city to the list and local storage
        addSearchedCity(city);
        // After displaying current weather, fetch the 5-day forecast
        fetchWeatherForecast(data.coord.lat, data.coord.lon);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function display(data) {
    const date = new dayjs().format("DD/MM/YYYY"); // Fix the date format
    container.style.display = "block";
    foreCast.style.display = "block";
    list.style.display = "block";
    cityName.textContent = data.name + ", " + data.sys.country + "  " + date;
    temperature.textContent = "Temperature: " + data.main.temp + "°C"; // Use Celsius
    windSpeed.textContent = "Wind Speed: " + data.wind.speed + " m/s"; // Wind speed in meters per second
    humidity.textContent = "Humidity: " + data.main.humidity + "%";
    weatherDescription.textContent = "Weather: " + data.weather[0].description;

    // Set the weather icon using the icon code from the data
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    cityIcon.src = iconUrl;
    cityIcon.alt = "Weather Icon";
  }

  function addSearchedCity(city) {
    // Create a new list item for the city and append it to the list
    var listItem = document.createElement("li");
    listItem.textContent = city;
    list.appendChild(listItem);

    // Store the list of searched cities in local storage
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
  }
  function loadSearchedCities() {
    // Load and display the list of searched cities from local storage
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    cities.forEach(function (city) {
      var listItem = document.createElement("li");
      listItem.textContent = city;
      listItem.addEventListener("click", function () {
        // When a city in the list is clicked, fetch the weather for that city
        search.value = city;
        handleSearch();
      });
      list.appendChild(listItem);
    });
  }

  window.addEventListener("load", function () {
    loadSearchedCities();
    // Get the last searched city from local storage
    const lastSearchedCity = localStorage.getItem("lastSearchedCity");
    if (lastSearchedCity) {
      search.value = lastSearchedCity;
      handleSearch(); // Fetch weather for the last searched city on page load
    }
  });

  // Function to fetch and display the 5-day forecast
  function fetchWeatherForecast(lat, lon) {
    var forecastUrl =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=4674469ff19f3bf2b5c1466bb4d0e1c6&units=metric"; // Use your actual API key

    fetch(forecastUrl)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to fetch forecast data");
      })
      .then(function (data) {
        displayForecast(data.list);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function displayForecast(forecastData) {
    forecastContainer.innerHTML = ""; // Clear previous forecast data

    var forecastRow = document.createElement("div");
    forecastRow.classList.add("row");

    // Iterate through the forecast data (usually in 3-hour intervals)
    for (var i = 0; i < forecastData.length; i++) {
      var forecast = forecastData[i];

      // Extract relevant data for display
      const date = new dayjs(forecast.dt_txt).format("DD/MM/YYYY");
      const iconCode = forecast.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
      const temperature = forecast.main.temp + "°C";
      const windSpeed = forecast.wind.speed + " m/s";
      const humidity = forecast.main.humidity + "%";

      if (i % 8 === 0) {
        var forecastItem = document.createElement("div");
        forecastItem.classList.add("col"); // Use Bootstrap grid class 'col' for equal width columns
        forecastItem.classList.add("forecast-item");
        forecastItem.innerHTML = `
        <h3>${date}</h3>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>Temperature: ${temperature}</p>
        <p>Wind Speed: ${windSpeed}</p>
        <p>Humidity: ${humidity}</p>
      `;

        forecastRow.appendChild(forecastItem);

        // Display a maximum of 5 days
        if (forecastRow.children.length >= 5) {
          break;
        }
      }
    }

    forecastContainer.appendChild(forecastRow);
  }
}
