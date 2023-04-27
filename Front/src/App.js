import { Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginSignupPage";
import DashSidebar from "./Pages/DashSidebar";
import Home from "./Pages/SideBarComps/Home";
import Dashboard from "./Pages/SideBarComps/Dashboard";
import Licenses from "./Pages/SideBarComps/Licenses";
import React from "react";
import Chart1 from "./Pages/SideBarComps/Chart1";
import Chart2 from "./Pages/SideBarComps/Chart2";
import Settings from "./Pages/SideBarComps/Settings";
import Weather from "./Pages/SideBarComps/Weather";
import Calc from "./Pages/SideBarComps/FishingCalc";
import Map from "./Pages/SideBarComps/Map";
import Calendar from "./Pages/SideBarComps/SideCalendar";
import { useState, useEffect } from "react";
import PrivateRoute from "./ProtectedRoute"; // Import PrivateRoute component

function App() {

  const [isAuth, setIsAuth] = useState(false);

  const authSetter = () => {
    console.log("before", isAuth);
    setIsAuth(!isAuth);
  };

  async function checkAuth() {
    try {
      const response = await fetch("http://localhost:5000/auth/verify", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      console.log(parseRes, "parseRes in checkAuth");

      parseRes === true ? setIsAuth(true) : setIsAuth(false);

    } catch (error) {
      console.log(error, "checkAuth error");
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);


  useEffect(() => {
    console.log("updated", isAuth);
  }, [isAuth]);

  return (
    <div className="App">
      <Routes>
        <Route path="login" element={<LoginPage isAuth={isAuth} authChange={authSetter} />} />
        <Route path="/" element={<PrivateRoute isAuth={isAuth} />}>
          <Route path="/" element={<DashSidebar authDelete={authSetter} />} >
            <Route index element={<Home />} />
            <Route path="chart1" element={<Chart1 />} />
            <Route path="chart2" element={<Chart2 />} />
            <Route path="settings" element={<Settings />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="map" element={<Map />} />
            <Route path="licenses" element={<Licenses />} />
            <Route path="weather" element={<Weather />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="calc" element={<Calc />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;