 import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/RegistrationForm.css";
import background from "../assets/background-image.png";
import logo from "../assets/rightlogo.png";
 
// Updated Yup schema for yyyy-MM-dd format
const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  dateOfBirth: yup
    .string()
    .required("Date of Birth is required")
    .test("age-range", "Age must be between 18 and 90 years", function (value) {
      if (!value) return false;
      const dob = new Date(value);
      const today = new Date();

      const ageDifMs = today - dob;
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);

      return age >= 18 && age <= 90;
    }),
  gender: yup.string().required("Gender is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  pinCode: yup
    .string()
    .matches(/^\d{6}$/, "Enter a valid 6-digit Pin Code")
    .required("Pin Code is required"),
  timeZone: yup.string().required("Time Zone is required"),
  email: yup.string()
  .required("Email is required")
  .matches(/^[^@]+@[^@]+\.[^@]+$/, "Email must include '@' and '.' and be valid"),
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
  password: yup.string()
  .required("Password is required")
  .min(6, "Password must be at least 6 characters")
  .matches(/[A-Z]/, "Must contain at least one uppercase letter")
  .matches(/\d/, "Must contain at least one number")
  .matches(/@/, "Must include an '@'"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});
 
const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const selectedState = watch("state");
  // Fetch countries
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/auth/countries")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);
  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`http://localhost:8080/api/auth/states/${selectedCountry}`)
        .then((response) => {
          setStates(response.data);
        })
        .catch((error) => console.error("Error fetching states:", error));
    } else {
      setStates([]);
    }
  }, [selectedCountry]);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
  try {
    const response = await axios.post("http://34.56.164.208:8080/api/auth/register", data);
    console.log(response.data);
    alert("Registration Successful!");
    reset(); // Clear form

    // Navigate to login after success
    navigate("/login");  // 👈 Redirects to login page
  } catch (error) {
    alert("Registration Failed!");
    console.error(error);
  }
};
 
  return (
    <form
      className="registration-page"
      onSubmit={handleSubmit(onSubmit)}
      style={{ backgroundImage: `url(${background})` }}
    >
      <img src={logo} alt="Logo" className="registration-logo" />
 
      <div className="registration-form-title">
        <h1>Let's get you started</h1>
        <h3>Enter the details to get going</h3>
      </div>
 
      <div className="registration-form-container">
        <h2>Registration Form</h2>
 
        <div className="registration-form">
          <div className="registration-grid">
            <div className="form-column">
              <div className="registrationform-group">
                <label>First Name <span className="required">*</span></label>
                <input type="text" {...register("firstName")} />
                <p className="error">{errors.firstName?.message}</p>
              </div>
 
              <div className="registrationform-group">
                <label>Date of Birth  <span className="required">*</span></label>
                <input
                  type="date"
                  placeholder="YYYY-MM-DD"
                  {...register("dateOfBirth")}
                />
                <p className="error">{errors.dateOfBirth?.message}</p>
              </div>
 
              <div className="registrationform-group">
              <label htmlFor="country-select">Select a country:</label>
<select
                id="country-select"
                {...register("country")}
                value={selectedCountry}
                onChange={(e) => {
                  const selected = e.target.value;
                  setSelectedCountry(selected);
                  setValue("country", selected);
                }}
>
<option value="">Select a country</option>
                {countries.map((country) => (
<option key={country.id} value={country.iso2}>
                    {country.name}
</option>
                ))}
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
               <label htmlFor="state-select">Select a state:</label>
  <select
    id="state-select"
    {...register("state")}
    value={selectedState}
    onChange={(e) => setValue("state", e.target.value)}
  >
    <option value="">Select a state</option>
    {states.map((state) => (
      <option key={state.id} value={state.name}>
        {state.name}
      </option>
    ))}
  </select>
                <p className="error">{errors.state?.message}</p>
              </div>
 
              <div className="registrationform-group">
                <label>Time Zone *</label>
                <input type="text" {...register("timeZone")} />
                <p className="error">{errors.timeZone?.message}</p>
              </div>
 
              <div className="registrationform-group">
                <label>Phone Number *</label>
                <input type="text" {...register("phoneNumber")} />
                <p className="error">{errors.phoneNumber?.message}</p>
              </div>
 
              <div className="registrationform-group">
                <label>Confirm Password *</label>
                <input type="password" {...register("confirmPassword")} />
                <p className="error">{errors.confirmPassword?.message}</p>
              </div>
            </div>
          </div>
        </div>
 
        <button type="submit" className="registersubmit-btn">
          Register Now
        </button>
 
        <div className="login-link">
          <h3>Already a member? <Link to="/login">Login</Link></h3>
        </div>
      </div>
    </form>
  );
};
 
export default RegistrationForm;
 
 