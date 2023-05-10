import React, { useState, useEffect } from 'react';
import '../css/LicenseSlider.css';
import { toast } from 'react-toastify';

const Licenses = () => {
  const [licenses, setLicenses] = useState([]);
  const [userId, setUserId] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const addLicense = () => {
    const tempId = -1 * (licenses.filter((license) => license.id < 0).length + 1);
    setLicenses([...licenses, { id: tempId }]);
  };

  const removeLicense = (id) => {
    setLicenses(licenses.filter((license) => license.id !== id));
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("http://localhost:5000/dashboard/", {
          method: "GET",
          headers: { token: localStorage.token } // Replace with the actual token
        });
        const { user } = await response.json();
        console.log("User :", user);
        setUserId(user.id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    // Call the fetchUserId function here
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLicenses();
    }
  }, [userId]);

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
    const updatedLicenses = licenses.map((license) =>
      license.id === licenseId ? { ...license, [dateType]: newDate } : license
    );
    setLicenses(updatedLicenses);
  };

  const handleDescriptionChange = (licenseId, newDescription) => {
    const updatedLicenses = licenses.map((license) =>
      license.id === licenseId ? { ...license, description: newDescription } : license
    );
    setLicenses(updatedLicenses);
  };

  const fetchLicenses = async () => {
    try {
      const response = await fetch(`http://localhost:5000/licenses/${userId}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const licenses = await response.json();
      // Format the dates before setting the state
      const formattedLicenses = licenses.map((license) => ({
        ...license,
        startDate: formatDate(license.startDate),
        endDate: formatDate(license.endDate),
      }));
      setLicenses(formattedLicenses);
    } catch (error) {
      console.error("Error fetching licenses:", error);
    }
  };

  
  const saveLicenses = async () => {
    try {
      // Separate new and existing licenses
      const newLicenses = licenses.filter((license) => license.id < 0);
      const existingLicenses = licenses.filter((license) => license.id >= 0);
  
      const response = await fetch(`http://localhost:5000/licenses/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify({ newLicenses, existingLicenses }), // Send both new and existing licenses
      });
  
      const updatedLicenses = await response.json();
      console.log("Updated licenses:", updatedLicenses);
  
      // Format the dates before setting the state
      const formattedLicenses = updatedLicenses.map((license) => ({
        ...license,
        startDate: formatDate(license.startDate),
        endDate: formatDate(license.endDate),
      }));
  
      // Set the local licenses with the updated licenses
      setLicenses(formattedLicenses);
      toast.success("Leidimai išsaugoti");
    } catch (error) {
      console.error("Error saving licenses:", error);
      toast.error("Klaida išsaugant leidimus");
    }
  };

  const deleteLicense = async (licenseId) => {
    // If the license is not saved in the database (id < 0), delete it locally
    if (licenseId < 0) {
      removeLicense(licenseId);
      toast.success("Leidimas ištrintas");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/licenses/${userId}/${licenseId}`, {
        method: "DELETE",
        headers: { token: localStorage.token },
      });
      const result = await response.json();
      console.log("Deleted license:", result);
      // Remove the deleted license from the local state
      removeLicense(licenseId);
      toast.success("Leidimas ištrintas");
    } catch (error) {
      console.error("Error deleting license:", error);
      toast.error("Klaida ištrinant leidimą");
    }
  };



  return (
    <div className='licensesPage'>
      <div className="licenseTitleCont" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "5px" }}>
        <h1 style={{ textAlign: "center" }}>Leidimai</h1>
        <button className='sliderbutton' onClick={addLicense} >Pridėti leidimą</button>
        <div className="license-slider">
          <button className='sliderbutton' onClick={prevLicense}>Ankst.</button>
          <div className="license-container">
          {licenses.slice(displayIndex, displayIndex + 3).map((license, index) => (
              <div className="license" key={index}>
                <p>Leidimas</p>
                <label htmlFor={`start-date-${license.id}`}>Pradžia:</label>
                <input
                  type="date"
                  className='dateInput'
                  id={`start-date-${license.id}`}
                  value={license.startDate || ''}
                  onChange={(e) => handleDateChange(license.id, 'startDate', e.target.value)}
                />
                <label htmlFor={`end-date-${license.id}`}>Pabaiga:</label>
                <input
                  type="date"
                  className='dateInput'
                  id={`end-date-${license.id}`}
                  value={license.endDate || ''}
                  onChange={(e) => handleDateChange(license.id, 'endDate', e.target.value)}
                />
                <label htmlFor={`description-${license.id}`}>Aprašymas:</label>
                <input
                  type="text"
                  className='textInput'
                  id={`description-${license.id}`}
                  value={license.description || ''}
                  onChange={(e) => handleDescriptionChange(license.id, e.target.value)}
                />
                <button className='sliderbutton' onClick={() => deleteLicense(license.id)}>Ištrinti</button>
              </div>
            ))}
          </div>
          <button className='sliderbutton' onClick={nextLicense}>Kiti</button>
        </div>
        <button className='sliderbutton' onClick={saveLicenses} >Išsaugoti leidimus</button>
      </div>
      
    </div>
  );
};

export default Licenses;

/* Add a functionality to save added licenses, in backend route when saved return,
 assigned unique id's of licenses, and assign them in front, and use those id's to delete licenses */