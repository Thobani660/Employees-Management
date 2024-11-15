import { useState, useEffect } from 'react';
import SearchHistory from './search';

function Side() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [position, setPosition] = useState('');
  const [idnumber, setIdnumber] = useState('');
  const [call, setCall] = useState('');
  const [image, setImage] = useState(null); // State to hold the uploaded image
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employeesData');
    if (storedEmployees) {
      const parsedEmployees = JSON.parse(storedEmployees);
      setEmployees(parsedEmployees);
      setFilteredEmployees(parsedEmployees);
    }
  }, []);

  const handleSearchInputChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchInput(searchTerm);
    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm)
    );
    setFilteredEmployees(filtered);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the image state to the uploaded file
      };
      reader.readAsDataURL(file); // Convert image to base64
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for empty inputs
    if (!name || !surname || !position  || !idnumber || !call || !image) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const formData = {
      name,
      surname,
      position,
      
      idnumber,
      call,
      image 
    };

    if (isUpdateFormVisible) {
      const updatedEmployees = employees.map(emp =>
        emp.name === employee.name ? formData : emp
      );
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
      localStorage.setItem('employeesData', JSON.stringify(updatedEmployees));
      console.log("Updated employees data:", updatedEmployees);
      alert("Employee updated successfully!");
      setIsUpdateFormVisible(false);
      setEmployee(null);
      setImage(null);
    } else {
      const newEmployees = [...employees, formData];
      setEmployees(newEmployees);
      setFilteredEmployees(newEmployees); 
      localStorage.setItem('employeesData', JSON.stringify(newEmployees));
      console.log("New employees data stored:", newEmployees);
      alert("Employee added successfully!");
      setImage(null);
    }

    // Reset form fields
    setName('');
    setSurname('');
    setPosition('');
    setEmail('');
    setIdnumber('');
    setCall('');
  };

  const handleDelete = (name) => {
    const newEmployees = employees.filter((employee) => employee.name !== name);
    setEmployees(newEmployees);
    setFilteredEmployees(newEmployees); 
    localStorage.setItem('employeesData', JSON.stringify(newEmployees));
    alert("This Employee will be deleted permanently!!!");
  };

  const handleUpdate = (employeeToUpdate) => {
    setEmployee(employeeToUpdate);
    setName(employeeToUpdate.name);
    setSurname(employeeToUpdate.surname);
    setPosition(employeeToUpdate.position);
    setEmail(employeeToUpdate.email);
    setIdnumber(employeeToUpdate.idnumber);
    setCall(employeeToUpdate.call);
    setImage(employeeToUpdate.image);
    setIsUpdateFormVisible(true);
  };

  return (
    <>
      <div className="side">
        <div className="nav">
          <SearchHistory input={searchInput} onInputChange={handleSearchInputChange} />
          <div className="settings">
            <span className="material-symbols--notifications"></span>
          </div>
          <div id="profile">
            <span className="mdi--invite"></span>
            Add
          </div>
        </div>

        <div className="leon">
          <div>
            <h2 style={{ textShadow: "-1px 2px 0 red", color: "white",width:"400px" }}>welcome to theEmployees Application</h2>
            <h4 style={{color:"#7DF9FF"}}> you can add,delete or seach  Employee</h4>
          </div>
          <div className="circle" style={{ backgroundRepeat: "no-repeat", backgroundSize: "cover" }}></div>
        </div>

        <div className="display">
          <div className="displayhere">
            {isUpdateFormVisible ? (
              <form onSubmit={handleSubmit}>
                <div>
                  <h2 style={{ textShadow: "-1px 2px 0 #7DF9FF", marginLeft: "80px",color:"white" }}>
                    Update Form
                  </h2>
                  <div className="middlecontainer">
                    <div>
                      <input
                        value={name}
                        name="name"
                        id="name"
                        onChange={(event) => setName(event.target.value)}
                        className="name"
                        placeholder={"Full Name"}
                        type="text"
                      />
                      <input
                        value={surname}
                        id="lastname"
                        onChange={(event) => setSurname(event.target.value)}
                        name="surname"
                        className="lastname"
                        placeholder={"Surname"}
                        type="text"
                      />
                    </div>
                    <input
                      placeholder={"Position"}
                      value={position}
                      id="position"
                      onChange={(event) => setPosition(event.target.value)}
                      name="position"
                      className="middleinput"
                      type="text"
                    />
                  </div>

                  <div className="middlecontainer">
                    <div>
                      <input
                        type="text"
                        value={email}
                        id="email"
                        onChange={(event) => setEmail(event.target.value)}
                        name="email"
                        className="position"
                        placeholder={"@Email"}
                      />
                      <input
                        type="text"
                        value={idnumber}
                        id="idnumber"
                        onChange={(event) => setIdnumber(event.target.value)}
                        name="idnumber"
                        className="position"
                        placeholder={"ID number"}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={call}
                        id="call"
                        onChange={(event) => setCall(event.target.value)}
                        name="call"
                        className="position"
                        placeholder={"Phone number"}
                      />
                    </div>
                  </div>

                  <button className="Submit" style={{ marginLeft: "50px", width: "150px", height: "40px" }}>
                    Update
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
  <div>
    <h4 style={{ textShadow: "-1px 2px 0 red", marginLeft: "80px", color: "white" }}>
      SignUp Form
    </h4>
    <div className="middlecontainer">
      <div style={{ flex: 1 }}>
        <input
          value={name}
          name="name"
          id="name"
          onChange={(event) => setName(event.target.value)}
          className="name"
          placeholder={"Full Name"}
          type="text"
        />
        <input
          value={surname}
          id="lastname"
          onChange={(event) => setSurname(event.target.value)}
          name="surname"
          className="lastname"
          placeholder={"Surname"}
          type="text"
        />
      </div>
      <input
        placeholder={"Position"}
        value={position}
        id="position"
        onChange={(event) => setPosition(event.target.value)}
        name="position"
        className="middleinput"
        type="text"
      />
    </div>

    <div className="middlecontainer">
      <div style={{ flex: 1 ,}}>
        <input
          type="file"
          id="imageUpload"
          onChange={(event) => handleImageUpload(event)}
          name="image"
          className="position"
          accept="image/*" 
          style={{backgroundColor:"white",height:"35px"}}
        />
        <input
          type="text"
          value={idnumber}
          id="idnumber"
          onChange={(event) => setIdnumber(event.target.value)}
          name="idnumber"
          className="position"
          placeholder={"ID number"}
        />
      </div>
      <div style={{ flex: 1 }}>
        <input
          type="text"
          value={call}
          id="call"
          onChange={(event) => setCall(event.target.value)}
          name="call"
          className="position"
          placeholder={"Phone number"}
        />
      </div>
    </div>

    <button
      className="Submit"
      style={{ marginLeft: "50px", width: "150px", height: "40px", color: "white", marginTop: "0px" }}
    >
      Submit
    </button>
  </div>
</form>

            )}
            <div className="NewEmployee" style={{ height: "410px", backgroundColor: "transparent", padding: "5px", overflow: "auto", marginLeft: "200px", marginTop: "0px" }}>
              <h2 style={{ position: "absolute", color: "navy", marginTop: "-50px",textShadow: "-1px 2px 0 red",color:"white" }}>My Employee List</h2>

              {filteredEmployees.map((emp, index) => (
                <div key={index} style={{
                  marginTop: "5px",
                  boxShadow: "2px 3px 1px #726c6c",
                  display: "flex",
                  borderRadius: "10px",
                  width: "350px",
                  height: "60px",
                  padding: "5px",
                  backgroundColor: "rgb(12, 12, 85)",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textAlign: "center",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "rgba(255, 255, 255, 0.24)",
                    borderRadius: "100%",
                    marginRight: "10px"
                  }}>
                                          {emp.image && <img src={emp.image} alt="Employee" style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "10px" }} />} 

                  </div>
                  <h4 style={{
                    flex: "1",
                    color: "white",
                    margin: "0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {emp.name}
                  </h4>
                  <button style={{
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    marginLeft: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }} onClick={() => handleDelete(emp.name)}>
                    delete
                  </button>
                  <button style={{
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    marginLeft: "10px",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }} onClick={() => handleUpdate(emp)}>
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Side;
