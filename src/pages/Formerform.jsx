import React, { useState } from "react"; // Import React and useState
import { useForm, FormProvider, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import Select from 'react-select';
import * as yup from 'yup';
import { parse, isValid, differenceInYears } from "date-fns";
import farmImage from "../assets/farmImage.png";
import "../styles/Farmerform.css";


const stepSchemas = [
  yup.object().shape({
    firstName: yup.string().required("First Name is required").matches(/^[A-Za-z]{2,26}$/, "First Name must be 2–26 letters only"),
    middleName: yup.string().required("Middle Name is required").matches(/^[A-Za-z]*$/, "Middle Name must contain only letters"),
    lastName: yup.string().required("Last Name is required").matches(/^[A-Za-z]{2,26}$/, "Last Name must be 2–26 letters only"),
    gender: yup.string().required("Gender is required"),
    salutation: yup.string().oneOf(["D/O", "S/O", "W/O"], "Please select a valid salutation").required("Salutation is required"),
    nationality: yup.mixed()
  .required("Nationality is required")
  .transform((value) => (value?.value ? value.value : value))
  .test("is-string", "Nationality must be a string", (value) => typeof value === "string"),
    dob: yup.string().required("Date of Birth is required")
      .test("valid-format", "Enter date as DD/MM/YYYY", (value) => {
        const parsed = parse(value, "dd/MM/yyyy", new Date());
        return isValid(parsed);
      })
      .test("age-limit", "Age must be between 18 and 90 years", (value) => {
        const parsed = parse(value, "dd/MM/yyyy", new Date());
        if (!isValid(parsed)) return false;
        const age = differenceInYears(new Date(), parsed);
        return age >= 18 && age <= 90;
      }),
    fatherName: yup.string().required("Father Name is required"),
    alternativeNumber: yup.string()
      .nullable()
      .notRequired()
      .matches(/^\d{10}$/, "Enter a valid 10-digit alternative number")
      .transform((value, originalValue) => (originalValue.trim() === "" ? null : value)),
    contactNumber: yup.string()
      .nullable()
      .notRequired()
      .matches(/^\d{10}$/, "Enter a valid 10-digit contact number")
      .transform((value, originalValue) => (originalValue.trim() === "" ? null : value)),
    alternativeType: yup.string().required("Alternative type is required").oneOf(["Father", "Mother", "Brother", "Sister", "Son", "Daughter", "Spouse", "Other"], "Select a valid alternative type"),
  }),
  // Add other step schemas
  // Step 2: Address
  yup.object().shape({
    country: yup.string().required("Country is required"),
    state: yup.string().required("State is required"),
    district: yup.string().required("District is required"),
    block: yup.string().required("Block (mandal) is required"),
    village: yup.string().required("Village is required"),
    pincode: yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Pincode must be a 6-digit number"),
  }),

  // Step 3: Professional Information
  yup.object().shape({
    education: yup.string().required("Education is required"),
    experience: yup.string().required("Experience is required"),
  }),

  // Step 4: Current Crop
  yup.object().shape({
    surveyNumber: yup.string().required("Survey Number is required"),
    totalLandHolding: yup.string().required("Total Land Holding is required"),
    geoTag: yup.string().required("Geo-tag is required"),
    selectCrop: yup.string().required("Crop selection is required"),
    netIncome: yup.string().required("Net Income is required"),
    soilTest: yup.string().required("Soil Test is required"),
    soilTestCertificate: yup.mixed().required("Soil Test Certificate is required"),
  }),
];

// usage in component

const steps = ["Personal Information", "Address","Professional Information","Current Crop Information",];

const FarmerForm = ({ currentStep, setCurrentStep }) => {
  const totalSteps = steps.length;
  const [photoPreview, setPhotoPreview] = useState(" ");
  
  // Handle photo change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  };

  const methods = useForm({
    resolver: yupResolver(stepSchemas[currentStep]),
    mode: "onChange",
  });
 const { register, control, handleSubmit, formState: { errors }, watch, trigger } = methods;

 const onSubmit = async (data) => {
  try {
    setLoading(true); // Optional: show loader/spinner

    // Simulate API delay (e.g., 2 seconds) with setTimeout
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // After the "mock" delay, you can consider it successful
    console.log("Mock API response:", data);

    setShowSuccessPopup(true); // Show popup after "successful" submission
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Submission failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const countryOptions = [
    { value: "India", label: "India" },
    { value: "United States", label: "United States" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Canada", label: "Canada" },
    { value: "Australia", label: "Australia" },
    // Add more countries as needed
  ];

  
      

  return (
    <div className="form-wrapper">
      <div className="form-full">
        <h2>{steps[currentStep]}</h2>
  
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 0 && (
              <div className="form-grid">
                <div className="field-left">
                  <div className="form-group photo-group">
                    <label>Photo <span className="optional">(Optional)</span></label>
                    <div className="photo-box">
                      {photoPreview ? <img src={photoPreview} alt="Preview" className="photo-preview" /> : <span className="photo-placeholder">No photo selected</span>}
                    </div>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="photo-input" />
                  </div>
  
                  <label>First Name <span className="required">*</span>
                    <input type="text" {...register("firstName")} />
                  </label>
                  <p className="error">{errors.firstName?.message}</p>
  
                  <label>Middle Name <span className="optional">*</span>
                    <input type="text" {...register("middleName")} />
                  </label>
                  <p className="error">{errors.middleName?.message}</p>
  
                  <label>Last Name <span className="required">*</span>
                    <input type="text" {...register("lastName")} />
                  </label>
                  <p className="error">{errors.lastName?.message}</p>
  
                  <label>Gender <span className="required">*</span>
                    <select {...register("gender")}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                  </label>
                  <p>{errors.gender?.message}</p>
                </div>
  
                <div className="field-right">
                  <label>Salutation <span className="required">*</span>
                    <select {...register("salutation")}>
                      <option value="">Select Salutation</option>
                      <option value="D/O">D/O</option>
                      <option value="S/O">S/O</option>
                      <option value="W/O">W/O</option>
                    </select>
                  </label>
                  <p>{errors.salutation?.message}</p>
  
                  <label>Nationality <span className="required">*</span>
                    <Controller
                      name="nationality"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={countryOptions}
                          isSearchable
                          placeholder="Select your nationality"
                          classNamePrefix="react-select"
                        />
                      )}
                    />
                  </label>
                  <p className="error">{errors.nationality?.message}</p>
  
                  <label>Date of Birth (DD/MM/YYYY) <span className="required">*</span>
                    <input type="text" {...register("dob")} placeholder="DD/MM/YYYY" />
                  </label>
                  <p className="error">{errors.dob?.message}</p>
  
                  <label>Father Name <span className="required">*</span>
                    <input type="text" {...register("fatherName")} />
                  </label>
                  <p>{errors.fatherName?.message}</p>
  
                  <label>Alternative Number <span className="optional">(Optional)</span>
                    <input type="number" {...register("alternativeNumber")} placeholder="Enter alternative 10-digit number" />
                  </label>
                  <p>{errors.alternativeNumber?.message}</p>
  
                  <label>Contact Number <span className="optional">(Optional)</span>
                    <input type="number" {...register("contactNumber")} placeholder="Enter 10-digit contact number" />
                  </label>
                  <p className="error">{errors.contactNumber?.message}</p>
  
                  <label>Alternative Type <span className="required">*</span>
                    <select {...register("alternativeType")}>
                      <option value="">Select Relation</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <p className="error">{errors.alternativeType?.message}</p>
                </div>
              </div>
            )}
  
            {currentStep === 1 && (
              <div className="address-field">
                <label>Country <span className="required">*</span>
                  <input {...register("country")} />
                </label>
                <p>{errors.country?.message}</p>
  
                <label>State <span className="required">*</span>
                  <input {...register("state")} />
                </label>
                <p>{errors.state?.message}</p>
  
                <label>District <span className="required">*</span>
                  <input {...register("district")} />
                </label>
                <p>{errors.district?.message}</p>
  
                <label>Block (mandal) <span className="required">*</span>
                  <input {...register("block")} />
                </label>
                <p>{errors.block?.message}</p>
  
                <label>Village <span className="required">*</span>
                  <input {...register("village")} />
                </label>
                <p>{errors.village?.message}</p>
  
                <label>Pincode <span className="required">*</span>
                  <input {...register("pincode")} />
                </label>
                <p>{errors.pincode?.message}</p>
              </div>
            )}

{currentStep === 2 && (
                <>
              <div className="profes-field">
                <label>Education <span className="required">*</span></label>
                <select {...register("education")}>
                  <option value="">Select</option>
                  <option value="Primary Schooling">Primary Schooling</option>
                  <option value="High School">High School</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Degree">Degree</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post-Graduate">Post-Graduate</option>
                </select>
                <p>{errors.occupation?.message}</p>

                <label>Experience <span className="required">*</span>
                  <input {...register("experience")} placeholder="e.g. 15 Years" />
                </label>
                <p>{errors.experience?.message}</p>
              </div>
              </>
            )}

            {currentStep === 3 && (
                <>
               <div className="current-field">
                
                   <div className="currentform-grid">
                   <div className="cropform-columnleft">
                   <div className="form-group photo-group">
                    <label>Photo <span className="optional">(Optional)</span></label>
                    <div className="photo-box">
                      {photoPreview ? <img src={photoPreview} alt="Preview" className="photo-preview" /> : <span className="photo-placeholder">No photo selected</span>}
                    </div>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="photo-input" />
                  </div>
                 
                    <label>Survey Numbers <span className="required">*</span>
                      <input {...register("surveyNumber")} />
                    </label>
                    <p>{errors.surveyNumber?.message}</p>

                    <label>Total Land Holding (In Acres Nos) <span className="required">*</span>
                      <input {...register("totalLandHolding")} />
                    </label>
                    <p>{errors.totalLandHolding?.message}</p>

                    <label>Geo-tag <span className="required">*</span>
                     <input {...register("geoTag")} />
                    </label>
                    <p>{errors.geoTag?.message}</p>
                    </div>

                    <div className="cropform-columnright">
                    <label>Select Crop <span className="required">*</span>
                    <select {...register("selectCrop")}>
                      <option value="">Select</option>
                      <option value="Grains">Grains</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Cotton">Cotton</option>
                    </select>
                    </label>
                    <p>{errors.selectCrop?.message}</p>

                    <label>Net Income (As per Current Crop/Yr) <span className="required">*</span>
                     <input {...register("netIncome")} />
                    </label>
                    <p>{errors.netIncome?.message}</p>

                    <label>Soil Test <span className="required">*</span>
                    <select {...register("soilTest")}>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    </label>
                    <p>{errors.soilTest?.message}</p>

                    <label>Soil Test Certificate <span className="required">*</span>
                     <input {...register("soilTestCertificate")} />
                    </label>
                    <p>{errors.soilTestCertificate?.message}</p>
                    </div>
                    </div>
                    
              </div>
              </>
            )}

  
<div className="btn-group">
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
      <p>Farmer form submitted successfully.</p>
      <button onClick={() => setShowSuccessPopup(false)}>OK</button>
    </div>
  </div>
)}
          </form>
        </FormProvider>
      </div>
      <div className="form-right">
        <img src={farmImage} alt="Farm Field" className="form-image" />
      </div>
    </div>
  );
};
  export default FarmerForm;  

