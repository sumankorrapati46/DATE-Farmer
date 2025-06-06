import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import "../styles/Change.css";
import background from "../assets/background-image.png"; // Adjust path if needed
import logo from "../assets/rightlogo.png"; // Replace with your actual logo

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[!@#$%^&*]/, 'Must include a special character (!@#$%^&*)'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // ✅ Setup useForm
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  // ✅ Submit handler
  const onSubmit = async (data) => {
    try {
      await fetch('http://localhost:8080/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: data.password }),
      });

      alert('Password changed successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to change password');
    }
  };

  return (
    <div className="password-container" style={{ backgroundImage: `url(${background})` }}>
      <img src={logo} alt="Logo" className="password-logo" />
      <div className="password-box">
        <h2>Password</h2>
        <h4>Set a strong password to prevent unauthorized access to your account.</h4>

        <form onSubmit={handleSubmit(onSubmit)} className="change-pass">
          <div className="input-wrapper">
            <label>New Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
              />
              <span onClick={() => setShowPassword(!showPassword)}>👁️</span>
            </div>
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          <div className="input-wrapper">
            <label>Confirm New Password</label>
            <div className="password-field">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword")}
              />
              <span onClick={() => setShowConfirm(!showConfirm)}>👁️</span>
            </div>
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" className="change-btn">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
