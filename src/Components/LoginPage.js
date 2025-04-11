import React, { useRef, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa"; 

const UserProfileIcon = ({ size = 40, color = "blue" }) => {
  return <FaUserCircle size={size} color={color} />;
};

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const LOGIN_URL = "/login";

const validationSchema = Yup.object({
  usernameOrEmail: Yup.string()
    .required("Required")
    .test(
      "isValidUsernameOrEmail",
      "Invalid username or email format",
      (value) => value && (USER_REGEX.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    ),
  password: Yup.string()
    
    .matches(
      PWD_REGEX,
      "Password must be 8-24 characters, include uppercase, lowercase, number & special character."
    ),
});

const LoginPage = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  return (
    <Formik
      initialValues={{ usernameOrEmail: "", password: "" }}
      validationSchema={validationSchema}
      validateOnMount 
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await axios.post(
            LOGIN_URL,
            { user: values.usernameOrEmail, pwd: values.password },
            { headers: { "Content-Type": "application/json" }, withCredentials: true }
          );
          console.log(response.data);
          setSuccess(true);
        } catch (err) {
          if (!err?.response) setErrMsg("No Server Response");
          else if (err.response?.status === 409) setErrMsg("Username Taken");
          else setErrMsg("You Don't Have Account Please Register");
          errRef.current?.focus();
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) =>
        success ? (
          <section>
            <h1>Success!</h1>
            <p>
              <a href="http://localhost:5000">Login</a>
            </p>
          </section>
        ) : (
          <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
              {errMsg}
            </p>
            
            <Form>
              <center>
                <h1>Login</h1>
              </center>

              <div>
                 <label htmlFor="usernameOrEmail"></label>
                <Field name="usernameOrEmail" type="text" placeholder="Enter Username or Email" innerRef={userRef} />
                <UserProfileIcon size={20} color="black" />
                <ErrorMessage name="usernameOrEmail" component="div" className="error" />
              </div>

               <div className="remember-forgot">
                 <a href="http://localhost:3001/forgot-username">Forgot Username or Email?</a>
               </div>


              <div>
                <label htmlFor="password"></label>
                <Field name="password" type="password" placeholder="Enter Password" />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <div className="remember-forgot">
                <a href="http://localhost:3001/forgot-password">Forgot Password?</a>
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <div className="register-link">
                <p>
                  Don't have an account? <a href="http://localhost:3001/register">Register</a>
                </p>
              </div>
            </Form>
          </section>
        )
      }
    </Formik>
  );
};

export default LoginPage; 
