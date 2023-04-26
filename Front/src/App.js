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
import { useState } from "react";
import PrivateRoute from "./ProtectedRoute"; // Import PrivateRoute component

function App() {

  const [isAuth, setIsAuth] = useState(false);

  const authSetter = () => {
    setIsAuth(true);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="login" element={<LoginPage authChange={authSetter} />} />
        <Route path="/" element={<PrivateRoute isAuth={isAuth} />}>
          <Route path="/" element={<DashSidebar />} >
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