import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from "react-pro-sidebar";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import CalculateIcon from '@mui/icons-material/Calculate';
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import BubbleChartRoundedIcon from "@mui/icons-material/BubbleChartRounded";
import ThermostatIcon from '@mui/icons-material/Thermostat';
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



  // const { collapseSidebar, collapsed, toggled, broken, rtl } =
  //   useProSidebar();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar className="app">
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
          <SubMenu label="Statistika" icon={<BarChartRoundedIcon />}>
            <MenuItem component={<Link to="chart1" className="link" />} icon={<TimelineRoundedIcon />}> 1 Lentelė </MenuItem>
            <MenuItem component={<Link to="chart2" className="link" />} icon={<BubbleChartRoundedIcon />}>2 Lentelė</MenuItem>
          </SubMenu>
          {/* <SubMenu label="Orai" icon={<ThermostatIcon />}> */}
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
          <MenuItem icon={<LogoutRoundedIcon onClick={() => {authDelete()}} />}> Atsijungti </MenuItem>
          <MenuItem component={<Link to="admin" className="link" />} icon={<SettingsApplicationsRoundedIcon />}> Admin </MenuItem>
        </Menu>
      </Sidebar>
      <div className="contentContainer" style={{ flexGrow: 1, padding: "1rem" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashSidebar;