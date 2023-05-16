import React from "react";
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import LoginPage from "./Pages/LoginSignupPage";
import DashSidebar from "./Pages/DashSidebar";
import Home from "./Pages/SideBarComps/Home";
import Dashboard from "./Pages/SideBarComps/Dashboard";
import Licenses from "./Pages/SideBarComps/Licenses";
import Chart from "./Pages/SideBarComps/Charts";

import Settings from "./Pages/SideBarComps/Settings";
import Weather from "./Pages/SideBarComps/Weather";
import Calc from "./Pages/SideBarComps/FishingCalc";
import Map from "./Pages/SideBarComps/Map";
import Calendar from "./Pages/SideBarComps/SideCalendar";
import AdminPanel from "./Pages/SideBarComps/AdminPanel";

import PrivateRoute from "./ProtectedRoute"; // Import PrivateRoute component

function App() {

  const [isAuth, setIsAuth] = useState(false);

  const authSetter = () => {
    setIsAuth(!isAuth);
  };

  const jwtRemove = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    toast.success("Logged Out");
  };

  async function checkAuth() {
    try {
      const response = await fetch("http://localhost:5000/auth/verify", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      if (response.status === 403) {
        toast.error("Please Login");
        return setIsAuth(false);
        
      }

      const parseRes = await response.json();


      parseRes === true ? setIsAuth(true) : setIsAuth(false);

    } catch (error) {
      // toast.error("Error Occured");
      // console.log(error, "checkAuth error");
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);



  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        <Route path="login" element={<LoginPage isAuth={isAuth} authChange={authSetter} />} />
        <Route path="/" element={<PrivateRoute isAuth={isAuth} />}>
          <Route path="/" element={<DashSidebar authDelete={jwtRemove} />} >
            <Route index element={<Home />} />
            <Route path="chart" element={<Chart />} />
            <Route path="settings" element={<Settings authDelete={jwtRemove} />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="map" element={<Map />} />
            <Route path="licenses" element={<Licenses />} />
            <Route path="weather" element={<Weather />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="calc" element={<Calc />} />
            <Route path="admin" element={<AdminPanel />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;