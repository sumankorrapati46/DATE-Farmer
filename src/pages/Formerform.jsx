import React, { useState } from "react"; 
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
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
    dateofBirth: yup.string().required("Date of Birth is required")
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
    fatherName: yup.string(),
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
    alternativeType: yup.string(),
  }),
  // Add other step schemas
  // Step 2: Address
  yup.object().shape({
    country: yup.string().required("Country is required"),
    state: yup.string().required("State is required"),
    district: yup.string().required("District is required"),
    mandal: yup.string().required("Block (mandal) is required"),
    village: yup.string().required("Village is required"),
    pincode: yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Pincode must be a 6-digit number"),
  }),

  // Step 3: Professional Information
  yup.object().shape({
    education: yup.string(),
    experience: yup.string(),
  }),

  // Step 4: Current Crop
  yup.object().shape({
    surveyNumber: yup.string(),
    totalLandHolding: yup.string(),
    geoTag: yup.string(),
    selectCrop: yup.string(),
    netIncome: yup.string(),
    soilTest: yup
        .string()
        .notRequired()
        .oneOf(["Yes", "No"], "Please select Yes or No"),
        
      soilTestCertificate: yup
        .mixed()
        .when("soilTest", {
          is: "Yes",
          then: (schema) =>
            schema.required("Soil Test Certificate is required").test(
              "fileSize",
              
              (value) => !value || value.size <= 10 * 1024 * 1024 // 5MB
            ),
          otherwise: (schema) => schema.notRequired(),
        }),
      }),
        yup.object().shape({
          surveyNumber: yup.string(),
          geoTag: yup.string(),
          cropType: yup.string(),
          soilTest: yup.string(),
          totalLandHolding: yup.string(),
          netIncome: yup.string(),
          soilTestCertificate: yup.mixed(),
        }),
        yup.object().shape({
          waterSource: yup.string(),
          borewellDischarge: yup.string(),
          summerDischarge: yup.string(),
          borewellLocation: yup.string(),
        }),

        yup.object().shape({
          bankName: yup.string(),
        
          accountNumber: yup.string()
            .matches(/^\d{9,18}$/, "Account Number must be 9-18 digits")
            ,
        
          branchName: yup.string(),
        
          ifscCode: yup.string()
            .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid IFSC Code")
            ,
        
          passbookFile: yup.mixed()
            
            .test("fileSize", "File is too large", (value) => {
              return value && value.size <= 5 * 1024 * 1024; 
            })
            .test("fileType", "Unsupported File Format", (value) => {
              return value && ["image/jpeg", "image/png", "application/pdf"].includes(value.type);
            }),
          }),
          yup.object().shape({
            voterId: yup.string().nullable(),
            aadharNumber: yup.string().nullable(),
            panNumber: yup.string().nullable(),
            ppbNumber: yup.string().nullable(),
            passbookPhoto: yup
              .mixed()
              .nullable()
              .test("fileSize", "File too large", (value) => {
                if (!value) return true; // allow empty
                return value.size <= 10 * 1024 * 1024; // allow up to 10MB
              }),
          }),
          
];


// usage in component

const steps = ["Personal Information", "Address","Professional Information","Current Crop Information", "Proposed Crop Information","Irrigation Details","Other Information",
  "Documents",];

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
 const { register, control, handleSubmit, formState: { errors }, watch, trigger, setValue } = methods;
 const soilTestValue = watch("soilTest");
 const selectedDoc = watch("documentType");
 const navigate = useNavigate();
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

  const districtOptions = [
    { value: "Adilabad", label: "Adilabad" },
    { value: "Bhadradri Kothagudem", label: "Bhadradri Kothagudem" },
    { value: "Hanumakonda", label: "Hanumakonda" },
    { value: "Hyderabad", label: "Hyderabad" },
    { value: "Jagtial", label: "Jagtial" },
    { value: "Jangaon", label: "Jangaon" },
    { value: "Jayashankar Bhupalpally", label: "Jayashankar Bhupalpally" },
    { value: "Jogulamba Gadwal", label: "Jogulamba Gadwal" },
    { value: "Kamareddy", label: "Kamareddy" },
    { value: "Karimnagar", label: "Karimnagar" },
    { value: "Khammam", label: "Khammam" },
    { value: "Komaram Bheem", label: "Komaram Bheem (Asifabad)" },
    { value: "Mahabubabad", label: "Mahabubabad" },
    { value: "Mahabubnagar", label: "Mahabubnagar" },
    { value: "Mancherial", label: "Mancherial" },
    { value: "Medak", label: "Medak" },
    { value: "Medchal–Malkajgiri", label: "Medchal–Malkajgiri" },
    { value: "Mulugu", label: "Mulugu" },
    { value: "Nagarkurnool", label: "Nagarkurnool" },
    { value: "Nalgonda", label: "Nalgonda" },
    { value: "Narayanpet", label: "Narayanpet" },
    { value: "Nirmal", label: "Nirmal" },
    { value: "Nizamabad", label: "Nizamabad" },
    { value: "Peddapalli", label: "Peddapalli" },
    { value: "Rajanna Sircilla", label: "Rajanna Sircilla" },
    { value: "Rangareddy", label: "Rangareddy" },
    { value: "Sangareddy", label: "Sangareddy" },
    { value: "Siddipet", label: "Siddipet" },
    { value: "Suryapet", label: "Suryapet" },
    { value: "Vikarabad", label: "Vikarabad" },
    { value: "Wanaparthy", label: "Wanaparthy" },
    { value: "Warangal", label: "Warangal" },
    { value: "Yadadri Bhuvanagiri", label: "Yadadri Bhuvanagiri" },
  ];

  const mandalOptions = [
    { value: "Bonakal", label: "Bonakal" },
    { value: "Chintakani", label: "Chintakani" },
    { value: "Enkuru", label: "Enkuru" },
    { value: "Kalluru", label: "Kalluru" },
    { value: "Kamepalli", label: "Kamepalli" },
    { value: "Khammam (Rural)", label: "Khammam (Rural)" },
    { value: "Khammam (Urban)", label: "Khammam (Urban)" },
    { value: "Konijerla", label: "Konijerla" },
    { value: "Kusumanchi", label: "Kusumanchi" },
    { value: "Madhira", label: "Madhira" },
    { value: "Mudigonda", label: "Mudigonda" },
    { value: "Nelakondapalli", label: "Nelakondapalli" },
    { value: "Penuballi", label: "Penuballi" },
    { value: "Raghunadhapalem", label: "Raghunadhapalem" },
    { value: "Sathupalli", label: "Sathupalli" },
    { value: "Singareni", label: "Singareni" },
    { value: "Thallada", label: "Thallada" },
    { value: "Tirumalayapalem", label: "Tirumalayapalem" },
    { value: "Vemsoor", label: "Vemsoor" },
    { value: "Wyra", label: "Wyra" },
    { value: "Yerrupalem", label: "Yerrupalem" },
  ];
  
  const villageOptions = [
    { value: "Allipuram", label: "Allipuram" },
    { value: "Bachodu", label: "Bachodu" },
    { value: "Danavaigudem", label: "Danavaigudem" },
    { value: "Gandhi Nagar", label: "Gandhi Nagar" },
    { value: "Kalavoddu", label: "Kalavoddu" },
    { value: "Khammam (Rural)", label: "Khammam (Rural)" },
    { value: "Lingala", label: "Lingala" },
    { value: "Mallemadugu", label: "Mallemadugu" },
    { value: "Mekala Gudem", label: "Mekala Gudem" },
    { value: "Mustikunta", label: "Mustikunta" },
    { value: "Pandurangapuram", label: "Pandurangapuram" },
    { value: "Peddireddygudem", label: "Peddireddygudem" },
    { value: "Rajeswarapuram", label: "Rajeswarapuram" },
    { value: "Singareni Colony", label: "Singareni Colony" },
    { value: "Turakagudem", label: "Turakagudem" },
  ]; 
 

  return (
    <div className="farmer-wrapper">
      <div className="form-full">
        <h2>{steps[currentStep]}</h2>
          
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} div className="farmer">
         
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
                  <label>Salutation <span className="optional">(Optional)</span>
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
                    <input type="text" {...register("dateofBirth")} placeholder="DD/MM/YYYY" />
                  </label>
                  <p className="error">{errors.dateofBirth?.message}</p>
  
                  <label>Father Name <span className="optional">(Optional)</span>
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
  
                  <label>Alternative Type <span className="optional">(Optional)</span>
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
                <label>Country <span className="required">*</span></label>
<Controller
  name="country"
  control={control}
  render={({ field }) => (
    <Select
      {...field}
      options={countryOptions}
      isSearchable
      placeholder="Select your Country"
      classNamePrefix="react-select"
      value={countryOptions.find(option => option.value === field.value)}
      onChange={(selectedOption) => field.onChange(selectedOption.value)}
    />
  )}
/>
<p className="error">{errors.country?.message}</p>
  
                <label>
  State <span className="required">*</span>
  <select {...register("state")}>
    <option value="">Select your state</option>
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Telangana">Telangana</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    {/* Add more states as needed */}
  </select>
</label>
  
<label>
  District <span className="required">*</span>
</label>
<Controller
  name="district"
  control={control}
  render={({ field }) => (
    <Select
      {...field}
      options={districtOptions}
      isSearchable
      placeholder="Select your district"
      classNamePrefix="react-select"
      value={districtOptions.find(option => option.value === field.value)}
      onChange={(selectedOption) => field.onChange(selectedOption.value)}
    />
  )}
/>
<p className="error">{errors.district?.message}</p>

  
                <label>
  Mandal <span className="required">*</span>
</label>
<Controller
  name="mandal"
  control={control}
  render={({ field }) => (
    <Select
      {...field}
      options={mandalOptions}
      isSearchable
      placeholder="Select your mandal"
      classNamePrefix="react-select"
      value={mandalOptions.find(option => option.value === field.value)}
      onChange={(selectedOption) => field.onChange(selectedOption.value)}
    />
  )}
/>
<p className="error">{errors.mandal?.message}</p>
  
<label>
  Village <span className="required">*</span>
</label>
<Controller
  name="village"
  control={control}
  render={({ field }) => (
    <Select
      {...field}
      options={villageOptions}
      isSearchable
      placeholder="Select your village"
      classNamePrefix="react-select"
      value={villageOptions.find(option => option.value === field.value)}
      onChange={(selectedOption) => field.onChange(selectedOption.value)}
    />
  )}
/>
<p className="error">{errors.village?.message}</p>
  
                <label>Pincode <span className="required">*</span>
                  <input {...register("pincode")} />
                </label>
                <p>{errors.pincode?.message}</p>
              </div>
            )}

{currentStep === 2 && (
                <>
              <div className="profes-field">
                <label>Education <span className="optional">(Optional)</span></label>
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

                <label>Experience <span className="optional">(Optional)</span>
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
                 
                    <label>Survey Numbers <span className="optional">(Optional)</span>
                      <input {...register("surveyNumber")} />
                    </label>
                    <p>{errors.surveyNumber?.message}</p>

                    <label>Total Land Holding (In Acres Nos) <span className="optional">(Optional)</span>
                      <input {...register("totalLandHolding")} />
                    </label>
                    <p>{errors.totalLandHolding?.message}</p>

                    <label>Geo-tag <span className="optional">(Optional)</span>
                     <input {...register("geoTag")} />
                    </label>
                    <p>{errors.geoTag?.message}</p>
                    </div>

                    <div className="cropform-columnright">
                    <label>Select Crop <span className="optional">(Optional)</span>
                    <select {...register("selectCrop")}>
                      <option value="">Select</option>
                      <option value="Grains">Grains</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Cotton">Cotton</option>
                    </select>
                    </label>
                    <p>{errors.selectCrop?.message}</p>

                    <label>Net Income (As per Current Crop/Yr) <span className="optional">(Optional)</span>
                     <input {...register("netIncome")} />
                    </label>
                    <p>{errors.netIncome?.message}</p>

                    <label>Soil Test <span className="optional">(Optional)</span>
                    <select {...register("soilTest")}>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    </label>
                    <p>{errors.soilTest?.message}</p>

                    <label>Soil Test Certificate
        <input
          type="file"
          {...register("soilTestCertificate")}
          disabled={soilTestValue !== "Yes"}
        />
        {errors.soilTestCertificate && (
          <p className="error">{errors.soilTestCertificate.message}</p>
        )}
      </label>
                    </div>
                    </div>
                    
              </div>
              </>
            )}
           {currentStep === 4 && (
              <div className="proposed-field">
                 <div className="proposedform-grid">
                 <div className="proposedform-columnleft">
                <label>Survey Numbers <span className="optional">(Optional)</span>
                  <input {...register("surveyNumber")} />
                </label>
                <p>{errors.surveyNumber?.message}</p>

                <label>Geo-tag <span className="optional">(Optional)</span>
                  <input {...register("geoTag")} placeholder="Latitude, Longitude" />
                </label>
                <p>{errors.geoTag?.message}</p>

                <label>Select Crop <span className="optional">(Optional)</span>
                <select {...register("cropType")}>
                  <option value="">Select</option>
                  <option value="Grains">Grains</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Cotton">Cotton</option>
                </select>
                </label>
                <p>{errors.cropType?.message}</p>

                <label>Soil Test <span className="optional">(Optional)</span>
                <select {...register("soilTest")}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                </label>
                <p>{errors.soilTest?.message}</p>
                </div>

                <div className="proposedform-columnright">
                <label>Total Land Holding (In Acres) <span className="optional">(Optional)</span>
                <input type="text" {...register("totalLandHolding")} />
                </label>
                <p>{errors.totalLandHolding?.message}</p>

                <label>Net Income (Per Crop/Yr) <span className="optional">(Optional)</span>
                <input type="text" {...register("netIncome")} />
                </label>
                <p className="error">{errors.netIncome?.message}</p>

                <label>Soil Test Certificate
        <input
          type="file"
          {...register("soilTestCertificate")}
          disabled={soilTestValue !== "Yes"}
        />
        {errors.soilTestCertificate && (
          <p className="error">{errors.soilTestCertificate.message}</p>
        )}
      </label>
                 </div>
                </div>
               </div>
            )}
{currentStep === 5 && (
              <div className="irrigation-field">
                <div className="Current Crop Addition">
                 <label>Water Source <span className="irrigationrequired">(Optional)</span>
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
                <label>Discharge (LPH) <span className="optional">(Optional)</span>
            <input {...register("borewellDischarge")} />
            </label>
             <p>{errors.borewellDischarge?.message}</p>

            <label>Summer Discharge <span className="optional">(Optional)</span>
            <input {...register("summerDischarge")} />
           </label>
           <p>{errors.summerDischarge?.message}</p>

            <label>Location <span className="optional">(Optional)</span>
            <input {...register("borewellLocation")} />
           </label>
             <p>{errors.borewellLocation?.message}</p>

                <p>{errors.irrigationType?.message}</p>
                
                </div>
              
              </div>
            )}

{currentStep === 6 && (
     <div className="other-field">
      <h3>Bank Details</h3>

      <label>Bank Name <span className="optional">(Optional)</span></label>
      <input type="text" {...register("bankName")} />
      <p className="error">{errors.bankName?.message}</p>

      <label>Account Number <span className="optional">(Optional)</span></label>
      <input type="text" {...register("accountNumber")} />
      <p className="error">{errors.accountNumber?.message}</p>

      <label>Branch Name <span className="optional">(Optional)</span></label>
      <input type="text" {...register("branchName")} />
      <p className="error">{errors.branchName?.message}</p>

      <label>IFSC Code <span className="optional">(Optional)</span></label>
      <input type="text" {...register("ifscCode")} />
      <p className="error">{errors.ifscCode?.message}</p>

      <label>Passbook <span className="optional">(Optional)</span></label>
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
  Add Document <span className="optional">(Optional)</span>
</label>
<select className="docinput" {...register("documentType", { required: "Document Type is required" })}>
  <option value="">Select</option>
  <option value="voterId">ID/ Voter Card</option>
  <option value="aadharNumber">Aadhar Number</option>
  <option value="panNumber">Pan Number</option>
  <option value="ppbNumber">PPB Number</option>
</select>
<p>{errors.documentType?.message}</p>

{/* Voter ID */}
{selectedDoc === "voterId" && (
  <>
    <input
      type="text"
      placeholder="Voter ID"
      className="input"
      {...register("voterId", { required: "Voter ID is required" })}
    />
    <p>{errors.voterId?.message}</p>

    <input
      type="file"
      accept="image/*,application/pdf"
      {...register("voterFile", { required: "Voter ID File is required" })}
    />
    <p>{errors.voterFile?.message}</p>
  </>
)}

{/* Aadhar */}
{selectedDoc === "aadharNumber" && (
  <>
    <input
      type="text"
      placeholder="Aadhar Number"
      className="input"
      {...register("aadharNumber", { required: "Aadhar Number is required" })}
    />
    <p>{errors.aadharNumber?.message}</p>

    <input
      type="file"
      accept="image/*,application/pdf"
      {...register("aadharFile", { required: "Aadhar File is required" })}
    />
    <p>{errors.aadharFile?.message}</p>
  </>
)}

{/* PAN */}
{selectedDoc === "panNumber" && (
  <>
    <input
      type="text"
      placeholder="PAN Number"
      className="input"
      {...register("panNumber", { required: "PAN Number is required" })}
    />
    <p>{errors.panNumber?.message}</p>

    <input
      type="file"
      accept="image/*,application/pdf"
      {...register("panFile", { required: "PAN File is required" })}
    />
    <p>{errors.panFile?.message}</p>
  </>
)}

{/* PPB - Always Visible but Optional */}
<input
  type="text"
  placeholder="PPB Number"
  className="input"
  {...register("ppbNumber")}
/>
<p>{errors.ppbNumber?.message}</p>

<input
  type="file"
  accept="image/*,application/pdf"
  {...register("ppbFile")}
/>
<p>{errors.ppbFile?.message}</p>

</div>
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
      Farmer form submitted successfully.
      <button
      onClick={() => {
        setShowSuccessPopup(false); // Close the popup
        navigate('/view-farmer');   // Navigate to the desired route
      }}
    >
      OK
    </button>
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


  