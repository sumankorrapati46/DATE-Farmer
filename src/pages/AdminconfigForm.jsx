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

function Adminmiddlebar({ steps, openDropdownIndex, handleDropdownToggle, handleChildSelect }) {
  return (
    <nav className="adminnav-links">
      {steps.map((step, index) => (
        <div key={index} className="adminnav-item">
          {step.children ? (
            <>
              <div
                onClick={() => handleDropdownToggle(index)}
                className={`adminnav-dropdown-toggle ${openDropdownIndex === index ? "open" : ""}`}
              >
                {step.label}
              </div>
              {openDropdownIndex === index && (
                <div className="adminnav-dropdown">
                  {step.children.map((child, childIndex) => (
                    <button
                      key={childIndex}
                      className="adminnav-subitem"
                      onClick={() => handleChildSelect(child.label)}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="adminnav-item-link">{step.label}</div>
          )}
        </div>
      ))}
    </nav>
  );
}

export default function AdminconfigForm() {
  const steps = [
    {
      label: "🏛️ User & Roles",
      children: [
        { label: "👤 User" },
        { label: "🏛️ Role" },
      ],
    },
    {
      label: "🔍 Personalization",
      children: [
        { label: "🧑‍🌾 Farmer Code", path: "/personalization/farmer-code" },
        { label: "👥 Employee Code", path: "/personalization/employee-code" },
        { label: "📧 Mail Templates", path: "/personalization/mail-templates" },
        { label: "📱 SMS Templates", path: "/personalization/sms-templates" },
      ],
    },
    { label: "⚙️ Settings" },
    { label: "📌 Preferences" },
  ];

  const methods = useForm();
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = methods;

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [selectedChild, setSelectedChild] = useState("Role"); // default view

  const handleDropdownToggle = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleChildSelect = (label) => {
    setSelectedChild(label);
    setOpenDropdownIndex(null); // close dropdown after selection
  };

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    alert(`${selectedChild} form submitted successfully!`);
  };

  const moduleOptions = [
    
    { value: "employee", label: "Employee" },
    { value: "farmer", label: "Farmer" },
  ];

  const accessOptions = [
    { value: "add", label: "Add" },
    { value: "read", label: "View" },
    { value: "write", label: "Edit" },
    { value: "delete", label: "Delete" },
  ];

  return (
    <div className="admin-container">
      <header className="admintop-bar">
          <img src={logo1} alt="Digital Agristack Logo" className="infologo-left" />
          <img src={logo2} alt="DATE Logo" className="infologo-right" />
        </header>
      <div className="adminmiddle-container">
        <Adminmiddlebar
          steps={steps}
          openDropdownIndex={openDropdownIndex}
          handleDropdownToggle={handleDropdownToggle}
          handleChildSelect={handleChildSelect}
        />
      </div>

      <div className="main-content">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
            {selectedChild === "🏛️ Role" && (
              <div className="adminform-section">
                <h2>Role Form</h2>
                <label>Role Name *</label>
                <div className="flex-row">
                  <label>
                    <input type="radio" value="Manager" {...register("role", { required: true })} /> Manager
                  </label>
                  <label>
                    <input type="radio" value="Employee" {...register("role", { required: true })} /> Employee
                  </label>
                </div>
                {errors.role && <p className="error">Role is required</p>}

                <label>Description *</label>
                <textarea {...register("description", { required: true })} />
                {errors.description && <p className="error">Description is required</p>}

                <label>Select Modules *</label>
                <Controller
                  name="modules"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select {...field} options={moduleOptions} isMulti placeholder="Mltiselect Modules" />
                  )}
                />
                {errors.modules && <p className="error">Modules are required</p>}

                <label>Define Access *</label>
                <Controller
                  name="access"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select {...field} options={accessOptions} isMulti placeholder="Select Access" />
                  )}
                />
                {errors.access && <p className="error">Access is required</p>}

                <button type="submit">Submit Role</button>
              </div>
            )}

            {selectedChild === "👤 User" && (
              <div className="adminform-section">
                <h2>User Form</h2>
                <label>User Name *</label>
                <input type="text" {...register("username", { required: true })} />
                {errors.username && <p className="error">User Name is required</p>}

                <label>Email *</label>
                <input type="email" {...register("email", { required: true })} />
                {errors.email && <p className="error">Email is required</p>}

                <label>Assign Role *</label>
                <Controller
                  name="assignedRole"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select {...field} options={[{ value: "manager", label: "Manager" }, { value: "employee", label: "Employee" }]} placeholder="Select Role" />
                  )}
                />
                {errors.assignedRole && <p className="error">Role is required</p>}

                <button type="submit">Submit User</button>
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