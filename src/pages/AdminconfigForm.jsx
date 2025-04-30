import React, { useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { Routes, Route } from "react-router-dom";
import Select from 'react-select';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import adminImage from "../assets/admin.png";
import logo1 from "../assets/leftlogo.png";
import logo2 from "../assets/rightlogo.png";
import "../styles/AdminconfigForm.css"

function Adminmiddlebar({ steps, currentStep, setCurrentStep, openDropdownIndex, handleDropdownToggle }) {
    const location = useLocation();
  
    return (
      <nav className="adminnav-links">
        {steps.map((step, index) => (
          <div key={index} className="adminnav-item">
            {step.children ? (
              <>
                <div
                  onClick={() => handleDropdownToggle(index)}
                  className={`adminnav-dropdown-toggle ${openDropdownIndex === index ? "open" : ""}`}
                  style={{ cursor: "pointer" }}
                >
                  {step.label}
                </div>
                {openDropdownIndex === index && (
                  <div className="adminnav-dropdown">
                    {step.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        to={child.path}
                        className={`adminnav-subitem ${location.pathname === child.path ? "active" : ""}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={step.path}
                className={`adminnav-item-link ${location.pathname === step.path ? "active" : ""}`}
                onClick={() => setCurrentStep(index)}
              >
                {step.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    );
  }
  
  function AdminconfigForm() {
    const steps = [
      {
        label: "🏛️ User & Roles",
        children: [
          { label: "👤 User" },
          { label: "🏛️ Role" },
        ],
      },
      { label: "🔍 Personalization", path: "/personalization" },
      { label: "⚙️ Settings", path: "/settings" },
      { label: "📌 Preferences", path: "/preferences" },
    ];
  
    const methods = useForm();
    const {
      register,
      handleSubmit,
      control,
      trigger,
      formState: { errors },
    } = methods;
  
    const [selectedParent, setSelectedParent] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = steps.length;
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const location = useLocation();
  
    const handleDropdownToggle = (index) => {
      setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };
  
    const moduleOptions = [
      { value: "dashboard", label: "Dashboard" },
      { value: "reports", label: "Reports" },
      { value: "settings", label: "Settings" },
    ];
  
    const accessOptions = [
      { value: "read", label: "Read" },
      { value: "write", label: "Write" },
      { value: "admin", label: "Admin" },
    ];
  
    const onSubmit = (data) => {
      console.log("Form Submitted:", data);
      setShowSuccessPopup(true);
    };
  
    return (
      <div className="admin-container">
        <header className="admintop-bar">
          <img src={logo1} alt="Digital Agristack Logo" className="infologo-left" />
          <img src={logo2} alt="DATE Logo" className="infologo-right" />
        </header>
  
        <div className="adminmiddle-container">
          <Adminmiddlebar
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            openDropdownIndex={openDropdownIndex}
            handleDropdownToggle={handleDropdownToggle}
          />
        </div>
  
        <div className="main-content">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
              {currentStep === 0 && (
                <div className="adminform-grid">
                  {selectedParent === "🏛️ User & Roles" && (
                    <div className="children-menu">
                      {steps[0].children.map((child) => (
                        <button
                          key={child.path}
                          className={`child-btn ${selectedChild === child.path ? "active" : "/role"}`}
                          onClick={() => setSelectedChild(child.path)}
                          type="button"
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
  
                  {selectedChild === "Role" && (
                    <>
                      <div>
                        <label className="label">Role Name <span className="required">*</span></label>
                        <div className="flex gap-4">
                          <label>
                            <input
                              type="radio"
                              value="Manager"
                              {...register("role", { required: "Role is required" })}
                            /> Manager
                          </label>
                          <label>
                            <input
                              type="radio"
                              value="Employee"
                              {...register("role", { required: "Role is required" })}
                            /> Employee
                          </label>
                        </div>
                        {errors.role && <p className="error">{errors.role.message}</p>}
                      </div>
  
                      <div>
                        <label className="label">Description <span className="required">*</span></label>
                        <textarea
                          className="input"
                          placeholder="Description"
                          {...register("description", { required: "Description is required" })}
                        />
                        {errors.description && <p className="error">{errors.description.message}</p>}
                      </div>
  
                      <div>
                        <label className="label">Select Modules <span className="required">*</span></label>
                        <Controller
                          name="modules"
                          control={control}
                          rules={{ required: "Modules are required" }}
                          render={({ field }) => (
                            <Select {...field} options={moduleOptions} isMulti placeholder="Select Modules" />
                          )}
                        />
                        {errors.modules && <p className="error">{errors.modules.message}</p>}
                      </div>
  
                      <div>
                        <label className="label">Define Access <span className="required">*</span></label>
                        <Controller
                          name="access"
                          control={control}
                          rules={{ required: "Access is required" }}
                          render={({ field }) => (
                            <Select {...field} options={accessOptions} isMulti placeholder="Select Access" />
                          )}
                        />
                        {errors.access && <p className="error">{errors.access.message}</p>}
                      </div>
                    </>
                  )}
  
                  {/* Navigation Buttons */}
                  <div className="admin-btn">
                    {currentStep === 0 ? (
                      <button
                        type="button"
                        onClick={async () => {
                          const isValid = await trigger();
                          if (isValid) setCurrentStep(currentStep + 1);
                        }}
                      >
                        Next
                      </button>
                    ) : currentStep === totalSteps - 1 ? (
                      <>
                        <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>Previous</button>
                        <button type="submit">Submit</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>Previous</button>
                        <button
                          type="button"
                          onClick={async () => {
                            const isValid = await trigger();
                            if (isValid) setCurrentStep(currentStep + 1);
                          }}
                        >
                          Next
                        </button>
                      </>
                    )}
                  </div>
  
                  {showSuccessPopup && (
                    <div className="popup">
                      <div className="popup-content">
                        <h3>Success!</h3>
                        Employee form submitted successfully.
                        <button onClick={() => setShowSuccessPopup(false)}>OK</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          </FormProvider>
  
          {/* Right side image */}
          <div className="image-section">
            <img src={adminImage} alt="Admin" />
          </div>
        </div>
      </div>
    );
  }
  
  export default AdminconfigForm;