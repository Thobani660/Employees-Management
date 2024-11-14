require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Firebase Admin SDK with environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  storageBucket: "employeesmanagement-fbcfb.appspot.com",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
res.send("Welcome")  
})

// Multer setup for file upload handling
const upload = multer({ storage: multer.memoryStorage() });

// Add Employee endpoint
app.post('/employees', upload.single('photo'), async (req, res) => {
  try {
    const { name, surname, age, idNumber, role } = req.body;
    const file = req.file;

    if (!name || !surname || !age || !idNumber || !role) {
      return res.status(400).send({ message: 'All fields are required' });
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

    res.status(201).send({ id: employeeRef.id, message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
});

// Get all employees endpoint
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

// Get employee by ID endpoint
app.get('/employees/:id', async (req, res) => {
  try {
    const employeeDoc = await db.collection('employees').doc(req.params.id).get();
    if (!employeeDoc.exists) {
      return res.status(404).send({ message: 'Employee not found' });
    }
    res.send({ id: employeeDoc.id, ...employeeDoc.data() });
  } catch (error) {
    console.error('Error getting employee:', error);
    res.status(500).send({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
