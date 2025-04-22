import React,{useState} from 'react';
import "../styles/FarmerView.css";
import logo3 from "../assets/rightlogo.png";
import logo4 from "../assets/middle.png";
import { useForm } from 'react-hook-form';



const FarmerView = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
  
    const [farmer, setFarmer] = useState({
      fullName: " ",
      relation: " ",
      gender: " ",
      fatherName: " ",
      nationality: " ",
      dob: " ",
      contact: " ",
      altNumber: " ",
      altRelation: " ",
      soilTestCertificate: null,
    });
  
    const handleFileChange = (e) => {
      const { name, files } = e.target;
      setFarmer((prevFarmer) => ({
        ...prevFarmer,
        [name]: files[0],
      }));
    };
    
    

    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
    } = useForm();
    
    const [photoPreview, setPhotoPreview] = useState(null);
    
    const handlePhotoChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    
    const soilTestValue = watch('soilTest');
    
  
    return (
      <div className="farmer-view-container">
        {/* Header */}
        <div className="header">
        <img src={logo3} alt="DATE Logo" className="viwelogo" />
        </div>
          <div className="user-info">
          <img src={logo4} alt="middle img" className="middle" />
          
          
        </div>
  
        <div className="body-content">
          {/* Sidebar */}
          <div className="sidebar">
            {[
              'Personal Information',
              'Address',
              'Professional Information',
              'Current Crop Information',
              'Proposed Crop Information',
              'Irrigation Details',
              'Other Information',
              'Documents',
            
            ].map((item, index) => (
              <div
                key={index}
                className={`sidebar-item ${currentStep === index ? 'active' : ''}`}
                onClick={() => {
                  setCurrentStep(index);
                  setIsEditing(false);
                }}
              >
                {item}
              </div>
            ))}
          </div>
  
          {/* Main Content */}
          <div className="main-content">
            {currentStep === 0 && (
              <div>
                 <button onClick={() => setIsEditing(true)} className="viwe-button">Edit</button>
                <h1>Personal Information</h1>
                {!isEditing ? (
                  <>
                    <div className="info-row">
                      <div><strong>Full Name:</strong> {farmer.fullName}</div>
                      <div><strong>Select:</strong> {farmer.relation}</div>
                    </div>
                    <div className="info-row">
                      <div><strong>Gender:</strong> {farmer.gender}</div>
                      <div><strong>Father Name:</strong> {farmer.fatherName}</div>
                    </div>
                    <div className="info-row">
                      <div><strong>Nationality:</strong> {farmer.nationality}</div>
                      <div><strong>Alternative Number:</strong> {farmer.altNumber}</div>
                    </div>
                    <div className="info-row">
                      <div><strong>DOB:</strong> {farmer.dob}</div>
                      <div><strong>Alternative No. Type:</strong> {farmer.altRelation}</div>
                    </div>
                    <div className="info-row">
                      <div><strong>Contact Number:</strong> {farmer.contact}</div>
                    </div>
                    
                  </>
                ) : (
                    <>
                    <div className="form-row">
                      <input name="fullName" placeholder="Full name" value={farmer.fullName} onChange={handleChange} />
                      <input name="relation" value={farmer.relation} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                      <input name="gender" value={farmer.gender} onChange={handleChange} />
                      <input name="fatherName" value={farmer.fatherName} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                      <input name="nationality" value={farmer.nationality} onChange={handleChange} />
                      <input name="altNumber" value={farmer.altNumber} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                      <input name="dob" value={farmer.dob} onChange={handleChange} />
                      <input name="altRelation" value={farmer.altRelation} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                      <input name="contact" value={farmer.contact} onChange={handleChange} />
                    </div>
                    <button onClick={() => setIsEditing(false)} className="viwe-button">Save</button>
                  </>
                )}
              </div>
            )}
            {currentStep === 1 && (
  <div className="address-field">
    <button onClick={() => setIsEditing(true)} className="viwe-button">Edit</button>
    <h1>Address Information</h1>

    {!isEditing ? (
      <>
        <div className="info-row">
          <div><strong>Country:</strong> {farmer.country}</div>
          <div><strong>State:</strong> {farmer.state}</div>
        </div>
        <div className="info-row">
          <div><strong>District:</strong> {farmer.district}</div>
          <div><strong>Mandal:</strong> {farmer.mandal}</div>
        </div>
        <div className="info-row">
          <div><strong>Village:</strong> {farmer.village}</div>
          <div><strong>Pincode:</strong> {farmer.pincode}</div>
        </div>
      </>
    ) : (
      <>
        <label>Country <span className="required">*</span></label>
        <input name="country" value={farmer.country} onChange={handleChange} className="input" />

        <label>State <span className="required">*</span></label>
        <select name="state" value={farmer.state} onChange={handleChange} className="input">
          <option value="">Select your state</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Telangana">Telangana</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
        </select>

        <label>District <span className="required">*</span></label>
        <input name="district" value={farmer.district} onChange={handleChange} className="input" />

        <label>Mandal <span className="required">*</span></label>
        <input name="mandal" value={farmer.mandal} onChange={handleChange} className="input" />

        <label>Village <span className="required">*</span></label>
        <input name="village" value={farmer.village} onChange={handleChange} className="input" />

        <label>Pincode <span className="required">*</span></label>
        <input name="pincode" value={farmer.pincode} onChange={handleChange} className="input" />

        <button onClick={() => setIsEditing(false)} className="viwe-button">Save</button>
      </>
    )}
  </div>
)}
{currentStep === 2 && (
  <div className="profes-field">
    <button onClick={() => setIsEditing(true)} className="viwe-button">Edit</button>
    <h1>Professional Information</h1>

    {!isEditing ? (
      <>
        <div className="info-row">
          <div><strong>Education:</strong> {farmer.education}</div>
          <div><strong>Experience:</strong> {farmer.experience}</div>
        </div>
      </>
    ) : (
      <>
        <label>Education <span className="required">*</span></label>
        <select
          name="education"
          value={farmer.education}
          onChange={handleChange}
          className="input"
        >
          <option value="">Select</option>
          <option value="Primary Schooling">Primary Schooling</option>
          <option value="High School">High School</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Degree">Degree</option>
          <option value="Graduate">Graduate</option>
          <option value="Post-Graduate">Post-Graduate</option>
        </select>

        <label>Experience <span className="required">*</span></label>
        <input
          name="experience"
          value={farmer.experience}
          onChange={handleChange}
          placeholder="e.g. 15 Years"
          className="input"
        />

        <button onClick={() => setIsEditing(false)} className="viwe-button">Save</button>
      </>
    )}
  </div>
)}

{currentStep === 3 && (
  <div className="current-field">
    <button onClick={() => setIsEditing(true)} className="viwe-button">Edit</button>
    <h1>Current Crop Information</h1>

    {!isEditing ? (
      <>
        <div className="info-row">
          <div><strong>Survey Numbers:</strong> {watch("surveyNumber")}</div>
          <div><strong>Total Land Holding:</strong> {watch("totalLandHolding")}</div>
          <div><strong>Geo-tag:</strong> {watch("geoTag")}</div>
          <div><strong>Selected Crop:</strong> {watch("selectCrop")}</div>
          <div><strong>Net Income:</strong> {watch("netIncome")}</div>
          <div><strong>Soil Test:</strong> {watch("soilTest")}</div>
          {watch("soilTest") === "Yes" && (
            <div><strong>Soil Test Certificate:</strong> Uploaded</div>
          )}
          {photoPreview && (
            <div>
              <strong>Photo:</strong>
              <img src={photoPreview} alt="Preview" className="photo-preview" />
            </div>
          )}
        </div>
      </>
    ) : (
      <>
        <div className="currentform-grid">
          <div className="cropform-columnleft">
            <div className="form-group photo-group">
              <label>Photo <span className="optional">(Optional)</span></label>
              <div className="photo-box">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="photo-preview" />
                ) : (
                  <span className="photo-placeholder">No photo selected</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="photo-input" />
            </div>

            <label>Survey Numbers <span className="required">*</span></label>
            <input {...register("surveyNumber")} className="input" />
            <p>{errors.surveyNumber?.message}</p>

            <label>Total Land Holding (In Acres Nos) <span className="required">*</span></label>
            <input {...register("totalLandHolding")} className="input" />
            <p>{errors.totalLandHolding?.message}</p>

            <label>Geo-tag <span className="required">*</span></label>
            <input {...register("geoTag")} className="input" />
            <p>{errors.geoTag?.message}</p>
          </div>

          <div className="cropform-columnright">
            <label>Select Crop <span className="required">*</span></label>
            <select {...register("selectCrop")} className="input">
              <option value="">Select</option>
              <option value="Grains">Grains</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Cotton">Cotton</option>
            </select>
            <p>{errors.selectCrop?.message}</p>

            <label>Net Income (As per Current Crop/Yr) <span className="required">*</span></label>
            <input {...register("netIncome")} className="input" />
            <p>{errors.netIncome?.message}</p>

            <label>Soil Test <span className="required">*</span></label>
            <select {...register("soilTest")} className="input">
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <p>{errors.soilTest?.message}</p>

            {watch("soilTest") === "Yes" && (
              <>
                <label>Soil Test Certificate</label>
                <input
                  type="file"
                  {...register("soilTestCertificate")}
                  className="input"
                />
                {errors.soilTestCertificate && (
                  <p className="error">{errors.soilTestCertificate.message}</p>
                )}
              </>
            )}
          </div>
        </div>
        <button onClick={() => setIsEditing(false)} className="viwe-button">Save</button>
      </>
    )}
  </div>
)}
       {currentStep === 4 && (
  <div className="proposed-field">
    <button onClick={() => setIsEditing(true)} className="viwe-button">Edit</button>
    <h1>Proposed Crop Information</h1>

    {!isEditing ? (
      <>
        <div className="info-row">
          <div><strong>Survey Number:</strong> {farmer.surveyNumber}</div>
          <div><strong>Geo-tag:</strong> {farmer.geoTag}</div>
          <div><strong>Crop Type:</strong> {farmer.cropType}</div>
          <div><strong>Soil Test:</strong> {farmer.soilTest}</div>
          <div><strong>Total Land Holding:</strong> {farmer.totalLandHolding}</div>
          <div><strong>Net Income:</strong> {farmer.netIncome}</div>
          <div><strong>Soil Test Certificate:</strong> {farmer.soilTestCertificate ? farmer.soilTestCertificate.name : "Not Uploaded"}</div>
        </div>
      </>
    ) : (
      <div className="proposedform-grid">
        <div className="proposedform-columnleft">
          <label>Survey Numbers <span className="required">*</span></label>
          <input name="surveyNumber" value={farmer.surveyNumber} onChange={handleChange} className="input" />

          <label>Geo-tag <span className="required">*</span></label>
          <input name="geoTag" value={farmer.geoTag} onChange={handleChange} placeholder="Latitude, Longitude" className="input" />

          <label>Select Crop <span className="required">*</span></label>
          <select name="cropType" value={farmer.cropType} onChange={handleChange} className="input">
            <option value="">Select</option>
            <option value="Grains">Grains</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Cotton">Cotton</option>
          </select>

          <label>Soil Test <span className="required">*</span></label>
          <select name="soilTest" value={farmer.soilTest} onChange={handleChange} className="input">
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="proposedform-columnright">
          <label>Total Land Holding (In Acres) <span className="required">*</span></label>
          <input name="totalLandHolding" value={farmer.totalLandHolding} onChange={handleChange} className="input" />

          <label>Net Income (Per Crop/Yr) <span className="required">*</span></label>
          <input name="netIncome" value={farmer.netIncome} onChange={handleChange} className="input" />

          <label>Soil Test Certificate</label>
          <input
            type="file"
            name="soilTestCertificate"
            onChange={handleFileChange}
            disabled={farmer.soilTest !== "Yes"}
            className="input"
          />

          <button onClick={() => setIsEditing(false)} className="viwe-button">Save</button>
        </div>
      </div>
    )}
  </div>
)}
                {currentStep === 5 && (
  <div className="irrigation-field">
    <button onClick={() => setIsEditing(true)} className="viwe-button">Edit</button>
    <h1>Irrigation Details</h1>

    {!isEditing ? (
      <>
        <div className="info-row">
          <div><strong>Water Source:</strong> {farmer.waterSource}</div>
          <div><strong>Discharge (LPH):</strong> {farmer.borewellDischarge}</div>
          <div><strong>Summer Discharge:</strong> {farmer.summerDischarge}</div>
          <div><strong>Borewell Location:</strong> {farmer.borewellLocation}</div>
        </div>
      </>
    ) : (
      <div className="proposedform-grid">
        <div className="proposedform-columnleft">
          <label>Water Source <span className="required">*</span></label>
          <select name="waterSource" value={farmer.waterSource} onChange={handleChange} className="input">
            <option value="">Select</option>
            <option value="Borewell">Borewell</option>
            <option value="Open Well">Open Well</option>
            <option value="Canal">Canal</option>
            <option value="Tank">Tank</option>
            <option value="River">River</option>
            <option value="Drip">Drip</option>
          </select>

          <label>Discharge (LPH) <span className="required">*</span></label>
          <input
            name="borewellDischarge"
            value={farmer.borewellDischarge}
            onChange={handleChange}
            className="input"
          />

          <label>Summer Discharge <span className="required">*</span></label>
          <input
            name="summerDischarge"
            value={farmer.summerDischarge}
            onChange={handleChange}
            className="input"
          />

          <label>Location <span className="required">*</span></label>
          <input
            name="borewellLocation"
            value={farmer.borewellLocation}
            onChange={handleChange}
            className="input"
          />

          <button onClick={() => setIsEditing(false)} className="viwe-button">Save</button>
        </div>
      </div>
    )}
  </div>
)}
             {currentStep === 6 && (
  <div className="other-field">
    <button onClick={() => setIsEditing(true)} className="viwe-button">Edit</button>
    <h3>Bank Details</h3>

    {!isEditing ? (
      <div className="info-row">
        <div><strong>Bank Name:</strong> {farmer.bankName}</div>
        <div><strong>Account Number:</strong> {farmer.accountNumber}</div>
        <div><strong>Branch Name:</strong> {farmer.branchName}</div>
        <div><strong>IFSC Code:</strong> {farmer.ifscCode}</div>
        <div><strong>Passbook:</strong> {farmer.passbookFile ? farmer.passbookFile.name : "Not Uploaded"}</div>
      </div>
    ) : (
      <>
        <label>Bank Name <span className="required">*</span></label>
        <input
          type="text"
          name="bankName"
          value={farmer.bankName}
          onChange={handleChange}
          className="input"
        />

        <label>Account Number <span className="required">*</span></label>
        <input
          type="text"
          name="accountNumber"
          value={farmer.accountNumber}
          onChange={handleChange}
          className="input"
        />

        <label>Branch Name <span className="required">*</span></label>
        <input
          type="text"
          name="branchName"
          value={farmer.branchName}
          onChange={handleChange}
          className="input"
        />

        <label>IFSC Code <span className="required">*</span></label>
        <input
          type="text"
          name="ifscCode"
          value={farmer.ifscCode}
          onChange={handleChange}
          className="input"
        />

        <label>Passbook <span className="required">*</span></label>
        <input
          type="file"
          accept="image/*,application/pdf"
          name="passbookFile"
          onChange={handleFileChange}
          className="input"
        />

        <button onClick={() => setIsEditing(false)} className="viwe-button">Save</button>
      </>
    )}
  </div>
)}
       
       {currentStep === 7 && (
  <div className="other-field">
    <button onClick={() => setIsEditing(true)} className="viwe-button">Edit</button>
    <h3>Documents</h3>

    {!isEditing ? (
      <div className="info-row">
        <div><strong>Document Type:</strong> {farmer.documentType}</div>

        {farmer.documentType === "voterId" && (
          <>
            <div><strong>Voter ID:</strong> {farmer.voterId}</div>
            <div><strong>Voter ID File:</strong> {farmer.voterFile?.name || "Not Uploaded"}</div>
          </>
        )}
        {farmer.documentType === "aadharNumber" && (
          <>
            <div><strong>Aadhar Number:</strong> {farmer.aadharNumber}</div>
            <div><strong>Aadhar File:</strong> {farmer.aadharFile?.name || "Not Uploaded"}</div>
          </>
        )}
        {farmer.documentType === "panNumber" && (
          <>
            <div><strong>PAN Number:</strong> {farmer.panNumber}</div>
            <div><strong>PAN File:</strong> {farmer.panFile?.name || "Not Uploaded"}</div>
          </>
        )}

        {/* Always show PPB */}
        <div><strong>PPB Number:</strong> {farmer.ppbNumber || "Not Provided"}</div>
        <div><strong>PPB File:</strong> {farmer.ppbFile?.name || "Not Uploaded"}</div>
      </div>
    ) : (
      <>
        <label className="label">Add Document <span className="required">*</span></label>
        <select
          name="documentType"
          className="docinput"
          value={farmer.documentType}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="voterId">ID/ Voter Card</option>
          <option value="aadharNumber">Aadhar Number</option>
          <option value="panNumber">Pan Number</option>
          <option value="ppbNumber">PPB Number</option>
        </select>

        {farmer.documentType === "voterId" && (
          <>
            <input
              type="text"
              name="voterId"
              placeholder="Voter ID"
              value={farmer.voterId}
              onChange={handleChange}
              className="input"
            />
            <input
              type="file"
              name="voterFile"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="input"
            />
          </>
        )}

        {farmer.documentType === "aadharNumber" && (
          <>
            <input
              type="text"
              name="aadharNumber"
              placeholder="Aadhar Number"
              value={farmer.aadharNumber}
              onChange={handleChange}
              className="input"
            />
            <input
              type="file"
              name="aadharFile"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="input"
            />
          </>
        )}

        {farmer.documentType === "panNumber" && (
          <>
            <input
              type="text"
              name="panNumber"
              placeholder="PAN Number"
              value={farmer.panNumber}
              onChange={handleChange}
              className="input"
            />
            <input
              type="file"
              name="panFile"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="input"
            />
          </>
        )}

        {/* PPB always visible */}
        <input
          type="text"
          name="ppbNumber"
          placeholder="PPB Number"
          value={farmer.ppbNumber}
          onChange={handleChange}
          className="input"
        />
        <input
          type="file"
          name="ppbFile"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="input"
        />

        <button onClick={() => setIsEditing(false)} className="viwe-button">Save</button>
      </>
    )}
  </div>
)}




          </div>
        </div>
      </div>
    );
  };
  
  export default FarmerView;
