const { db, bucket } = require('../config/firebase');

// Add Employee
const addEmployee = async (req, res) => {
  const { name, surname, age, idNumber, role } = req.body;
  const file = req.file;
  const employeeRef = db.collection('employees').doc();
  let photoURL = '';

  if (file) {
    const blob = bucket.file(`employees/${employeeRef.id}/${file.originalname}`);
    await blob.save(file.buffer, { contentType: file.mimetype });
    photoURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
  }

  try {
    await employeeRef.set({
      name,
      surname,
      age,
      idNumber,
      role,
      photoURL,
    });
    res.status(201).json({ message: 'Employee added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Other CRUD functions (update, delete, get)
module.exports = { addEmployee };
