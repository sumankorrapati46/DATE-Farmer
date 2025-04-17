import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import "../styles/RegistrationForm.css";
import background from "../assets/background-image.png";
import logo from "../assets/rightlogo.png";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  dateOfBirth: yup.string().required("Date of Birth is required"),
  gender: yup.string().required("Gender is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  pinCode: yup.string().matches(/^\d{6}$/, "Enter a valid 6-digit Pin Code").required("Pin Code is required"),
  timeZone: yup.string().required("Time Zone is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  phone: yup.string().matches(/^\d{10}$/, "Enter a valid 10-digit phone number").required("Phone number is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Confirm Password is required"),
});

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const onSubmit = async (data) => {
    try {
      setLoading(true); // Optional: show loader/spinner
  
      // Simulate API delay (e.g., 2 seconds) with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 2000));
  
      // After the "mock" delay, you can consider it successful
      console.log("Mock API response:", data);
  
      setShowSuccessPopup(true); // Show popup after "successful" submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <form className="registration-page" onSubmit={handleSubmit(onSubmit)} style={{ backgroundImage: `url(${background})` }}>
      
      <img src={logo} alt="Logo" className="registration-logo" />

      <div className="registration-form-title">
        <h1>Let's get you started</h1>
        <h3>Enter the details to get going</h3>
        </div>
      <div className="registration-form-container">
        <h2>Registration Form</h2>

        <div className="registration-form" onSubmit={handleSubmit(onSubmit)}> 
          <div className="registration-grid">
            <div className="form-column">
              <div className="registrationform-group">
                <label>First Name *</label>
                <input type="text" {...register("firstName")} />
                <p className="error">{errors.firstName?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Date of Birth *</label>
                <input type="date" {...register("dateOfBirth")} />
                <p className="error">{errors.dateOfBirth?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Country/Region *</label>
                <select {...register("country")}>
                  <option value="">Select</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
                <p className="error">{errors.country?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Pin Code *</label>
                <input type="text" {...register("pinCode")} />
                <p className="error">{errors.pinCode?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Email Address *</label>
                <input type="email" {...register("email")} />
                  
                <p className="error">{errors.email?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Create Password *</label>
                <input type="password" {...register("password")} />
                <p className="error">{errors.password?.message}</p>
              </div>
            </div>

            
            <div className="form-column">
              <div className="registrationform-group">
                <label>Last Name *</label>
                <input type="text" {...register("lastName")} />
                <p className="error">{errors.lastName?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Gender *</label>
                <select {...register("gender")}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <p className="error">{errors.gender?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>State *</label>
                <input type="text" {...register("state")} />
                <p className="error">{errors.state?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Time Zone *</label>
                <input type="text" {...register("timeZone")} />
                <p className="error">{errors.timeZone?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Phone Number *</label>
                <input type="text" {...register("phone")} />
                <p className="error">{errors.phone?.message}</p>
              </div>

              <div className="registrationform-group">
                <label>Confirm Password *</label>
                <input type="password" {...register("confirmPassword")} />
                <p className="error">{errors.confirmPassword?.message}</p>
              </div>
            </div>
          </div>
        </div>
        <button type="submit" disabled={loading} className="submit-btn">
        <button type="submit">Submit</button>
              </button>

              {showSuccessPopup && (
  <div className="popup">
    <div className="popup-content">
      <h3>Success!</h3>
      <p>Registration successfully completed.</p>
      <button onClick={() => setShowSuccessPopup(false)}>OK</button>
    </div>
  </div>
)}
      </div>
    </form>
  );
};

export default RegistrationForm;

