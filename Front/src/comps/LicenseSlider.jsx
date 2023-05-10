import React, { useState, useEffect } from 'react';
import './LicenseSlider.css';

const LicenseSlider = ({ licenses, onRemove, onUpdate }) => {
  const [displayIndex, setDisplayIndex] = useState(0);


  useEffect(() => {
    if (licenses.length <= 3) {
      setDisplayIndex(0);
    }
  }, [licenses]);

  const prevLicense = () => {
    if (displayIndex > 0) {
      setDisplayIndex(displayIndex - 1);
    }
  };

  const nextLicense = () => {
    if (displayIndex < licenses.length - 3) {
      setDisplayIndex(displayIndex + 1);
    }
  };

  const handleDateChange = (licenseId, dateType, newDate) => {
    onUpdate(licenseId, dateType, newDate);
  };

  const handleDescriptionChange = (licenseId, newDescription) => {
    onUpdate(licenseId, 'description', newDescription);
  };


  return (
    <div className="license-slider">
      <button className='sliderbutton' onClick={prevLicense}>Ankst.</button>
      <div className="license-container">
        {licenses.slice(displayIndex, displayIndex + 3).map((license) => (
          <div className="license" key={license.id}>
            <p>License ID: {license.id}</p>
            <label htmlFor={`start-date-${license.id}`}>Start Date:</label>
            <input
              type="date"
              id={`start-date-${license.id}`}
              value={license.startDate}
              onChange={(e) => handleDateChange(license.id, 'startDate', e.target.value)}
            />
            <label htmlFor={`end-date-${license.id}`}>End Date:</label>
            <input
              type="date"
              id={`end-date-${license.id}`}
              value={license.endDate}
              onChange={(e) => handleDateChange(license.id, 'endDate', e.target.value)}
            />
            <label htmlFor={`description-${license.id}`}>Description:</label>
            <input
              type="text"
              id={`description-${license.id}`}
              value={license.description}
              onChange={(e) => handleDescriptionChange(license.id, e.target.value)}
            />
            <button className='sliderbutton' onClick={() => onRemove(license.id)}>Remove</button>
          </div>
        ))}
      </div>
      <button className='sliderbutton' onClick={nextLicense}>Kita</button>
    </div>
  );
};

export default LicenseSlider;