const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db, bucket } = require('./firebase'); // Import Firebase configuration

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

// Sign-Up Endpoint
app.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required.' });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    res.status(201).send({
      message: 'User created successfully',
      user: { uid: userRecord.uid, email: userRecord.email, displayName: userRecord.displayName },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send({ message: error.message });
  }
});

// Sign-In Endpoint
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required.' });
    }

    // Simulate Firebase Auth Login (server-side login without actual client authentication)
    const userRecord = await admin.auth().getUserByEmail(email);

    if (!userRecord) {
      return res.status(404).send({ message: 'User not found.' });
    }

    res.status(200).send({
      message: 'Signed in successfully',
      user: { uid: userRecord.uid, email: userRecord.email, displayName: userRecord.displayName },
    });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).send({ message: error.message });
  }
});

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Add Employee Endpoint
app.post('/employees', upload.single('photo'), async (req, res) => {
  try {
    const { name, surname, age, idNumber, role } = req.body;
    const file = req.file;

    if (!name || !surname || !age || !idNumber || !role) {
      return res.status(400).send({ message: 'All fields are required.' });
    }

    const employeeRef = db.collection('employees').doc();
    let photoURL = '';

    if (file) {
      const blob = bucket.file(`employees/${employeeRef.id}/${file.originalname}`);
      await blob.save(file.buffer, { contentType: file.mimetype });
      photoURL = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    }

    await employeeRef.set({
      name,
      surname,
      age,
      idNumber,
      role,
      photoURL,
    });

    res.status(201).send({ id: employeeRef.id, message: 'Employee added successfully.' });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
});

// Fetch All Employees
app.get('/employees', async (req, res) => {
  try {
    const snapshot = await db.collection('employees').get();
    const employees = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(employees);
  } catch (error) {
    console.error('Error getting employees:', error);
    res.status(500).send({ message: error.message });
  }
});

// Fetch Employee by ID
app.get('/employees/:id', async (req, res) => {
  try {
    const employeeDoc = await db.collection('employees').doc(req.params.id).get();
    if (!employeeDoc.exists) {
      return res.status(404).send({ message: 'Employee not found.' });
    }
    res.send({ id: employeeDoc.id, ...employeeDoc.data() });
  } catch (error) {
    console.error('Error getting employee:', error);
    res.status(500).send({ message: error.message });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
