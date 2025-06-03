import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Dashboard.css";
import logo1 from "../assets/leftlogo.png";
import logo2 from "../assets/rightlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPersonDigging } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const handleToggle = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <div className="dashboard-container">
      <header className="dash-bar">
        <img src={logo1} alt="Digital Agristack Logo" className="infologo-left" />
        <img src={logo2} alt="DATE Logo" className="infologo-right" />
      </header>

      <div className="banner-image" />

      <div className="dashboard-grid">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <ul className="sidebar-menu">
            <li className="active">
              <Link to="/dashboard">Dashboard</Link>
            </li>

            {/* Farmers with toggle down */}
            <li onClick={() => handleToggle("farmers")} className="has-submenu">
              Farmers
              {openMenu === "farmers" && (
                <ul className="submenu">
                  <li>
                    <Link to="/">Add Farmer</Link>
                  </li>
                  <li>
                    <Link to="/view-farmer">View Farmer</Link>
                  </li>
                </ul>
              )}
            </li>
                    
                    <li onClick={() => handleToggle("employees")} className="has-submenu">
              Employees
              {openMenu === "employees" && (
                <ul className="submenu">
                  <li>
                    <Link to="/EmployeeDetails">Add Employees</Link>
                  </li>
                  <li>
                    <Link to="/view-employees">View Employees</Link>
                  </li>
                </ul>
              )}
            </li>
            
            <li>
              <Link to="/user-roles">User & Roles</Link>
            </li>
            <li>
              <Link to="/personalization">Personalization</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <Link to="/account">My Account</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        </div>

        {/* Main dashboard */}
        <div className="dashboard-main">
          <div className="dashboard-title">Dashboard</div>
          <div className="card-wrapper">
            <div className="card" onClick={() => navigate("/farmer")}>
              <h3 className="card-title blue">Farmers</h3>
              <div className="card-icon">
                <FontAwesomeIcon icon={faPersonDigging} size="2x" />
              </div>
              <div>0</div>
              <div className="percentage">0% increase</div>
            </div>

            <div className="card" onClick={() => navigate("/employee")}>
              <h3 className="card-title blue">Employees</h3>
              <div className="card-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div>0</div>
              <div className="percentage">0% increase</div>
            </div>

            <div className="card" onClick={() => navigate("/fpo")}>
              <h3 className="card-title blue">FPO</h3>
              <div className="card-icon">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div>0</div>
              <div className="percentage">0% increase</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
