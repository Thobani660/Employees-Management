import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div>
      <h1>Welcome to Employee Management</h1>
      <p>Choose an option below:</p>
      <Link to="/signup">
        <button>Sign Up</button>
      </Link>
      <Link to="/signin">
        <button>Sign In</button>
      </Link>
      <Link to="/main">
        <button>Main</button>
      </Link>
    </div>
  );
}

export default LandingPage;
