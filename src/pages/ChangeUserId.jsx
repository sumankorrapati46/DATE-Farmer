import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import "../styles/Change.css";
import background from "../assets/background-image.png"; // Adjust path if needed
import logo from "../assets/rightlogo.png"; // Replace with your actual logo

 
const ChangeUserId = () => {
  const [newUserId, setNewUserId] = useState('');
  const [confirmUserId, setConfirmUserId] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

const handleChangeUserId = async () => {
  if (!newUserId || !confirmUserId) {
    setError('Both fields are required.'); 
    return;
  } else if (newUserId !== confirmUserId) {
    setError('User IDs do not match.');
    return;
  }

  setError('');

  try {
    const response = await axios.post('https://your-api-url.com/api/change-user-id', {
      userId: newUserId
    });

    if (response.status === 200) {
      alert(`User ID changed successfully to: ${newUserId}`);
      navigate('/login');
    } else {
      setError('Something went wrong. Please try again.');
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      setError(error.response.data.message);
    } else {
      setError('Failed to change User ID. Please try again.');
    }
  }
};

  return (
    <div className="change-userid-container" style={{ backgroundImage: `url(${background})` }}>
       <img src={logo} alt="Logo" className="otp-logo" />
      <div className="change-userid-box">
        <h2>User ID</h2>
          <h4>Set a strong User id to prevent unauthorized access to your account.</h4>

        <label htmlFor="newUserId">New User ID</label>
        <input
          id="newUserId"
          type="text"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
        />

        <label htmlFor="confirmUserId">Confirm User ID</label>
        <input
          id="confirmUserId"
          type="text"
          value={confirmUserId}
          onChange={(e) => setConfirmUserId(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <button className="change-btn" onClick={handleChangeUserId}>
          Change User ID
        </button>
      </div>
    </div>
  );
};

export default ChangeUserId;
