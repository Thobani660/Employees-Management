import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();  // Hook to programmatically navigate

  
    const handleSignUp = async () => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMessage('Account created successfully!');
        setError('');
        navigate('/signin')
      } catch (error) {
        setError(error.message);
        setSuccessMessage('');
      }
    };

  return (
    <div style={{marginLeft:"500px"}}>
    <div style={styles.formContainer}>
      <h2 style={styles.heading}>Sign Up</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <h5>already have and account? <Link to="/signin">Sign In</Link></h5>
      <button onClick={handleSignUp} style={styles.button}>Sign Up</button>
      {error && <div style={styles.error}>{error}</div>}
      {successMessage && <div style={styles.success}>{successMessage}</div>}
    </div>
    </div>
  );
}

const styles = {
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px',
        borderRadius: '8px',
        width: '300px',
        margin: '0 auto',
        background: "rgba(255, 255, 255, 0.4)",     backdropFilter: "blur(10px)", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    margin: '5px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '100%',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    width: '100%',
  },
  error: {
    marginTop: '10px',
    color: 'red',
    fontSize: '14px',
  },
  success: {
    marginTop: '10px',
    color: 'green',
    fontSize: '14px',
  },
};

export default SignUp;
