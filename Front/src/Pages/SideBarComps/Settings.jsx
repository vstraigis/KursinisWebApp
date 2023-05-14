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

  const [userId, setUserId] = useState(null);

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
        await axios.put(`http://localhost:5000/user/${userId}/changepassword`, {
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
        await axios.put(`http://localhost:5000/user/${userId}/update`, payload, {
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
      await axios.delete(`http://localhost:5000/user/${userId}/delete`, {
        headers: { token: localStorage.token }
      });
      toast.success("Account deleted");
      // Redirect to the login page or any other appropriate page
      authDelete();
    } catch (error) {
      toast.error("Error deleting account");
    }
  };

  return (
    <div className="settings">
      <div className="settings__container">
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
              className="settings__label settings__input"

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
    </div>
  );
};

export default Settings;