import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import background from "../assets/background-image.png"; // replace with your actual image
import logo from "../assets/rightlogo.png";
import illustration from "../assets/illustration1.png";
import "../styles/ForgotPassword.css"; // CSS we'll create below

const schema = Yup.object().shape({
  userInput: Yup.string()
    .required("Email/Phone/ID is required")
    .test("valid", "Enter a valid Email, Phone or ID", (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;
      return emailRegex.test(value) || phoneRegex.test(value) || value.length >= 6;
    }),
});

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    console.log(data);
    alert("Reset link has been sent if the ID is found in our records.");
  };

  return (
    <div className="ForgotPassword-page" style={{ backgroundImage: `url(${background})` }}>
      <img src={logo} alt="Logo" className="ForgotPassword-logo" />

      <div className="ForgotPassword-container">
        <h2>Forgot Password</h2>
        <p>
          Enter your email address, click “Reset password”, and we’ll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Email/Phone/ID <span className="required">*</span>
          </label>
          <input
            {...register("userInput")}
            placeholder="Enter your Email or Phone or ID"
          />
          {errors.userInput && <p className="error">{errors.userInput.message}</p>}

          <button type="submit">Reset password</button>
        </form>
      </div>

      <div className="ForgotPassword-image">
        <img src={illustration} alt="Illustration" />
      </div>
    </div>
  );
};

export default ForgotPassword;
