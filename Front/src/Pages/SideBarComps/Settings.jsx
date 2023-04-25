import React, { useState } from "react";
import "../css/Settings.css";

const Settings = () => {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    showChangePassword: false,
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const changePassword = () => {
    setState({ ...state, showChangePassword: !state.showChangePassword });
  };

  const saveNewPassword = () => {
    if (state.newPassword === state.confirmPassword) {
      alert(`New password saved: ${state.newPassword}`);
    } else {
      alert("Passwords do not match");
    }
  };

  const saveChanges = () => {
    alert("Changes saved");
  };

  const deleteAccount = () => {
    alert("Delete account clicked");
  };

  return (
    <div className="settings">
      <h1 className="settings__title">Settings</h1>
      <form className="settings__form">
        <label className="settings__label">
          First Name:
          <input
            type="text"
            name="firstName"
            value={state.firstName}
            onChange={handleChange}
            className="settings__input"
          />
        </label>
        <label className="settings__label">
          Last Name:
          <input
            type="text"
            name="lastName"
            value={state.lastName}
            onChange={handleChange}
            className="settings__input"
          />
        </label>
        <label className="settings__label">
          Birth Date:
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
        Change Password
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
            Save
          </button>
        </div>
      )}
      <button onClick={saveChanges} className="settings__button">
        Save Changes
      </button>
      <button onClick={deleteAccount} className="settings__button">
        Delete Account
      </button>
    </div>
  );
};

export default Settings;