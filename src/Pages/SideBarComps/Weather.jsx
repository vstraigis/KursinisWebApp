import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import lakesData from '../../assets/additional/lakes.json';
import "../css/Weather.css"

const Weather = () => {
  const [lakes, setLakes] = useState([]);
  const [selectedLake, setSelectedLake] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const lakesOptions = lakesData.map((lake) => ({
      value: lake,
      label: lake.name,
    }));
    setLakes(lakesOptions);
  }, []);

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
      <Select
        options={lakes}
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