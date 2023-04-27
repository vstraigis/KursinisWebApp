import React from "react";
import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar } from "react-pro-sidebar";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import BubbleChartRoundedIcon from "@mui/icons-material/BubbleChartRounded";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
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
          <SubMenu label="Orai" icon={<WalletRoundedIcon />}>
            <MenuItem component={<Link to="weather" className="link" />} icon={<AccountBalanceRoundedIcon />}>
              Orai
            </MenuItem>
            <MenuItem component={<Link to="calc" className="link" />} icon={<SavingsRoundedIcon />}>Kibimo rodiklis</MenuItem>
          </SubMenu>
          <MenuItem
            component={<Link to="calendar" className="link" />}
            icon={<MonetizationOnRoundedIcon />}
          >
            Kalendorius
          </MenuItem>
          <MenuItem
            component={<Link to="map" className="link" />}
            icon={<MonetizationOnRoundedIcon />}
          >
            Žemėlapis
          </MenuItem>
          <MenuItem component={<Link to="settings" className="link" />} icon={<SettingsApplicationsRoundedIcon />}> Nustatymai </MenuItem>
          <MenuItem icon={<LogoutRoundedIcon onClick={() => {authDelete()}} />}> Atsijungti </MenuItem>
        </Menu>
      </Sidebar>
      <div style={{ flexGrow: 1, padding: "1rem" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashSidebar;