import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import farmImage from "../assets/farmImage.png";
import "../styles/Farmerform.css";

const steps = [
  "Personal Information",
  "Address",
  "Professional Information",
  "Current Crop Information",
  "Proposed Crop Information",
  "Irrigation Details",
  "Other Information",
  "Documents",
  "Portal Access",
  "View Farmer",
];

const validationSchemas = [
  // Step 1: Personal Information
  Yup.object().shape({

    firstName: Yup.string().required("First Name is required"),
    middleName: Yup.string().required("Middle Name is required"),
    lastName: Yup.string().required("Last Name is required"),
  
    gender: Yup.string().required("Gender is required"),
  
    salutation: Yup.string().required("Salutation is required"),
  
    nationality: Yup.string().required("Nationality is required"),
  
    dob: Yup.string()
      .required("Date of Birth is required")
      .matches(/^\d{2}\/\d{2}\/\d{4}$/, "DOB must be in DD/MM/YYYY format"),
  
    fatherName: Yup.string().required("Father Name is required"),
  
    alternativeNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
      .required("Alternative Number is required"),
  
    alternativeType: Yup.string().required("Alternative No. Type is required"),
  }),

  // Step 2: Address
  Yup.object().shape({
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    block: Yup.string().required("Block (mandal) is required"),
    village: Yup.string().required("Village is required"),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Pincode must be a 6-digit number"),
  }),

  // Step 3: Professional Information
  Yup.object().shape({
    education: Yup.string().required("Education is required"),
    experience: Yup.string().required("Experience is required"),
  }),

  // Step 4: Current Crop
  Yup.object().shape({
    surveyNumber: Yup.string().required("Survey Number is required"),
    totalLandHolding: Yup.string().required("Total Land Holding is required"),
    geoTag: Yup.string().required("Geo-tag is required"),
    selectCrop: Yup.string().required("Crop selection is required"),
    netIncome: Yup.string().required("Net Income is required"),
    soilTest: Yup.string().required("Soil Test is required"),
    soilTestCertificate: Yup.mixed().required("Soil Test Certificate is required"),
  }),

  // Step 5: Proposed Crop
  Yup.object().shape({
    surveyNumber: Yup.string().required("Survey Number is required"),
    geoTag: Yup.string().required("Geo-tag is required"),
    cropType: Yup.string().required("Crop Type is required"),
    soilTest: Yup.string().required("Soil Test selection is required"),
    totalLandHolding: Yup.string().required("Total Land Holding is required"),
    netIncome: Yup.string().required("Net Income is required"),
    soilTestCertificate: Yup.mixed().required("Soil Test Certificate is required"),
  }),

  // Step 6: Irrigation Details
  Yup.object().shape({
    waterSource: Yup.string().required("Water Source is required"),
    borewellDischarge: Yup.string().required("Borewell-wise Discharge is required"),
    summerDischarge: Yup.string().required("Discharge during summer months is required"),
    borewellLocation: Yup.string().required("Borewell Location is required"),
  }),

  // Step 7: Bank Information
  Yup.object().shape({
    bankName: Yup.string().required("Bank Name is required"),
  
    accountNumber: Yup.string()
      .matches(/^\d{9,18}$/, "Account Number must be 9-18 digits")
      .required("Account Number is required"),
  
    branchName: Yup.string().required("Branch Name is required"),
  
    ifscCode: Yup.string()
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid IFSC Code")
      .required("IFSC Code is required"),
  
    passbookFile: Yup.mixed()
      .required("Passbook file is required")
      .test("fileSize", "File is too large", (value) => {
        return value && value.size <= 5 * 1024 * 1024; 
      })
      .test("fileType", "Unsupported File Format", (value) => {
        return value && ["image/jpeg", "image/png", "application/pdf"].includes(value.type);
      }),
    }),

    Yup.object().shape({
      documentType: Yup.string()
        .required("Please select a document type")
        .notOneOf([""], "Invalid document type"),
    
      voterId: Yup.string()
        .when("documentType", {
          is: "ID/ Voter Card",
          then: (schema) => schema.required("Voter ID is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
    
      aadharNumber: Yup.string()
        .when("documentType", {
          is: "Aadhar Number",
          then: (schema) =>
            schema
              .required("Aadhar Number is required")
              .matches(/^\d{12}$/, "Aadhar number must be 12 digits"),
          otherwise: (schema) => schema.notRequired(),
        }),
    
      panNumber: Yup.string()
        .when("documentType", {
          is: "Pan Number",
          then: (schema) =>
            schema
              .required("PAN Number is required")
              .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
          otherwise: (schema) => schema.notRequired(),
        }),
    
      ppbNumber: Yup.string()
        .when("documentType", {
          is: "Ppb Number",
          then: (schema) => schema.required("PPB Number is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
    
      passbookPhoto: Yup.mixed()
        .required("Passbook photo is required")
        .test("fileType", "Unsupported format", (value) =>
          value ? ["image/jpeg", "image/png"].includes(value.type) : false
        )
        .test("fileSize", "File must be less than 5MB", (value) =>
          value ? value.size <= 5 * 1024 * 1024 : false
        ),
    }),

  // Step 8: System Access Information
  Yup.object().shape({
    role: Yup.string().required("Role/Designation is required"),
    access: Yup.string().required("Access selection is required"),
  }),

];



const FarmerForm = ({ currentStep, setCurrentStep }) => {
  

  const methods = useForm({
    resolver: yupResolver(validationSchemas[currentStep]),
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    setValue,
    totalSteps,
    props,
  } = methods;

  const onSubmit = async (data) => {
    const valid = await trigger();
    if (!valid) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log("Submitting form data:", data);
      alert("Form submitted successfully!");
     
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  useEffect(() => {
    setCurrentStep(currentStep); // call this on mount or step change
  }, [currentStep]);

  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      props.setCurrentStep(currentStep + 1); // notify Layout
    }
  };

  useEffect(() => {
    if (currentStep === 0) {
      axios
        .get("https://api.example.com/user/1") // Replace with actual API
        .then((res) => {
          const fields = Object.keys(res.data);
          fields.forEach((field) => setValue(field, res.data[field]));
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, [currentStep, setValue]);

    const [file, setFile] = useState(null);
    const [photo, setPhoto] = useState(null);
  
    const handlePhotoChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhoto(reader.result); 
        };
        reader.readAsDataURL(file);
      }
    };


            

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
                  <label>Photo <span className="required">*</span></label>
                   <div className="photo-box" onClick={() => document.getElementById("photoInput").click()}>
                     {photo ? (
                     <img src={photo} alt="Uploaded" className="preview-img" />
                      ) : (
                      "Click to upload"
                      )}
                    </div>
                   <input type="file" accept="image/*" id="photoInput" onChange={handlePhotoChange} style={{ display: "none" }} />
                </div>
                <label>First Name <span className="required">*</span>
                  <input {...register("firstName")} />
                </label>
                <p>{errors.firstName?.message}</p>

                <label>Middle Name <span className="required">*</span>
                  <input {...register("middleName")} />
                </label>
                <p>{errors.middleName?.message}</p>

                <label>Last Name <span className="required">*</span>
                  <input {...register("lastName")} />
                </label>
                <p>{errors.lastName?.message}</p>

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
                  <input {...register("nationality")} />
                </label>
                <p>{errors.nationality?.message}</p>

                <label>Date of Birth (DD/MM/YYYY) <span className="required">*</span>
                  <input {...register("dob")} />
                </label>
                <p>{errors.dob?.message}</p>

                <label>Father Name <span className="required">*</span>
                  <input {...register("fatherName")} />
                </label>
                <p>{errors.fatherName?.message}</p>

                <label>Alternative Number <span className="required">*</span>
                  <input {...register("alternativeNumber")} />
                </label>
                <p>{errors.alternativeNumber?.message}</p>

                <label>Alternative Type <span className="required">*</span>
                  <input {...register("alternativeType")} />
                </label>
                <p>{errors.alternativeType?.message}</p>
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
                 <form className="crop-form" onSubmit={handleSubmit(onSubmit)}>
                   <div className="currentform-grid">
                   <div className="cropform-columnleft">
                   <div className="form-group">
                     <label>Photo <span className="required">*</span></label>
                     <div className="photo-box">
                         {photo  ? (
                         <img src={photo} alt="Uploaded Farmer" className="uploaded-photo" />
                      ) : (
                        <p>Upload Farmer Photo</p>
                      )}
                     </div>
                     <input type="file" accept="image/*" id="photoInput" onChange={handlePhotoChange} style={{ display: "none" }} />
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
                    </form>
              </div>
              </>
            )}

            {currentStep === 4 && (
              <div className="proposed-field">
                 <div className="proposedform-grid">
                 <div className="proposedform-columnleft">
                <label>Survey Numbers <span className="required">*</span>
                  <input {...register("surveyNumber")} />
                </label>
                <p>{errors.surveyNumber?.message}</p>

                <label>Geo-tag <span className="required">*</span>
                  <input {...register("geoTag")} placeholder="Latitude, Longitude" />
                </label>
                <p>{errors.geoTag?.message}</p>

                <label>Select Crop <span className="required">*</span>
                <select {...register("cropType")}>
                  <option value="">Select</option>
                  <option value="Grains">Grains</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Cotton">Cotton</option>
                </select>
                </label>
                <p>{errors.cropType?.message}</p>

                <label>Soil Test <span className="required">*</span>
                <select {...register("soilTest")}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                </label>
                <p>{errors.soilTest?.message}</p>
                </div>

                <div className="proposedform-columnright">
                <label>Total Land Holding (In Acres) <span className="required">*</span>
                <input type="text" {...register("totalLandHolding")} />
                </label>
                <p>{errors.totalLandHolding?.message}</p>

                <label>Net Income (Per Crop/Yr) <span className="required">*</span>
                <input type="text" {...register("netIncome")} />
                </label>
                <p className="error">{errors.netIncome?.message}</p>

                <label>Soil Test Certificate <span className="required">*</span>
                 <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                </label>
                <p className="error">{errors.soilTestCertificate?.message}</p>
                 </div>
                </div>
               </div>
            )}

            {currentStep === 5 && (
              <div className="irrigation-field">
                <div className="Current Crop Addition">
                 <label>Water Source <span className="irrigationrequired">*</span>
                 <select {...register("waterSource")}>
                  <option value="">Select</option>
                  <option value="Borewell">Borewell</option>
                  <option value="Open Well">Open Well</option>
                  <option value="Canal">Canal</option>
                  <option value="Tank">Tank</option>
                  <option value="River">River</option>
                  <option value="Drip">Drip</option>
                </select>
                </label>
                <label>Borewell Discharge (LPH) <span className="required">*</span>
            <input {...register("borewellDischarge")} />
            </label>
             <p>{errors.borewellDischarge?.message}</p>

            <label>Summer Discharge <span className="required">*</span>
            <input {...register("summerDischarge")} />
           </label>
           <p>{errors.summerDischarge?.message}</p>

            <label>Borewell Location <span className="required">*</span>
            <input {...register("borewellLocation")} />
           </label>
             <p>{errors.borewellLocation?.message}</p>

                <p>{errors.irrigationType?.message}</p>
                <p> Borewell wise Discharge in LPH
                    Discharge during summer months
                    Borewell Location
                </p>
                </div>
              
              </div>
            )}

    {currentStep === 6 && (
     <div className="other-field">
      <h3>Bank Details</h3>

      <label>Bank Name <span className="required">*</span></label>
      <input type="text" {...register("bankName")} />
      <p className="error">{errors.bankName?.message}</p>

      <label>Account Number <span className="required">*</span></label>
      <input type="text" {...register("accountNumber")} />
      <p className="error">{errors.accountNumber?.message}</p>

      <label>Branch Name <span className="required">*</span></label>
      <input type="text" {...register("branchName")} />
      <p className="error">{errors.branchName?.message}</p>

      <label>IFSC Code <span className="required">*</span></label>
      <input type="text" {...register("ifscCode")} />
      <p className="error">{errors.ifscCode?.message}</p>

      <label>Passbook <span className="required">*</span></label>
       <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => {
          const file = e.target.files[0];
          setValue("passbookFile", file); 
          trigger("passbookFile"); 
       }}
        />
         <p className="error">{errors.passbookFile?.message}</p>
        </div>
      )}


           {currentStep === 7 && (
          <div className="other-field">
       <label className="label">
        Add Document <span className="required">*</span>
       </label>
           <select className="docinput" {...register("documentType")}>
              <option value="">Select</option>
               <option value="ID/ Voter Card">ID/ Voter Card</option>
               <option value="Aadhar Number">Aadhar Number</option>
               <option value="Pan Number">Pan Number</option>
               <option value="Ppb Number">Ppb Number</option>
           </select>
           <p>{errors.documentType?.message}</p>

   
             <input type="text" placeholder="ID/ Voter Card" className="input" {...register("voterId")} />
             <p>{errors.voterId?.message}</p>

               <input type="text" placeholder="Aadhar Number" className="input" {...register("aadharNumber")} />
                <p>{errors.aadharNumber?.message}</p>

                <input type="text" placeholder="Pan Number" className="input" {...register("panNumber")} />
                 <p>{errors.panNumber?.message}</p>

              <input type="text" placeholder="Ppb Number" className="input" {...register("ppbNumber")} />
              <p>{errors.ppbNumber?.message}</p>

                 <label className="doclabel">Passbook <span className="required">*</span></label>
              <div
                  className="photo-box"
                  onClick={() => document.getElementById("photoInput").click()}
                   >
                  {photo ? (
                   <img src={photo} alt="Uploaded" className="preview-img" />
                              ) : (
                  "Click to upload"
          )}
             </div>
            <input
             type="file"
             accept="image/*"
              id="photoInput"
               style={{ display: "none" }}
                onChange={(e) => {
                 const file = e.target.files[0];
                    setValue("passbookPhoto", file);
                     trigger("passbookPhoto");
            }}
                />
                <p>{errors.passbookPhoto?.message}</p>
             </div>
           )}


           {currentStep === 8 && (
              <div className="portal-form-group">
                <label> Role/Designation <span className="required">*</span> </label>
                <select {...register("role")}>
                  <option value="">Select</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </select>
                <p className="error">{errors.role?.message}</p>

                <label> Access <span className="required">*</span> </label>
                <select {...register("access")}>
                  <option value="">Select</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <p className="error">{errors.access?.message}</p>
              </div>
            )}

            
             
            <div className="btn-group">
            <button
             type="button"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
>
             Previous
              </button>

              <button
                type="button"
                disabled={currentStep === totalSteps - 1}
                onClick={() => setCurrentStep(currentStep + 1)}
              >
             Next
              </button>
               </div>
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

