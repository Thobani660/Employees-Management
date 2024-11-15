import React, { useState } from 'react';
import axios from '../api';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    age: '',
    idNumber: '',
    role: '',
    photo: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
  
    try {
      const response = await axios.post('/employees', data);
      console.log(response.data); // Log successful response
      // Reset form or provide user feedback
      setFormData({ name: '', surname: '', age: '', idNumber: '', role: '', photo: null });
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Server error:", error.response.data);
        alert('Error: ' + error.response.data.message);
      } else if (error.request) {
        // Request was made, but no response was received
        console.error("No response received:", error.request);
        alert('No response from the server. Please try again later.');
      } else {
        // Something else went wrong
        console.error("Error:", error.message);
        alert('An unexpected error occurred.');
      }
    }
  };
  

  return (
    <div style={formContainerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={headerStyle}>Add Employee</h2>

        <div style={inputGroupStyle}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            style={inputStyle}
          />
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            placeholder="Surname"
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            style={inputStyle}
          />
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            placeholder="ID Number"
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Role"
            style={inputStyle}
          />
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            style={{ ...inputStyle, padding: '0.5rem', border: '2px solid #ccc', borderRadius: '5px' }}
          />
        </div>

        <div style={buttonContainerStyle}>
          <button type="submit" style={buttonStyle}>Add Employee</button>
        </div>
      </form>
    </div>
  );
};

// Styles
const formContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: 'transperant',
  fontFamily: 'Arial, sans-serif',
  padding: '20px',
};

const formStyle = {
  backgroundColor: 'rgba(84, 162, 214, 0.9)',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  width: '100%',
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const headerStyle = {
  color: '#333',
  textAlign: 'center',
  fontSize: '1.5rem',
  marginBottom: '1rem',
  fontWeight: '600',
};

const inputGroupStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
};

const inputStyle = {
  width: '48%',
  padding: '0.8rem',
  margin: '0.5rem 0',
  borderRadius: '8px',
  border: '1px solid #ddd',
  outline: 'none',
  fontSize: '1rem',
  transition: 'border 0.3s ease-in-out',
};

const buttonContainerStyle = {
  width: '100%',
  textAlign: 'center',
};

const buttonStyle = {
  width: '100%',
  padding: '0.8rem',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

buttonStyle[':hover'] = {
  backgroundColor: '#45a049',
};

export default EmployeeForm;