import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import axios from "axios";
import * as Yup from 'yup';
import sampleImage from "../assets/tractor.png";
import logo1 from "../assets/leftlogo.png";
import logo2 from "../assets/rightlogo.png";
import "../styles/EmployeeDetails.css";

function EmployeeDetails() {
  const steps = [
    "🏛️ Employee Details",
    "🔍  Contact Details",
    "👨‍🌾 Other Details",
    "📌 Adress",
    "👨‍🌾 Professional Details",
    "💧 Bank Details",
    "📄 Documents",
    "Portal Access",
    
    
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps.length;
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const methods = useForm();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    setShowSuccessPopup(true);
  };

  const [photoPreview, setPhotoPreview] = useState(null);

const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setPhotoPreview(URL.createObjectURL(file));
  }
};

const API_BASE_URL = "https://your-api.com/api/employees";

const submitStepData = async (stepData, stepIndex) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/step${stepIndex + 1}`, stepData);
    console.log(`Step ${stepIndex + 1} submitted:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error in step ${stepIndex + 1}:`, error.response?.data || error.message);
    throw error;
  }
};
const [states, setStates] = useState([]);
const [countries, setCountries] = useState([]);
const [districts, setDistricts] = useState([]);
const [blocks, setBlocks] = useState([]);
const [villages, setVillages] = useState([]);

const country = watch("address.country");
const state = watch("address.state");
const district = watch("address.district");
const block = watch("address.block");

const addressSchema = Yup.object().shape({
    address: Yup.object().shape({
      country: Yup.string().required('Country is required'),
      state: Yup.string().required('State is required'),
      district: Yup.string().required('District is required'),
      block: Yup.string().required('Block (mandal) is required'),
      village: Yup.string().required('Village is required'),
      zipcode: Yup.string()
        .required('Zipcode is required')
        .matches(/^[0-9]{6}$/, 'Zipcode must be 6 digits'),
    }),
  });

// Fetch countries on load
useEffect(() => {
  axios.get("https://restcountries.com/v3.1/all").then((res) => {
    const countryList = res.data.map((c) => c.name.common).sort();
    setCountries(countryList);
  });
}, []);



  return (
    <div className="employee-container">
      <header className="employeetop-bar">
        <img src={logo1} alt="Digital Agristack Logo" className="infologo-left" />
        <img src={logo2} alt="DATE Logo" className="infologo-right" />
      </header>

      <div className="employeemiddle-container">
        <nav className="employeenav-links">
          {steps.map((label, index) => (
            <div
              key={index}
              className={`employeenav-item ${index === currentStep ? "active" : ""}`}
              onClick={() => setCurrentStep(index)}
              style={{ cursor: "pointer" }}
            >
              {label}
            </div>
          ))}
        </nav>
      </div>
         <u><h2 className="form-title">
          {steps[currentStep].replace(/^[^\w]+/, "").trim()}
         </h2></u>
      <div className="main-content">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="employee-form">
            {currentStep === 0 && (
  <div className="employeeform-grid">
    <div className="frame-photo">
  <label className="label">
    Photo <span className="optional">(Optional)</span>
  </label>
  <div className="photo-box">
    {photoPreview ? (
      <img src={photoPreview} alt="Preview" className="photo-preview" />
    ) : (
      "Photo"
    )}
  </div>
  
 <div>
  <input
    type="file"
    accept="image/*"
    {...register("photo")}
    onChange={(e) => {
      handlePhotoChange(e);
      // Keep react-hook-form handling
      register("photo").onChange(e);
    }}
    className="input"
  />

  {errors.photo && <p className="error">{errors.photo.message}</p>}
  </div>
  </div>

    {/* Gender */}
    <div>
      <label className="label">Gender<span className="required">*</span></label>
      <select
        className="input"
        {...register("gender", { required: "Gender is required" })}
      >
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Transgender">Transgender</option>
      </select>
      {errors.gender && <p className="error">{errors.gender.message}</p>}
    </div>

    {/* First Name */}
    <div>
      <label className="label">First Name<span className="required">*</span></label>
      <input
        className="input"
        placeholder="First Name"
        {...register("firstName", { required: "First Name is required" })}
      />
      {errors.firstName && <p className="error">{errors.firstName.message}</p>}
    </div>

    {/* Salutation */}
    <div>
      <label className="label">Salutation<span className="required">*</span></label>
      <select
        className="input"
        {...register("salutation", { required: "Salutation is required" })}
      >
        <option value="">Select</option>
        <option value="Mr">Mr</option>
        <option value="Mrs.">Mrs.</option>
        <option value="Ms.">Ms.</option>
        <option value="Miss.">Miss.</option>
        <option value="Dr.">Dr.</option>
      </select>
      {errors.salutation && <p className="error">{errors.salutation.message}</p>}
    </div>

    {/* Middle Name */}
    <div>
      <label className="label">Middle Name<span className="required">*</span></label>
      <input
        className="input"
        placeholder="Middle Name"
        {...register("middleName", { required: "Middle Name is required" })}
      />
      {errors.middleName && <p className="error">{errors.middleName.message}</p>}
    </div>

    {/* Nationality */}
    <div>
      <label className="label">Nationality<span className="required">*</span></label>
      <select
        className="input"
        {...register("nationality", { required: "Nationality is required" })}
      >
        <option value="">Select</option>
        <option value="Indian">Indian</option>
      </select>
      {errors.nationality && <p className="error">{errors.nationality.message}</p>}
    </div>

    {/* Last Name */}
    <div>
      <label className="label">Last Name<span className="required">*</span></label>
      <input
        className="input"
        placeholder="Last Name"
        {...register("lastName", { required: "Last Name is required" })}
      />
      {errors.lastName && <p className="error">{errors.lastName.message}</p>}
    </div>

    {/* DOB */}
    <div>
      <label className="label">DOB<span className="required">*</span></label>
      <input
        type="date"
        className="input"
        {...register("dob", { required: "Date of Birth is required" })}
      />
      {errors.dob && <p className="error">{errors.dob.message}</p>}
    </div>
  </div>
)}
            {/* Step 1: Contact Details */}
            {currentStep === 1 && (
              <div className="form-one">
                <div>
                <label className="label">Contact Number
                    <span className="required">*</span></label>
                  <input
                    type="text"
                     className="input"
                    {...register("contactNumber", {
                      required: "Contact Number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter a valid 10-digit number",
                      },
                    })}
                    placeholder=""
                  />
                  <p className="error">{errors.contactNumber?.message}</p>
                </div>

                <div>
                <label className="label"> Email
                 <span className="required">*</span></label>
                  <input
                    type="email"
                    className="input"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder=""
                  />
                  <p className="error">{errors.email?.message}</p>
                </div>
              </div>
            )}

{currentStep === 2 && (
  <div className="form-two">
    <div>
    
  <label className="label" htmlFor="relation">
    Select <span className="required">*</span>
  </label>
  <select
    id="relation"
    className="input"
    {...register("relation", { required: "Please select a relation" })}
  >
    <option value="">-- Select --</option>
    <option value="do">D/O</option>
    <option value="so">S/O</option>
    <option value="wo">W/O</option>
  </select>
  {errors.relation && <p className="error">{errors.relation.message}</p>}
</div>


    <div>
      <label className="label">Father Name</label>
      <input
        type="text"
        placeholder="Krishna Kumar"
        className="input"
        {...register("fatherName")}
      />
    </div>

    <div>
      <label className="label">Alternative Number</label>
      <input
        type="text"
        placeholder="91-987xxxxxx16"
        className="input"
        {...register("altNumber")}
      />
    </div>

    <div>
      <label className="label">Alternative No. Type</label>
      <input
        type="text"
        placeholder="Father (Relative)"
        className="input"
        {...register("altNumberType")}
      />
    </div>
  </div>
)}

{currentStep === 3 && (
        <div className="form-three">
          <div>
            <label> Country <span className="required">*</span></label>
            <select {...register("address.country")} className="input">
              <option value="">Select Country</option>
              {countries.map((c) => <option key={c}>{c}</option>)}
            </select>
            <p className="error">{errors.address?.country?.message}</p>
          </div>

          <div>
            <label className="label">State <span className="required">*</span></label>
            <select {...register("address.state")} className="input">
              <option value="">Select State</option>
              {states.map((s) => <option key={s}>{s}</option>)}
            </select>
            <p className="error">{errors.address?.state?.message}</p>
          </div>

          <div>
            <label className="label">District <span className="required">*</span></label>
            <select {...register("address.district")} className="input">
              <option value="">Select District</option>
              {districts.map((d) => <option key={d}>{d}</option>)}
            </select>
            <p className="error">{errors.address?.district?.message}</p>
          </div>

          <div>
            <label className="label">Block (mandal) <span className="required">*</span></label>
            <select {...register("address.block")} className="input">
              <option value="">Select Block</option>
              {blocks.map((b) => <option key={b}>{b}</option>)}
            </select>
            <p className="error">{errors.address?.block?.message}</p>
          </div>

          <div>
            <label className="label">Village <span className="required">*</span></label>
            <select {...register("address.village")} className="input">
              <option value="">Select Village</option>
              {villages.map((v) => <option key={v}>{v}</option>)}
            </select>
            <p className="error">{errors.address?.village?.message}</p>
          </div>

          <div>
            <label className="label">Zipcode <span className="required">*</span></label>
            <input
              type="text"
              placeholder="56xxxx"
              className="input"
              {...register("address.zipcode")}
            />
            <p className="error">{errors.address?.zipcode?.message}</p>
          </div>
        </div>
      )}


{currentStep === 4 && (
  <div className="form-four">
    <div>
      <label className="label">Education</label>
      <select className="input" {...register("professional.education")}>
        <option value="">Select</option>
        <option value="Primary Schooling">Primary Schooling</option>
        <option value="High School">High School</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Degree">Degree</option>
        <option value="Graduate">Graduate</option>
        <option value="Post-Graduate">Post-Graduate</option>
      </select>
    </div>

    <div>
      <label className="label">Experience</label>
      <input
        type="text"
        placeholder="15 Years"
        className="input"
        {...register("professional.experience")}
      />
    </div>
  </div>
)}

{currentStep === 5 && (
  <div className="form-five">
    <div>
      <label className="label">Bank Name</label>
      <input
        type="text"
        placeholder="HDFC Bank"
        className="input"
        {...register("bank.bankName")}
      />
    </div>

    <div>
      <label className="label">Account Number</label>
      <input
        type="text"
        placeholder="281398301653"
        className="input"
        {...register("bank.accountNumber")}
      />
    </div>

    <div>
      <label className="label">Branch name</label>
      <input
        type="text"
        placeholder="Madhapur"
        className="input"
        {...register("bank.branchName")}
      />
    </div>

    <div>
      <label className="label">IFSC Code</label>
      <input
        type="text"
        placeholder="HDFC0028"
        className="input"
        {...register("bank.ifscCode")}
      />
    </div>

    <div>
      <label className="label">Passbook</label>
      <input
        type="file"
        className="input"
        {...register("bank.passbook")}
      />
    </div>
  </div>
)}

{currentStep === 6 && (
  <div className="form-six">
    <div>
      <label className="label">Add Document</label>
      <select className="input" {...register("documents.documentType")}>
        <option value="">Select</option>
        <option value="voter">ID/ Voter Card</option>
        <option value="aadhar">Aadhar Number</option>
        <option value="pan">PAN Number</option>
      </select>
    </div>

    <div>
      <label className="label">Upload</label>
      <input
        type="file"
        className="input"
        {...register("documents.file")}
      />
    </div>
  </div>
)}

{currentStep === 7 && (
  <div className="form-seven">
    <div>
      <label className="label">
        Role/Designation <span className="required">*</span>
      </label>
      <select className="input" {...register("portalAccess.role", { required: true })}>
        <option value="">Select</option>
        <option value="manager">Manager</option>
        <option value="employee">Employee</option>
      </select>
    </div>

    <div>
      <label className="label">
        Access <span className="required">*</span>
      </label>
      <select className="input" {...register("portalAccess.status", { required: true })}>
        <option value="">Select</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  </div>
)}


            {/* TODO: Add Steps 2 - 6 here */}

            <div className="employee-btn">
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
                  <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
                    Previous
                  </button>
                  <button type="submit">Submit</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
                    Previous
                  </button>
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
          </form>
        </FormProvider>

        {/* Right: Image Section */}
        <div className="image-section">
          <img src={sampleImage} alt="Tractor" />
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;

