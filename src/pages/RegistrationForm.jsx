// RegistrationForm.jsx
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { format, parse, isValid, differenceInYears } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../styles/RegistrationForm.css";
import background from "../assets/background-image.png";
import logo from "../assets/rightlogo.png";

const dateFormat = "dd-MM-yyyy";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  dateofBirth: yup
    .string()
    .required("Date of Birth is required")
    .test("valid-format", "Enter date as DD-MM-YYYY", (value) => {
      const parsed = parse(value, dateFormat, new Date());
      return isValid(parsed);
    })
    .test("age-limit", "Age must be between 18 and 90 years", (value) => {
      const parsed = parse(value, dateFormat, new Date());
      if (!isValid(parsed)) return false;
      const age = differenceInYears(new Date(), parsed);
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
  email: yup
    .string()
    .required("Email is required")
    .matches(/^[^@]+@[^@]+\.[^@]+$/, "Email must include '@' and '.' and be valid"),
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(/@/, "Must include an '@'"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const selectedPinCode = watch("pinCode");
  const email = watch("email");
  const [emailErrorPopup, setEmailErrorPopup] = useState(false);

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (email && /^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      axios.get(`/api/auth/check-email?email=${email}`)
        .then(res => {
          if (res.data.exists) {
            setEmailErrorPopup(true);
            setError("email", {
              type: "manual",
              message: "This email is already in use"
            });
          } else {
            setEmailErrorPopup(false);
          }
        })
        .catch(err => console.error("Email check error", err));
    }
  }, 600);

  return () => clearTimeout(delayDebounce);
}, [email, setError]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all")
      .then(response => {
        const countryNames = response.data
          .map(country => country.name?.common)
          .filter(Boolean)
          .sort();
        setCountries(countryNames);
      })
      .catch(error => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      axios.get(`/api/states?countryId=${selectedCountry}`)
        .then(res => setStates(res.data))
        .catch(err => console.error("State fetch error", err));
    } else {
      setStates([]);
      setPincodes([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      axios.get(`/api/pincodes?stateId=${selectedState}`)
        .then(res => setPincodes(res.data))
        .catch(err => console.error("Pincode fetch error", err));
    } else {
      setPincodes([]);
    }
  }, [selectedState]);

  // ✅ This was outside, now placed correctly inside
  useEffect(() => {
    if (selectedPinCode) {
      axios.get(`/api/address-info?pincode=${selectedPinCode}`)
        .then(res => {
          if (res.data) {
            reset({
              ...watch(),
              state: res.data.state,
              country: res.data.country
            });
          }
        })
        .catch(err => console.error("Pincode fetch error", err));
    }
  }, [selectedPinCode]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "pinCode" && value.pinCode.length === 6) {
        axios.get(`/api/location?pincode=${value.pinCode}`)
          .then(res => {
            const { country, state } = res.data;
            setValue("country", country);
            setValue("state", state);
          })
          .catch(err => console.error("Location fetch error", err));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const onSubmit = async (data) => {
  setLoading(true);
  try {
    const checkRes = await axios.get(`/api/auth/check-email?email=${data.email}`);
    if (checkRes.data.exists) {
      setError("email", { type: "manual", message: "Email is already in use" });
      setLoading(false);
      return;
    }

    const response = await axios.post("/api/auth/register", data);

    // ⬇️ Send confirmation email
    await axios.post("/api/auth/send-confirmation-email", { email: data.email });

    setShowSuccessPopup(true);
    reset();
  } catch (error) {
    alert("Registration failed!");
    console.error(error);
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

        <div className="registration-grid">
          <div className="form-column">
            <div className="registrationform-group">
              <label>First Name *</label>
              <input {...register("firstName")} />
              <p className="error">{errors.firstName?.message}</p>
            </div>

            <div className="registrationform-group">
              <label>
    Date of Birth <span className="required">*</span>
  </label>

  <Controller
  name="dateofBirth"
  control={control}
  rules={{ required: "Date of Birth is required" }}
  render={({ field }) => (
    <DatePicker
      placeholderText="Select date"
      dateFormat="dd-MM-yyyy"
      selected={
        field.value
          ? typeof field.value === "string"
            ? parse(field.value, "dd-MM-yyyy", new Date())
            : field.value
          : null
      }
      onChange={(date) => {
        if (date) {
          const formatted = format(date, "dd-MM-yyyy");
          field.onChange(formatted);
        } else {
          field.onChange("");
        }
      }}
      maxDate={new Date()}
      showYearDropdown
      scrollableYearDropdown
      yearDropdownItemNumber={100}
    />
  )}
/>

               <p className="error">{errors.dateofBirth?.message}</p>
              </div>

            <div className="registrationform-group">
              <label>Country/Region *</label>
              <select {...register("country")}> 
                <option value="">Select Country</option>
                {countries.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
              <p className="error">{errors.country?.message}</p>
            </div>

            <div className="registrationform-group">
              <label>Pin Code *</label>
              <input {...register("pinCode")} />
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
              <input {...register("lastName")} />
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
              <select {...register("state")}> 
                <option value="">Select State</option>
                {states.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
              </select>
              <p className="error">{errors.state?.message}</p>
            </div>

            <div className="registrationform-group">
              <label>Time Zone *</label>
              <input {...register("timeZone")} />
              <p className="error">{errors.timeZone?.message}</p>
            </div>

            <div className="registrationform-group">
              <label>Phone Number *</label>
              <input {...register("phoneNumber")} />
              <p className="error">{errors.phoneNumber?.message}</p>
            </div>

            <div className="registrationform-group">
              <label>Confirm Password *</label>
              <input type="password" {...register("confirmPassword")} />
              <p className="error">{errors.confirmPassword?.message}</p>
            </div>
          </div>
        </div>

        <button type="submit" className="registersubmit-btn" disabled={loading}>
          {loading ? "Registering..." : "Register Now"}
        </button>

        {showSuccessPopup && (
          <div className="popup">
            <div className="popup-content">
              <h3>Success!</h3>
              Registration successfully completed.
              <button onClick={() => setShowSuccessPopup(false)}>
                <Link to="/login">Ok</Link>
              </button>
            </div>
          </div>
        )}

        <div className="login-link">
          <h3>
            Already a member? <Link to="/login">Login</Link>
          </h3>
        </div>
      </div>
      {emailErrorPopup && (
  <div className="popup">
    <div className="popup-content">
      <h3>Email Already Used</h3>
      This email is already associated with an account.
      <button onClick={() => setEmailErrorPopup(false)}>Close</button>
    </div>
  </div>
)}
    </form>
   
  );
};

export default RegistrationForm;


