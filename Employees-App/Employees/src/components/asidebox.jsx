import React, { useState, useEffect } from 'react';

function Asidebox() {
  const [lastEmployee, setLastEmployee] = useState(null);

  useEffect(() => {
    const fetchLastEmployee = () => {
      const storedData = localStorage.getItem("employeesData");
      if (storedData) {
        const employeesArray = JSON.parse(storedData);
        const lastEmployee = employeesArray[employeesArray.length - 1];
        setLastEmployee(lastEmployee);
      }
    };

    fetchLastEmployee();

    // Update the last employee when local storage changes
    const handleStorageChange = () => {
      fetchLastEmployee();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="asidebox">
      {lastEmployee ? (
        <div>
          <div className="vert"> {lastEmployee.name}</div>
          <div className="vert"> {lastEmployee.surname}</div>
          <div className="vert"> {lastEmployee.position}</div>
          <div className="vert"> {lastEmployee.email}</div>
          <div className="vert"> {lastEmployee.idnumber}</div>
        </div>
      ) : (
         <div>
          <div className="vert">No employee data </div>
          <div className="vert"> No employee data </div>
          <div className="vert"> No employee data </div>
          <div className="vert"> No employee data </div>
          <div className="vert"> No employee data </div>
        </div>
      )}
      <div className="vertpic">
        <br />
        Do you need help? <span className="ic--outline-live-help"></span>
        <br />
        Click the button below
        <br />
        <button className="Help">Help</button>
      </div>
    </div>
  );
}

export default Asidebox;
