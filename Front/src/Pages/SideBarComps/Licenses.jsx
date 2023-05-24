import React, { useState, useEffect, useCallback } from 'react';
import '../css/LicenseSlider.css';
import { toast } from 'react-toastify';

const Licenses = () => {
  const [licenses, setLicenses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [inputValues, setInputValues] = useState({});


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
    const currentDate = formatDate(new Date());
    const newLicense = {
      id: tempId,
      startDate: currentDate,
      endDate: currentDate,
      description: "",
    };
    setLicenses([...licenses, newLicense]);
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

        setUserId(user.id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    // Call the fetchUserId function here
    fetchUserId();
  }, []);



  const [displayIndex, setDisplayIndex] = useState(0);



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
    if (!newDate) {
      return;
    }

    const originalLicense = licenses.find((license) => license.id === licenseId);

    if (originalLicense) {
      const originalDate = originalLicense[dateType];

      // If the date has not changed, return without updating the state or saving the license
      if (originalDate === newDate) {
        return;
      }

      // Check if the newDate is a valid date
      const date = new Date(newDate);
      if (isNaN(date.getTime())) {
        // Show an error message if the date is not valid
        toast.error('Neteisinga datos reikšmė');
        return;
      }
    }

    const updatedLicenses = licenses.map((license) =>
      license.id === licenseId ? { ...license, [dateType]: newDate } : license
    );
    setLicenses(updatedLicenses);

    if (licenseId >= 0) {
      const updatedLicense = updatedLicenses.find((license) => license.id === licenseId);
      saveLicense(updatedLicense);
    }
  };

  const handleDescriptionChange = (licenseId, newDescription) => {
    const updatedLicenses = licenses.map((license) =>
      license.id === licenseId ? { ...license, description: newDescription } : license
    );
    setLicenses(updatedLicenses);

    if (licenseId >= 0) {
      const updatedLicense = updatedLicenses.find((license) => license.id === licenseId);
      saveLicense(updatedLicense);
    }
  };

  const fetchLicenses = useCallback ( async () => {
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
  }, [userId]);

  const saveLicense = useCallback (async (licenseData) => {
    try {

      let response;
      if (licenseData.id >= 0) {
        // Update the existing license
        response = await fetch(`http://localhost:5000/licenses/${userId}/${licenseData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
          },
          body: JSON.stringify(licenseData), // Send a single license
        });

      } else {
        // Save a new license
        response = await fetch(`http://localhost:5000/licenses/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.token,
          },
          body: JSON.stringify(licenseData), // Send a single license
        });
      }

      const updatedLicense = await response.json();


      // Format the dates before returning the license
      const formattedLicense = {
        ...updatedLicense,
        startDate: formatDate(updatedLicense.startDate),
        endDate: formatDate(updatedLicense.endDate),
      };

      // Update the local state with the new license id
      setLicenses(
        licenses.map((license) =>
          license.id === licenseData.id ? formattedLicense : license
        )
      );

      // If the license was added, update the local state with the new license id
      if (licenseData.id < 0) {
        setLicenses(
          licenses.map((license) =>
            license.id === licenseData.id ? formattedLicense : license
          )
        );
      }

      toast.success("Leidimas išsaugotas");
      return formattedLicense;
    } catch (error) {
      console.error("Error saving license:", error);
      toast.error("Klaida išsaugant leidimą");
    }
  }, [licenses, userId]);

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
      await response.json();

      // Remove the deleted license from the local state
      removeLicense(licenseId);
      toast.success("Leidimas ištrintas");
    } catch (error) {
      console.error("Error deleting license:", error);
      toast.error("Klaida ištrinant leidimą");
    }
  };

  useEffect(() => {
    const newLicense = licenses.find(license => license.id < 0);
    if (newLicense) {
      saveLicense(newLicense);
    }
  }, [licenses, saveLicense]);

  useEffect(() => {
    if (licenses.length <= 3) {
      setDisplayIndex(0);
    }
  }, [licenses]);

  useEffect(() => {
    if (userId) {
      fetchLicenses();
    }
  }, [userId, fetchLicenses]);

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
                  className="dateInput"
                  id={`start-date-${license.id}`}
                  value={inputValues[`start-${license.id}`] || license.startDate || ""}
                  onChange={(e) =>
                    setInputValues({ ...inputValues, [`start-${license.id}`]: e.target.value })
                  }
                  onBlur={() =>
                    handleDateChange(license.id, "startDate", inputValues[`start-${license.id}`])
                  }
                />
                <label htmlFor={`end-date-${license.id}`}>Pabaiga:</label>
                <input
                  type="date"
                  className="dateInput"
                  id={`end-date-${license.id}`}
                  value={inputValues[`end-${license.id}`] || license.endDate || ""}
                  onChange={(e) =>
                    setInputValues({ ...inputValues, [`end-${license.id}`]: e.target.value })
                  }
                  onBlur={() =>
                    handleDateChange(license.id, "endDate", inputValues[`end-${license.id}`])
                  }
                />
                <label htmlFor={`description-${license.id}`}>Aprašymas:</label>
                <input
                  type="text"
                  className="textInput"
                  id={`description-${license.id}`}
                  value={inputValues[license.id] || license.description || ""}
                  onChange={(e) => setInputValues({ ...inputValues, [license.id]: e.target.value })}
                  onBlur={() => handleDescriptionChange(license.id, inputValues[license.id])}
                />
                <button className='sliderbutton' onClick={() => deleteLicense(license.id)}>Ištrinti</button>
              </div>
            ))}
          </div>
          <button className='sliderbutton' onClick={nextLicense}>Kiti</button>
        </div>
      </div>

    </div>
  );
};

export default Licenses;

