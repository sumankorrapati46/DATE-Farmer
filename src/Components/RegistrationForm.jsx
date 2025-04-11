import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const RegistrationForm = () => {
  const [submissionMessage, setSubmissionMessage] = useState('');

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    displayName: Yup.string().required('Display name is required'),
    username: Yup.string()
      .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed')
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Must contain at least one number')
      .required('Password is required'),
    gender: Yup.string().required('Gender is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    language: Yup.string().required('Language is required'),
    timezone: Yup.string().required('Timezone is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post('http://localhost:5000/register', values, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Success:', response.data);
      setSubmissionMessage('Registration successful!');
      resetForm();
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setSubmissionMessage('Registration failed. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="registration-container">
      <center><h1>ProfilePage</h1></center>

      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          displayName: '',
          email: '',
          password: '',
          gender: '',
          country: '',
          state: '',
          language: '',
          timezone: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="registration-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <Field name="firstName" type="text" />
              <ErrorMessage name="firstName" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <Field name="lastName" type="text" />
              <ErrorMessage name="lastName" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <Field name="displayName" type="text" />
              <ErrorMessage name="displayName" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <Field as="select" name="gender">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Field>
              <ErrorMessage name="gender" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <Field name="country" type="text" />
              <ErrorMessage name="country" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <Field name="state" type="text" />
              <ErrorMessage name="state" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="language">Language</label>
              <Field name="language" type="text" />
              <ErrorMessage name="language" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="timezone">Timezone</label>
              <Field name="timezone" type="text" />
              <ErrorMessage name="timezone" component="div" className="error" />
            </div>

            {/* Buttons in One Row */}
            <div className="button-group">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Save'}
              </button>

              <button type="button" onClick={() => window.location.reload()} className="cancel-btn">
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {submissionMessage && <p className="submission-message">{submissionMessage}</p>}
    </div>
  );
};

export default RegistrationForm;
