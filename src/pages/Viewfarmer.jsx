import React,{useState} from 'react';
import "../styles/FarmerView.css";
import logo3 from "../assets/rightlogo.png";
import logo4 from "../assets/middle.png";



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
    });
  
    const handleChange = (e) => {
      setFarmer({ ...farmer, [e.target.name]: e.target.value });
    };
  
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
              'Portal Access',
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
            
          </div>
        </div>
      </div>
    );
  };
  
  export default FarmerView;
