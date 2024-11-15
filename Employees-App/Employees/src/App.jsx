import './App.css';
import Aside from './components/aside';
import Side from './components/side';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/signin';
import SignUp from './components/signup';
import LandingPage from './components/home';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [user, setUser] = useState(null);  // Track user authentication state

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employeesData');
    if (storedEmployees) {
      const parsedEmployees = JSON.parse(storedEmployees);
      setEmployees(parsedEmployees);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);  // Set the user when authentication state changes
    });

    return () => unsubscribe();  // Clean up the listener when the component is unmounted
  }, []);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    alert('Employee selected!');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={user ? (
          <div className="flex-container">
            <Aside employee={selectedEmployee} />
            <Side handleEmployeeClick={handleEmployeeClick} />
          </div>
        ) : (
          <div>Please sign in to access the dashboard.</div>
        )} />
      </Routes>
    </Router>
  );
}

export default App;
