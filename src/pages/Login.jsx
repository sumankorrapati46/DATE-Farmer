import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import "../styles/Login.css"; 
import background from "../assets/background-image.png";
import logo from "../assets/rightlogo.png";
import illustration from "../assets/illustration.png"; 
import { loginUser } from "../api/apiService";
import { useNavigate } from "react-router-dom";
 

const schema = yup.object().shape({
  userName: yup.string()
    .required("Email is required")
    .matches(/^[^@]+@[^@]+\.[^@]+$/, "Email must include '@' and '.' and be valid"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});
 
const Login= () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();
 const onSubmit = async (data) => {
  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", data);
    console.log("Login Response:", response.data);

    if (response.data && response.data.token) {
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard"); 
    } else {
      alert("Login failed. Please check your credentials.");
      console.error("Token missing in response:", response.data);
    }

  } catch (error) {
    alert("Login Failed!");
    console.error(error);
  }
};

 
  return (
    <div className="login-container" style={{ backgroundImage: `url(${background})` }}>
      <img src={logo} alt="Logo" className="logo" />  
      <div className="login-content">
       
        <div className="login-form">
          <h2>Login to your account</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="login-form-row">
              <div className="loginform-group">
                <label>Email *</label>
                <input type="text" {...register("userName")} />
                <p className="login-error">{errors.userName?.message}</p>
              </div>
              <div className="loginform-group">
                <label>Password *</label>
                
                <input type="password" {...register("password")}/>
                <p className="login-error">{errors.password?.message}</p>
              </div>
            </div>
 
           <button type="submit" className="login-btn" disabled={isSubmitting}>
  {isSubmitting ? "Logging in..." : "Login"}
</button>
            <div className="loginform-links">
              <a href="/forgot-password">Forgot your password?</a>
              <a href="/forgot-username">Forgot your ID?</a>
            </div>
          </form>
        </div>
        </div>

        <div className="login-image">
          <img src={illustration} alt="Login Illustration" />
        </div>
     </div>
  );
};
 
export default Login;