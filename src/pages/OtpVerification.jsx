// OTPVerification.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import background from "../assets/background-image.png";
import logo from "../assets/rightlogo.png";
import "../styles/OtpVerification.css";

const OtpVerification = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get passed state from previous page
  const { target, type } = location.state || {}; // type: 'userId' | 'password'

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      let url = '';
      if (type === 'userId') {
        url = 'http://localhost:8080/api/auth/verify-userid-otp';
      } else if (type === 'password') {
        url = 'http://localhost:8080/api/auth/verify-reset-password-otp';
      } else {
        alert("Invalid verification type");
        return;
      }

      const res = await axios.post(url, {
        emailOrPhone: target,
        otp: otp
      });

      if (type === 'userId') {
        alert("OTP Verified Successfully");
        navigate('/change-userid', { state: { user: target } });
      } else {
        alert("OTP Verified Successfully");
        navigate('/change-password', { state: { user: target } });
      }
    } catch (error) {
      alert("Invalid or expired OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    try {
      const resendUrl = type === 'userId'
        ? 'http://localhost:8080/api/auth/send-userid-otp'
        : 'http://localhost:8080/api/auth/send-reset-password-otp';

      await axios.post(resendUrl, {
        emailOrPhone: target
      });

      alert("OTP resent to your email.");
    } catch (error) {
      alert("Failed to resend OTP.");
    }
  };

  return (
    <div className="otp-container" style={{ backgroundImage: `url(${background})` }}>
      <img src={logo} alt="Logo" className="otp-logo" />
      <div className="otp-box">
        <h2>Verify Email Address</h2>
        <p><strong>OTP has been sent to {target || 'your email'}</strong></p>

        <label htmlFor="otpInput">Enter OTP</label>
        <input
          id="otpInput"
          type="password"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
        />

        <span className="resend-otp" onClick={handleResend}>Resend OTP</span>

        <div className="otp-buttons">
          <button onClick={handleVerify} className="verify-btn">Verify</button>
          <button onClick={() => navigate(-1)} className="back-btn">Back</button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;

