import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import FarmerForm from "./pages/Formerform";
import Login from "./pages/Login";
import Register from "./pages/RegistrationForm";
import ForgotUsername from "./pages/ForgotUsername";
import ForgotPassword from "./pages/ForgotPassword";
import logo1 from "./assets/leftlogo.png";
import logo2 from "./assets/rightlogo.png";
import "./App.css"


function Layout({ children, currentStep = 0 }) {
  const steps = [
    "🏛️ Personal Information",
    "📌 Address",
    "👨‍🌾 Professional Information",
    "🌱 Current Crop Information",
    "🌾 Proposed Crop Information",
    "💧 Irrigation Details",
    "🔍 Other Information",
    "📄 Documents",
    "🛂 Portal Access",
    "🚜 View Farmer",
  ];

  return (
    <div className="infologo-container">
      <header className="infotop-bar">
        <img src={logo1} alt="Digital Agristack Logo" className="infologo-left" />
        <img src={logo2} alt="DATE Logo" className="infologo-right" />
      </header>

      <div className="infomiddle-container">
        <nav className="infonav-links">
        {steps.map((label, index) => (
  <div
    key={index}
    className={`infonav-item ${index === currentStep ? "active" : ""}`}
  >
    {label}
  </div>
))}
        </nav>
      </div>

      <div className="content-container">{children}</div>
    </div>
  );
}


function AppContent() {
  const location = useLocation();
  const noFrameRoutes = ["/login", "/register", "/forgot-username", "/forgot-password"];

  if (noFrameRoutes.includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-username" element={<ForgotUsername />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    );
  }

 
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <FarmerFormWrapper />
        }
      />
    </Routes>
  );
}


function FarmerFormWrapper() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <Layout currentStep={currentStep}>
      <FarmerForm currentStep={currentStep} setCurrentStep={setCurrentStep} />
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
