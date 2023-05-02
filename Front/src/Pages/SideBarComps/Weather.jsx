import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import "../css/Weather.css"

const Weather = () => {
  const [selectedLake, setSelectedLake] = useState(null);
  const [weather, setWeather] = useState(null);

  const loadLakes = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }

    const response = await fetch(`http://localhost:5000/lakedata?search=${inputValue}`);
    const data = await response.json();
    const lakesOptions = data.map((lake) => ({
      value: lake,
      label: lake.name,
    }));

    return lakesOptions;
  };

  const getWeather = async (x, y) => {
    const apiKey = '614d75b0b0b961949b101b0eda006126';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${y}&lon=${x}&appid=${apiKey}`
    );
    setWeather(response.data);
  };

  const renderForecast = () => {
    if (!weather) return null;

    const dailyData = weather.list.filter((reading) =>
      reading.dt_txt.includes('18:00:00')
    );

    const forecastElements = dailyData.slice(0, 5).map((day, index) => (
      <div key={index} className="weather-rectangle">
        <h4>{new Date(day.dt_txt).toLocaleDateString()}</h4>
        <p>Oras: {day.weather[0].description}</p>
        <p>Temperatūra: {Math.round(day.main.temp - 273.15)}°C</p>
      </div>
    ));

    return (
      <div className="forecast">
        {forecastElements.map((element) => (
          <div key={element.key}>{element}</div>
        ))}
      </div>
    );
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedLake(selectedOption.value);
    getWeather(selectedOption.value.x, selectedOption.value.y);
  };

  return (
    <div>
      <AsyncSelect
        loadOptions={loadLakes}
        onChange={handleSelectChange}
        isSearchable={true}
        placeholder="Search for a lake..."
      />
      {selectedLake && weather && (
        <div>
          <h3>{selectedLake.name}</h3>
          {renderForecast()}
        </div>
      )}
    </div>
  );
};

export default Weather;