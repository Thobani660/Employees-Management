import { useState, useEffect } from 'react';

function Side() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    Surname: '',
    Position: '',
    Email: '',
    Idnumber: '',
    Call: '',
    Fax: '',
  });
  const [updateMode, setUpdateMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDelete = (id) => {
    const newEmployees = employees.filter((employee) => employee.Id !== id);
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmployee = { ...formData, Id: new Date().getTime() };
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    localStorage.setItem('employees', JSON.stringify(employees));
    setFormData({
      name: '',
      email: '',
      Surname: '',
      Position: '',
      Email: '',
      Idnumber: '',
      Call: '',
      Fax: '',
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedEmployee = { ...selectedEmployee, ...formData };
    const newEmployees = employees.map((employee) =>
      employee.Id === selectedEmployee.Id ? updatedEmployee : employee
    );
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees));
    setUpdateMode(false);
    setSelectedEmployee(null);
  };

  const handleEdit = (employee) => {
    setUpdateMode(true);
    setSelectedEmployee(employee);
    setFormData(employee);
  };

  return (
    <div className="side">
      <div className="nav">
        {/* ... */}
      </div>

      <div className="leon">
        {/* ... */}
      </div>

      <div className="display">
        <div className="displayhere">
          <form onSubmit={updateMode ? handleUpdate : handleSubmit}>
            {/* ... */}
            {updateMode ? (
              <button type="submit">Update</button>
            ) : (
              <button type="submit">Submit</button>
            )}
          </form>
          <div className="NewEmployee">
            {employees.map((employee) => (
              <div key={employee.Id}>
                <h5>{employee.name}</h5>
                <button className="edit" onClick={() => handleEdit(employee)}>
                  Edit
                </button>
                <button className="delete" onClick={() => handleDelete(employee.Id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ... */}
    </div>
  );
}

export default Side;