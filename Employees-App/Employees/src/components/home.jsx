import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={{
        background: "rgba(255, 255, 255, 0.4)", 
        backdropFilter: "blur(10px)", 
        width: "1335px", 
        padding: "20px", 
        textAlign: "center", 
        height: "200px", 
        borderRadius: "10px", 
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        marginLeft:"5px"
      }}>
        <h1 style={{ fontSize: "2rem", color: "#333", marginBottom: "20px" }}>Welcome to Employee Management</h1>
        <p style={{ fontSize: "1.2rem", color: "#555", marginBottom: "30px" }}>Choose an option below:</p>
        <Link to="/signup" style={{ textDecoration: "none" }}>
          <button style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px",
            margin: "0 10px",
            fontSize: "1rem",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.3)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
          }}>Sign Up</button>
        </Link>
        <Link to="/signin" style={{ textDecoration: "none" }}>
          <button style={{
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            padding: "10px",
            margin: "0 10px",
            fontSize: "1rem",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.3)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
          }}>Sign In</button>
        </Link>
        <Link to="/main" style={{ textDecoration: "none" }}>
          <button style={{
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            padding: "10px ",
            margin: "0 10px",
            fontSize: "1rem",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.3)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
          }}>Main</button>
        </Link>
      </div>
      
      
  );
}

export default LandingPage;
