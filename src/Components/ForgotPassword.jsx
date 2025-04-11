import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ForgotPassword = () => {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must include at least one uppercase letter")
      .matches(/[a-z]/, "Must include at least one lowercase letter")
      .matches(/[0-9]/, "Must include at least one number")
      .matches(/[@$!%*?&]/, "Must include at least one special character (@$!%*?&)")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Form Submitted:", values);
      }}
    >
      <Form>
        <h2>Reset Password</h2>

        {/* Email Field */}
        <div>
          <label htmlFor="email">Registered Email</label>
          <Field name="email" type="email" placeholder="Enter your email" />
          <ErrorMessage name="email" component="div" className="error" />
        </div>

        {/* New Password Field */}
        <div>
          <label htmlFor="password">New Password</label>
          <Field name="password" type="password" placeholder="Enter new password" />
          <ErrorMessage name="password" component="div" className="error" />
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <Field name="confirmPassword" type="password" placeholder="Confirm new password" />
          <ErrorMessage name="confirmPassword" component="div" className="error" />
        </div>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default ForgotPassword;
