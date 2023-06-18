import React from "react";
import { useState, useEffect} from "react";
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AirIcon from '@mui/icons-material/Air';
import "./css/DashSidebar.css"
import { Link, Outlet } from "react-router-dom";


const DashSidebar = ({ authDelete }) => {

  const { collapseSidebar } =
    useProSidebar();

  const [isAdmin, setIsAdmin] = useState(false);

  const adminCheck = async () => {
    try {
      const response = await fetch("http://193.219.91.103:5915/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseRes = await response.json();

      if (parseRes.user.role === "ADMIN") {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    adminCheck();
  }, []);

 

  return (
    <div style={{ display: "flex", height: "100%" }} className="sidebarcont">
      <Sidebar className="app" defaultCollapsed="true" >
        <Menu>
          <MenuItem
            className="menu1"
            icon={
              <MenuRoundedIcon
                onClick={() => {
                  collapseSidebar();
                }}
              />
            }
          >
            <h2>Pelekas</h2>
          </MenuItem>
          <MenuItem
            component={<Link to="dashboard" className="link" />}
            icon={<GridViewRoundedIcon />}
          >
            Pagrindinis
          </MenuItem>
          <MenuItem component={<Link to="licenses" className="link" />} icon={<ReceiptRoundedIcon />}> Leidimai </MenuItem>
          <MenuItem component={<Link to="chart" className="link" />} icon={<BarChartRoundedIcon />}> Statistika </MenuItem>
         
          <MenuItem component={<Link to="weather" className="link" />} icon={<AirIcon />}>
            Orai
          </MenuItem>
          {/* <MenuItem component={<Link to="calc" className="link" />} icon={<CalculateIcon />}>Kibimo rodiklis</MenuItem> */}
          {/* </SubMenu> */}
          <MenuItem
            component={<Link to="calendar" className="link" />}
            icon={<CalendarMonthIcon />}
          >
            Kalendorius
          </MenuItem>
          <MenuItem
            component={<Link to="map" className="link" />}
            icon={<AddLocationAltIcon />}
          >
            Žemėlapis
          </MenuItem>
          <MenuItem component={<Link to="settings" className="link" />} icon={<SettingsApplicationsRoundedIcon />}> Nustatymai </MenuItem>
          <MenuItem icon={<LogoutRoundedIcon onClick={() => { authDelete() }} />}> Atsijungti </MenuItem>
          {isAdmin && (
            <MenuItem component={<Link to="admin" className="link" />} icon={<SettingsApplicationsRoundedIcon />}> Admin </MenuItem>
          )}
        </Menu>
      </Sidebar>
      <div className="contentContainer" style={{ flexGrow: 1, padding: "1rem" }}>
        <Outlet />

      </div>
    </div>
  );
};

export default DashSidebar;