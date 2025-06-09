  import React, { useEffect, useState } from "react";
  import { useParams } from 'react-router-dom'; 
  import { useForm, FormProvider, Controller } from "react-hook-form";
  import { createFarmer, getFarmerById, updateFarmer } from "../api/apiService";
  import { useNavigate } from 'react-router-dom';
  import { yupResolver } from '@hookform/resolvers/yup';
  import Select from 'react-select';
  import * as Yup from 'yup';
  import { parse, isValid, differenceInYears } from "date-fns";
  import farmImage from "../assets/farmImage.png";
  import "../styles/Farmerform.css";


 const stepSchemas = [
  // Step 0: Personal Information
  Yup.object().shape({
    firstName: Yup.string()
      .required("First Name is required")
      .matches(/^[A-Za-z]{2,26}$/, "First Name must be 2–26 letters only"),
    middleName: Yup.string()
      .required("Middle Name is required")
      .matches(/^[A-Za-z]{1,26}$/, "Middle Name must contain only letters"),
    lastName: Yup.string()
      .required("Last Name is required")
      .matches(/^[A-Za-z]{2,26}$/, "Last Name must be 2–26 letters only"),
    gender: Yup.string().required("Gender is required"),
    salutation: Yup.string()
      .required("Salutation is required")
      .oneOf(["Mr.", "Mrs.", "Ms.", "Miss.", "Dr."], "Select a valid salutation"),
    nationality: Yup.mixed()
      .required("Nationality is required")
      .transform((value) =>
        typeof value === "object" && value?.value ? value.value : value
      )
      .test("is-string", "Nationality must be a string", (value) => typeof value === "string"),
    dateofBirth: Yup.string()
      .required("Date of Birth is required")
      .test("valid-format", "Enter date as YYYY-MM-DD", (value) => {
        const parsed = parse(value, "yyyy-MM-dd", new Date());
        return isValid(parsed);
      })
      .test("age-limit", "Age must be between 18 and 90 years", (value) => {
        const parsed = parse(value, "yyyy-MM-dd", new Date());
        if (!isValid(parsed)) return false;
        const age = new Date().getFullYear() - parsed.getFullYear();
        return age >= 18 && age <= 90;
      }),
    fatherName: Yup.string()
      .nullable()
      .notRequired()
      .matches(/^[A-Za-z\s]{2,40}$/, "Father Name must contain only letters"),
    alternativeNumber: Yup.string()
      .nullable()
      .transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
      .matches(/^\d{10}$/, "Enter a valid 10-digit alternative number"),
    contactNumber: Yup.string()
      .nullable()
      .transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
      .matches(/^\d{10}$/, "Enter a valid 10-digit contact number"),
    alternativeType: Yup.string()
      .oneOf(["Father", "Mother", "Brother", "Sister", "Son", "Daughter", "Spouse", "Other", ""], "Select a valid relation")
      .nullable()
      .notRequired(),
    photo: Yup.mixed().nullable().notRequired(),
  }),

  // Step 1: Address
  Yup.object().shape({
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    mandal: Yup.string().required("Mandal is required"),
    village: Yup.string().required("Village is required"),
    pincode: Yup.string()
      .required("Pincode is required")
      .matches(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  }),

  // Step 2: Professional Information
  Yup.object().shape({
    education: Yup.string().nullable(),
    experience: Yup.string().nullable(),
  }),

  // Step 3: Current Crop Information
  Yup.object().shape({
    surveyNumber: Yup.string().nullable(),
    totalLandHolding: Yup.string().nullable(),
    geoTag: Yup.string().nullable(),
    selectCrop: Yup.string().nullable(),
    netIncome: Yup.string().nullable(),
    soilTest: Yup.string().required("Soil test selection is required"),
    soilTestCertificate: Yup.mixed().nullable().notRequired(),
  }),

  // Step 4: Proposed Crop Information
  Yup.object().shape({
    surveyNumber: Yup.string().nullable(),
    geoTag: Yup.string().nullable(),
    cropType: Yup.string().nullable(),
    totalLandHolding: Yup.string().nullable(),
    netIncome: Yup.string().nullable(),
    soilTest: Yup.string().nullable(),
    soilTestCertificate: Yup.mixed().nullable().notRequired(),
  }),

  // Step 5: Irrigation Details
  Yup.object().shape({
    waterSource: Yup.string().nullable(),
    borewellDischarge: Yup.string().nullable(),
    summerDischarge: Yup.string().nullable(),
    borewellLocation: Yup.string().nullable(),
  }),

  // Step 6: Other Information (Bank)
  Yup.object().shape({
    bankName: Yup.string().nullable(),
    accountNumber: Yup.string()
      .nullable()
      .matches(/^\d{9,18}$/, "Account Number must be 9-18 digits"),
    branchName: Yup.string().nullable(),
    ifscCode: Yup.string()
      .nullable()
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter valid IFSC code"),
    passbookFile: Yup.mixed()
      .nullable()
      .test("fileSize", "File is too large", value => !value || value.size <= 5 * 1024 * 1024)
      .test("fileType", "Unsupported file format", value =>
        !value || ["image/jpeg", "image/png", "application/pdf"].includes(value.type)),
  }),

  // Step 7: Documents
  Yup.object().shape({
    voterId: Yup.string().nullable(),
    aadharNumber: Yup.string()
      .nullable()
      .matches(/^\d{12}$/, "Aadhar must be 12 digits"),
    panNumber: Yup.string()
      .nullable()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter valid PAN number"),
    ppbNumber: Yup.string().nullable(),
    passbookPhoto: Yup.mixed()
      .nullable()
      .test("fileSize", "File too large", value => !value || value.size <= 10 * 1024 * 1024),
  }),
];

const steps = ["Personal Information", "Address","Professional Information","Current Crop Information", "Proposed Crop Information",
                  "Irrigation Details","Other Information", "Documents",];

  const FarmerForm = ({ currentStep, setCurrentStep }) => {
  const totalSteps = steps.length;
  const [photoPreviewStep0, setPhotoPreviewStep0] = useState(null);
  const [photoPreviewStep3, setPhotoPreviewStep3] = useState(null);

  const handlePhotoChangeStep0 = (e) => {
  const file = e.target.files[0];
  if (file) {
    setPhotoPreviewStep0(URL.createObjectURL(file));
    setValue("photoStep0", file); 
  }
};

const handlePhotoChangeStep3 = (e) => {
  const file = e.target.files[0];
  if (file) {
    setPhotoPreviewStep3(URL.createObjectURL(file));
    setValue("photoStep3", file); 
  }
};

const cropOptions = {
  Grains: [ "Paddy", "Maize", "Red Gram", "Black Gram", "Bengal Gram", "Groundnut", "Green Gram", "Sweet Corn", ],
  Vegetables: [ "Dry Chilli", "Mirchi", "Tomato", "Ladies Finger", "Ridge Gourd", "Broad Beans", "Brinjal",
                "Cluster Beans", "Bitter Gourd", "Bottle Gourd", ],
  Cotton: ["Cotton"],
};

const [waterSourceCategory, setWaterSourceCategory] = useState("");
const waterSourceOptions = ["Borewell", "Open Well", "Canal", "Tank", "River", "Drip"];

const [cropCategory, setCropCategory] = useState("");
const [cropCategoryStep3, setCropCategoryStep3] = useState("");
const [cropCategoryStep4, setCropCategoryStep4] = useState("");
  const methods = useForm({
    resolver: yupResolver(stepSchemas[currentStep]),
    mode: "onChange",
  });
  
 const { register, control, handleSubmit,  reset, formState: { errors }, watch, trigger, setValue }  = useForm();
 const soilTestValue = watch("soilTest");
 const selectedDoc = watch("documentType");
 const navigate = useNavigate();
 const { farmerId } = useParams();
 const isEditMode = Boolean(farmerId);

 const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value ?? '');
    });

    try {
      if (isEditMode) {
        await updateFarmer(farmerId, formData);
      } else {
        await createFarmer(formData);
      }
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Submit Error:", error);
     alert('Form submitted successfully.');
    }
  };
 
 const handleCreateSubmit = async (data) => {
  try {
   
    const result = await createFarmer(data);
    console.log("Farmer Created:", result);
    setShowSuccessPopup(true);
  } catch (error) {
    alert("Failed to submit. Please try again.");
  }
};
const handleUpdateSubmit = async (data) => {
  try {
   
    const farmerId = "123"; 
    const result = await updateFarmer(farmerId, data);
    console.log("Farmer Updated:", result);
    setShowSuccessPopup(true);
  } catch (error) {
    alert("Update failed. Please try again.");
  }
};
useEffect(() => {
  const loadFarmer = async () => {
    try {
      const farmerData = await getFarmerById(farmerId);
      reset(farmerData);
    } catch (error) {
      console.error("Load failed", error);
    }
  };

  if (isEditMode) {
    loadFarmer();
  }
}, []);

  
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const countryOptions = [
    { value: "India", label: "India" },
    { value: "United States", label: "United States" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Canada", label: "Canada" },
    { value: "Australia", label: "Australia" },
  
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
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(isEditMode ? handleUpdateSubmit : handleCreateSubmit)} div className="farmer">
         
           {currentStep === 0 && (
  <div className="form-grid">
    <div className="field-left">
      {/* Photo Upload */}
      <div className="form-group photo-group">
        <label>Photo <span className="optional"></span></label>
        <div className="photo-box">
          {photoPreviewStep0 ? (
            <img src={photoPreviewStep0} alt="Preview" className="photo-preview" />
          ) : (
            <span className="photo-placeholder">No photo selected</span>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChangeStep0}
          className="photo-input"
        />
      </div>

      {/* Name Fields */}
      <label className="label">First Name<span className="required">*</span></label>
      <input
        className="input"
        placeholder="First Name"
        {...register("firstName", { required: "First Name is required" })}
      />
      {errors.firstName && <p className="error">{errors.firstName.message}</p>}

     <label className="label">Middle Name<span className="required">*</span></label>
      <input
        className="input"
        placeholder="Middle Name"
        {...register("middleName", { required: "Middle Name is required" })}
      />
      {errors.middleName && <p className="error">{errors.middleName.message}</p>}

      <label className="label">Last Name<span className="required">*</span></label>
      <input
        className="input"
        placeholder="Last Name"
        {...register("lastName", { required: "Last Name is required" })}
      />
      {errors.lastName && <p className="error">{errors.lastName.message}</p>}

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

    <div className="field-right">
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

     <label className="label">Nationality<span className="required">*</span></label>
      <select
        className="input"
        {...register("nationality", { required: "Nationality is required" })}
      >
        <option value="">Select</option>
        <option value="Indian">Indian</option>
      </select>
      {errors.nationality && <p className="error">{errors.nationality.message}</p>}

      <label className="label">DOB<span className="required">*</span></label>
      <input
        type="date"
        className="input"
        {...register("dob", { required: "Date of Birth is required" })}
      />
      {errors.dob && <p className="error">{errors.dob.message}</p>}

      <label>
        Father Name <span className="optional"></span>
        <input type="text" {...register("fatherName")} placeholder="Enter father's name" />
      </label>
      <p className="error">{errors.fatherName?.message}</p>

      <label>
        Alternative Number <span className="optional"></span>
        <input type="tel" maxLength={10} {...register("alternativeNumber")} placeholder="10-digit number" />
      </label>
      <p className="error">{errors.alternativeNumber?.message}</p>

      <label>
        Contact Number <span className="optional"></span>
        <input type="tel" maxLength={10} {...register("contactNumber")} placeholder="10-digit number" />
      </label>
      <p className="error">{errors.contactNumber?.message}</p>

      <label>
        Alternative Type <span className="optional"></span>
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
                <label>Education <span className="optional"></span></label>
                <select {...register("education")}>
                  <option value="">Select</option>
                  <option value="Illiterate">Illiterate</option>
                  <option value="Primary Schooling">Primary Schooling</option>
                  <option value="High School">High School</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Degree">Degree</option>
                 </select>
                <p>{errors.occupation?.message}</p>

                <label>Experience <span className="optional"></span>
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
                    <label>Photo <span className="optional"></span></label>
                    <div className="photo-box">
                    {photoPreviewStep3 ? (
                    <img src={photoPreviewStep3} alt="Preview" className="photo-preview" />
                          ) : (
                     <span className="photo-placeholder">No photo selected</span>
                    )}
                  </div>
                   <input
                      type="file"
                       accept="image/*"
                      onChange={handlePhotoChangeStep3}
                      className="photo-input"
                   />
                  </div>
                 
                    <label>Survey Numbers <span className="optional"></span>
                      <input {...register("surveyNumberStep3")} />
                    </label>
                    <p>{errors.surveyNumber?.message}</p>

                    <label>Total Land Holding (In Acres Nos) <span className="optional">(Optional)</span>
                      <input {...register("totalLandHoldingStep3")} />
                    </label>
                    <p>{errors.totalLandHolding?.message}</p>

                    <label>Geo-tag <span className="optional"></span>
                     <input {...register("geoTagStep3")} />
                    </label>
                    <p>{errors.geoTag?.message}</p>
                    </div>

                    <div className="cropform-columnright">
                
              <label>
                   Select Crop Category <span className="optional"></span>
              <select
                  value={cropCategoryStep3}
                  onChange={(e) => {
                 setCropCategoryStep3(e.target.value);
                 setValue("selectCropStep3", "");
                 }}
               >
                 <option value="">Select</option>
                 {Object.keys(cropOptions).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
                   ))}
               </select>
               </label>

          {cropCategoryStep3 && (
                <label>
                  Select Crop Name <span className="optional"></span>
                 <select {...register("selectCropStep3")} defaultValue="">
                 <option value="">Select</option>
                 {cropOptions[cropCategoryStep3].map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
                 ))}
               </select>
              </label>
              )}
              <p className="error">{errors.selectCropStep3?.message}</p>

                    <label>Net Income (As per Current Crop/Yr) <span className="optional"></span>
                     <input {...register("netIncomeStep3")} />
                    </label>
                    <p>{errors.netIncome?.message}</p>

                    <label>Soil Test <span className="optional"></span>
                    <select {...register("soilTest")}>
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    </label>
                    <p>{errors.soilTest?.message}</p>

                    <label>Soil Test Certificate
       <input type="file" {...register("soilTestCertificateStep3")} />
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
                <label>Survey Numbers <span className="optional"></span>
                 <input {...register("surveyNumberStep4")} />
                </label>
                <p>{errors.surveyNumber?.message}</p>

                <label>
                 Geo-tag <span className="optional">(Optional)</span>
                <input
                type="text"
                placeholder="Latitude, Longitude"
              {...register("geoTag", {
                pattern: {
                  value: /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/, // basic lat,lng pattern
                 message: "Enter valid Latitude, Longitude (e.g., 17.123, 78.456)"
                }
                })}
               />
              </label>
              <p className="error">{errors.geoTag?.message}</p>


               <label>
               Select Crop Category <span className="optional"></span>
               <select
               value={cropCategoryStep4}
               onChange={(e) => {
               setCropCategoryStep4(e.target.value);
               setValue("selectCropStep4", ""); // unique field name
               }}
               >
              <option value="">Select</option>
              {Object.keys(cropOptions).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              </label>

               {cropCategoryStep4 && (
              <label>
               Select Crop Name <span className="optional"></span>
               <select {...register("selectCropStep4")} defaultValue="">
               <option value="">Select</option>
                {cropOptions[cropCategoryStep4].map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
               </select>
              </label>
               )}
               <p className="error">{errors.selectCropStep4?.message}</p>


                <label>Soil Test <span className="optional"></span>
                <select {...register("soilTestStep4")}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                </label>
                <p>{errors.soilTest?.message}</p>
                </div>

                <div className="proposedform-columnright">
                <label>Total Land Holding (In Acres) <span className="optional"></span>
                <input {...register("totalLandHoldingStep4")} />
                </label>
                <p>{errors.totalLandHolding?.message}</p>

                <label>Net Income (Per Crop/Yr) <span className="optional"></span>
                <input type="text" {...register("netIncomeStep4")} />
                </label>
                <p className="error">{errors.netIncome?.message}</p>

                <label>Soil Test Certificate
                 <input type="file" {...register("soilTestCertificateStep4")} />
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
                  <label>
              Select Water Source Category <span className="optional"></span>
             <select
              value={waterSourceCategory}
             onChange={(e) => {
             setWaterSourceCategory(e.target.value);
             setValue("currentWaterSource", "");
             setValue("proposedWaterSource", "");
             }}
              >
             <option value="">Select</option>
             {waterSourceOptions.map((source) => (
             <option key={source} value={source}>{source}</option>
              ))}
             </select>
             </label>

          {waterSourceCategory && (
           <>
            <label>
            Current Crop - Water Source <span className="optional"></span>
               <select {...register("currentWaterSource")} defaultValue="">
                 <option value="">Select</option>
                {waterSourceOptions.map((source) => (
                  <option key={source} value={source}>{source}</option>
                 ))}
                </select>
                   </label>
                <p className="error">{errors.currentWaterSource?.message}</p>

               <label>
               Proposed Crop - Water Source <span className="optional"></span>
                 <select {...register("proposedWaterSource")} defaultValue="">
                 <option value="">Select</option>
               {waterSourceOptions.map((source) => (
                  <option key={source} value={source}>{source}</option>
                  ))}
                 </select>
                   </label>
                 <p className="error">{errors.proposedWaterSource?.message}</p>
                  </>
              )}

                <label>Discharge (LPH) <span className="optional"></span>
            <input {...register("borewellDischarge")} />
            </label>
             <p>{errors.borewellDischarge?.message}</p>

            <label>Summer Discharge <span className="optional"></span>
            <input {...register("summerDischarge")} />
           </label>
           <p>{errors.summerDischarge?.message}</p>

            <label>Location <span className="optional"></span>
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

                 <label>Bank Name <span className="optional"></span></label>
                <input type="text" {...register("bankName")} />
                <p className="error">{errors.bankName?.message}</p>

               <label>Account Number <span className="optional"></span></label>
                <input type="text" {...register("accountNumber")} />
                <p className="error">{errors.accountNumber?.message}</p>

               <label>Branch Name <span className="optional"></span></label>
                <input type="text" {...register("branchName")} />
              <p className="error">{errors.branchName?.message}</p>
      
              <label>IFSC Code <span className="optional"></span></label>
               <input type="text" {...register("ifscCode")} />
               <p className="error">{errors.ifscCode?.message}</p>
 
              <label>Passbook <span className="optional"></span></label>
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
          Add Document <span className="optional"></span>
       </label>
       <select className="docinput" {...register("documentType", { required: "Document Type is required" })}>
            <option value="">Select</option>
            <option value="voterId">ID/ Voter Card</option>
          <option value="aadharNumber">Aadhar Number</option>
           <option value="panNumber">Pan Number</option>
         <option value="ppbNumber">PPB Number</option>
          </select>
          <p>{errors.documentType?.message}</p>


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

       {selectedDoc === "aadharNumber" && (
        <>
     <input
       type="text"
       placeholder="Aadhar Number"
       {...register("aadharNumber", {
        required: "Aadhar Number is required"
       })}
     />
     <p>{errors.aadharNumber?.message}</p>

      <input
        type="file"
        {...register("aadharFile", {
        required: "Aadhar File is required"
        })}
      />
       <p>{errors.aadharFile?.message}</p>
    </>
     )}


      {selectedDoc === "panNumber" && (
    <>
    <input   type="text"   placeholder="PAN Number" className="input"
      {...register("panNumber", { required: "PAN Number is required" })}  />
     <p>{errors.panNumber?.message}</p>

    <input  type="file"   accept="image/*,application/pdf"
      {...register("panFile", { required: "PAN File is required" })} />
      <p>{errors.panFile?.message}</p>
      </>
    )}
        <input   type="text"  placeholder="PPB Number" className="input" {...register("ppbNumber")} />
      <p>{errors.ppbNumber?.message}</p>

       <input  type="file" accept="image/*,application/pdf" {...register("ppbFile")} />
        <p>{errors.ppbFile?.message} </p>
          </div>
                )}
               <div className="btn-group">  {currentStep === 0 ? (
               <button  type="button"  onClick={async () => { const isValid = await trigger(); if (isValid)
                 setCurrentStep(currentStep + 1); }} >
                Next
               </button>
            ) : currentStep === totalSteps - 1 ? (
              <>
      <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
        Previous
      </button>
      <button
        type="submit"
        onClick={async () => {
          const isValid = await trigger();
          if (isValid) {
            await handleSubmit(onSubmit)();
            alert("Please fill all required fields before submitting.");
          }
        }}
      >
        Submit
      </button>
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


  