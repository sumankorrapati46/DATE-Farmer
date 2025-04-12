import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "../styles/ForgotUser.css";
import background from "../assets/background-image.png";
import logo from "../assets/rightlogo.png";
import illustration1 from "../assets/illustration1.png";


// Validation schema
const schema = Yup.object().shape({
  userInput: Yup.string()
    .required("Email/Phone/ID is required")
    .test("is-valid", "Enter a valid Email or Phone or ID", (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;
      return emailRegex.test(value) || phoneRegex.test(value) || value.length >= 6;
    }),
});

const ForgotUserId = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    alert("Reset link has been sent to your email/phone if it exists in our records.");
  };

  return (
    <div className="ForgotUserId-page" style={{ backgroundImage: `url(${background})` }}>
      <img src={logo} alt="Logo" className="ForgotUserId-logo" />
        {/* Left side: Form */}
        <div className="ForgotUserId-left">
          <h2 className="text-2xl font-bold mb-4">Forgot User ID</h2>
          <p className="mb-6">
            Enter your email address, click “Forgot User Id”, and we'll send you a link to reset your user ID.
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block mb-1 font-medium">
              Email/Phone/ID <span className="text-red-600">*</span>
            </label>
            <input
              {...register("userInput")}
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter your Email or Phone or ID"
            />
            {errors.userInput && (
              <p className="text-red-600 text-sm mb-4">{errors.userInput.message}</p>
            )}

            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
            >
              Reset password
            </button>
          </form>
        </div>

        {/* Right side: Illustration */}
        <div className="ForgotUser-image">
          <img src={illustration1} alt="ForgotUser Illustration" />
        </div>
      </div>
  );
};

export default ForgotUserId;
