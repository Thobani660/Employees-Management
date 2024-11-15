import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';  // Import Firebase auth
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase method for sign-in

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();  // Hook to programmatically navigate

  // Validate email format
  const isValidEmail = email.includes('@');

  const handleSignIn = async () => {
    // Check if email and password are valid
    if (!email || !password) {
      setError('Please enter both email and password.');
      setSuccessMessage('');
      return;
    }

    if (!isValidEmail) {
      setError('Please enter a valid email address.');
      setSuccessMessage('');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage('Logged in successfully!');
      setError('');
      navigate('/main');  // Redirect to main page after successful login
    } catch (error) {
      console.error(error);
      setError(error.message);  // Set Firebase error message
      setSuccessMessage('');
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.heading}>Sign In</h2>
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
      <h5>Don't have an account? <Link to="/signup">Sign Up</Link></h5>

      <button onClick={handleSignIn} style={styles.button}>Sign In</button>

      {error && <div style={styles.error}>{error}</div>}
      {successMessage && <div style={styles.success}>{successMessage}</div>}
    </div>
  );
}

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
    margin: '0 auto',
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

export default SignIn;
