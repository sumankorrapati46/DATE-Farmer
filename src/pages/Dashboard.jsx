import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import logo1 from "../assets/leftlogo.png";
import logo2 from "../assets/rightlogo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPersonDigging } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
          <header className="dash-bar">
        <img src={logo1} alt="Digital Agristack Logo" className="infologo-left" />
        <img src={logo2} alt="DATE Logo" className="infologo-right" />
      </header>
      <div className="banner-image" />
         
      <div className="dashboard-grid">
       <div className="dashboard-sidebar"> 
        <ul className="sidebar-menu">
          <li className="active">Dashboard</li>
          <li>Farmers</li>
          <li>Employees</li>
          <li>User & Roles</li>
          <li>Personalization</li>
          <li>Settings</li>
          <li>My Account</li>
          <li>Logout</li>
        </ul>
      </div>

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
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
