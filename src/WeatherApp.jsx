import React, { useState } from "react";
import axios from "axios";
import "./WeatherApp.css"; // Create this file to move the CSS

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [geoWeather, setGeoWeather] = useState(null);

  const API_KEY = "a69f51a6fb5ca745f157910b497ed2e5";

  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      fetchForecast(city);
      fetchAlerts(response.data.coord.lat, response.data.coord.lon);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchForecast = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setForecast(response.data.list.filter((entry, index) => index % 8 === 0));
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  };

  const fetchAlerts = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error("Error fetching alerts data:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const addFavorite = () => {
    if (weather && !favorites.some((fav) => fav.name === weather.name)) {
      setFavorites([...favorites, weather]);
    }
  };

  const removeFavorite = (city) => {
    setFavorites(favorites.filter((fav) => fav.name !== city));
  };

  const requestGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchGeoWeather(latitude, longitude);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const fetchGeoWeather = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setGeoWeather(response.data);
    } catch (error) {
      console.error("Error fetching geolocation weather data:", error);
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Weather Forecast</h1>
      </div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Search</button>
      </form>

      {weather && (
        <div className="weather-card">
          <h2>Weather in {weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          <p>{weather.weather[0].description}</p>
          <button onClick={addFavorite}>Add to Favorites</button>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="weather-card">
          <h2>Weather Alerts</h2>
          {alerts.map((alert, index) => (
            <div key={index}>
              <p>
                {alert.event}: {alert.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {forecast.length > 0 && (
        <div >
          <h2>5-Day Forecast</h2>
          <div className="weather-card-container">
          {forecast.map((entry, index) => (
            <div key={index} className="weather-card">
              <p>
                {new Date(entry.dt * 1000).toLocaleDateString()}:{" "}
                {entry.main.temp}°C, {entry.weather[0].description}
              </p>
            </div>
          ))}
          </div>
        </div>
      )}

      {geoWeather && (
        <div
          className="weather-card"
          style={{ background: "yellow", color: "black" }}
        >
          <h3 style={{color : "blue"}}>highlights part is your Location Weather</h3>
          <p>Location: {geoWeather.name}</p>
          <p>Temperature: {geoWeather.main.temp}°C</p>
          <p>Humidity: {geoWeather.main.humidity}%</p>
          <p>Wind Speed: {geoWeather.wind.speed} m/s</p>
          <p>{geoWeather.weather[0].description}</p>
        </div>
      )}

      <div className="favorites">
        {favorites.map((fav, index) => (
          <div key={index} className="favorite-card">
            <h3>{fav.name}</h3>
            <p>{fav.main.temp}°C</p>
            <button onClick={() => removeFavorite(fav.name)}>Remove</button>
          </div>
        ))}
      </div>

      <button className="button-geolocation" onClick={requestGeolocation}>
        Get My Location Weather
      </button>
    </div>
  );
};

export default WeatherApp;
