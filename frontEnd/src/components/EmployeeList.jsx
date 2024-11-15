// src/components/EmployeeList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: "", surname: "", age: "", idNumber: "", role: "", photo: null });

  useEffect(() => {
    fetchEmployees();
  }, []);
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/employees");
      setEmployees(Array.isArray(response.data) ? response.data : []); // Ensure response data is an array
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]); // Set to empty array on error
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await axios.post("/employees", data);
      fetchEmployees(); // Refresh the list after adding
      setFormData({ name: "", surname: "", age: "", idNumber: "", role: "", photo: null });
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`/employees/${id}`);
      fetchEmployees(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{ color: '#333' }}>Employee Management</h2>
      
      <form onSubmit={handleAddEmployee} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        width: '100%',
        maxWidth: '400px',
      }}>
        <input type="text" placeholder="Name" value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} />
        <input type="text" placeholder="Surname" value={formData.surname}
          onChange={(e) => setFormData({ ...formData, surname: e.target.value })} style={inputStyle} />
        <input type="number" placeholder="Age" value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })} style={inputStyle} />
        <input type="text" placeholder="ID Number" value={formData.idNumber}
          onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} style={inputStyle} />
        <input type="text" placeholder="Role" value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={inputStyle} />
        <input type="file" onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })} style={fileInputStyle} />
        <button type="submit" style={buttonStyle}>Add Employee</button>
      </form>

      <ul style={{ listStyleType: 'none', padding: 0, width: '100%', maxWidth: '500px' }}>
        {employees.map(employee => (
          <li key={employee.id} style={{
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <p style={{ margin: '0', fontWeight: 'bold' }}>{employee.name} {employee.surname}</p>
              <p style={{ margin: '5px 0' }}>{employee.role} | Age: {employee.age}</p>
            </div>
            <button onClick={() => handleDeleteEmployee(employee.id)} style={deleteButtonStyle}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Inline styles for consistency
const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '8px 0',
  borderRadius: '4px',
  border: '1px solid #ddd',
  outline: 'none',
};

const fileInputStyle = {
  padding: '5px',
  margin: '10px 0',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '10px',
};

const deleteButtonStyle = {
  backgroundColor: '#ff4d4f',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '8px 12px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

export default EmployeeList;
