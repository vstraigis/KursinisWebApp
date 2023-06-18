import React, { useState, useEffect } from "react";
import "../css/Settings.css";
import { toast } from "react-toastify";
import axios from "axios";


const Settings = ({ authDelete }) => {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    showChangePassword: false,
    newPassword: "",
    confirmPassword: "",
  });

 

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("http://193.219.91.103:5915/dashboard/", {
          method: "GET",
          headers: { token: localStorage.token }     
        });
        const { user } = await response.json();
      
        if (user.birthDay) {
          const date = new Date(user.birthDay);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const formattedDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
          user.birthDay = formattedDate;
        }
        setState({
          firstName: user.name || "",
          lastName: user.lastName || "",
          birthDate: user.birthDay || "",
        });
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, [])

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const changePassword = () => {
    setState({ ...state, showChangePassword: !state.showChangePassword });
  };

  const saveNewPassword = async () => {
    if (state.newPassword === state.confirmPassword) {
      try {
        await axios.put(`http://193.219.91.103:5915/user/changepassword`, {
          newPassword: state.newPassword,
        }, {
          headers: { token: localStorage.token }
        });

        alert(`New password saved: ${state.newPassword}`);
        toast.success("New password saved");
      } catch (error) {
        alert("Error saving new password");
        toast.error("Error saving new password");
      }
    } else {
      alert("Passwords do not match");
      toast.error("Passwords do not match");
    }
  };

  const saveChanges = async () => {
    const payload = {};
    if (state.firstName) payload.firstName = state.firstName;
    if (state.lastName) payload.lastName = state.lastName;
    if (state.birthDate) payload.birthDate = state.birthDate;

    if (Object.keys(payload).length > 0) {
      try {
        await axios.put(`http://193.219.91.103:5915/user/update`, payload, {
          headers: { token: localStorage.token }
        });
        toast.success("Changes saved");
      } catch (error) {
        toast.error("Error saving changes");
      }
    } else {
      alert("No changes to save");
      toast.error("No changes to save");
    }
  };

  const deleteAccount = async () => {
    try {
      await axios.delete(`http://193.219.91.103:5915/user/delete`, {
        headers: { token: localStorage.token }
      });
      toast.success("Account deleted");
      
      authDelete();
    } catch (error) {
      toast.error("Error deleting account");
    }
  };

  const objectToXml = (obj, indent = 0) => {
    let xml = '';
    const indentation = '    '.repeat(indent);
  
    for (const prop in obj) {
      const isArray = obj[prop] instanceof Array;
      const isObject = typeof obj[prop] === 'object';
  
      xml += isArray ? '' : `${indentation}<${prop}>`;
      xml += isObject ? '\n' : '';
  
      if (isArray) {
        for (const array in obj[prop]) {
          xml += `${indentation}<${prop}>\n`;
          xml += objectToXml({...obj[prop][array]}, indent + 1);
          xml += `${indentation}</${prop}>\n`;
        }
      } else if (isObject) {
        xml += objectToXml({...obj[prop]}, indent + 1);
      } else {
        xml += obj[prop];
      }
  
      xml += isArray ? '' : `${isObject ? indentation : ''}</${prop}>\n`;
    }
  
    return xml;
  };
  
  const DownloadUserData = async () => {
    try {
      const response = await axios.get(`http://193.219.91.103:5915/download/data`, {
        headers: { token: localStorage.token }
      

      });
      const { data } = response;
      console.log("Data:", data);
  
      // Convert the data object into an XML string
      const xmlString = objectToXml(data);
  
      // Add XML declaration and root element
      const finalXmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${xmlString}\n</root>`;
  
      // Create a Blob using the XML string
      const blob = new Blob([finalXmlString], { type: "application/xml" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
  
      // Set the href and download attributes of the anchor element
      link.href = url;
      link.download = "data.xml";
  
      // Append the link, click it, and remove it from the DOM
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
  
    } catch (error) {
      toast.error("Error downloading data");
    }
  };
  

  return (
    <div className="settings">
      <div className="settings__container">
        <h1 className="settings__title">Nustatymai</h1>
        {/* <img src={} alt="avatar" className="settings__avatar" /> */}
        <form className="settings__form">
          <label className="settings__label">
            Vardas:
            <input
              type="text"
              name="firstName"
              value={state.firstName}
              onChange={handleChange}
              className="settings__input"
            />
          </label>
          <label className="settings__label">
            Pavardė:
            <input
              type="text"
              name="lastName"
              value={state.lastName}
              onChange={handleChange}
              className="settings__label settings__input"

            />
          </label>
          <label className="settings__label">
            Gimtadienis:
            <input
              type="date"
              name="birthDate"
              value={state.birthDate}
              onChange={handleChange}
              className="settings__input"

            />
          </label>
        </form>
        <button onClick={changePassword} className="settings__button">
          Keisti slaptažodį
        </button>
        {state.showChangePassword && (
          <div className="settings__password">
            <input
              type="password"
              name="newPassword"
              value={state.newPassword}
              onChange={handleChange}
              className="settings__input"
              placeholder="New password"
            />
            <input
              type="password"
              name="confirmPassword"
              value={state.confirmPassword}
              onChange={handleChange}
              className="settings__input"
              placeholder="Confirm password"
            />
            <button onClick={saveNewPassword} className="settings__button">
              Išsaugoti naują slaptažodį
            </button>
          </div>
        )}
        <button onClick={saveChanges} className="settings__button">
          Išsaugoti pakeitimus
        </button>
        <button onClick={deleteAccount} className="settings__button">
          Ištrinti paskyrą
        </button>
        <button onClick={DownloadUserData} className="settings__button">
          Gauti duomenis
        </button>
      </div>
    </div>
  );
};

export default Settings;