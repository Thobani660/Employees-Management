const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const { auth } = require('./config/firebase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require("dotenv").config()
const firebase = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Routes

// Test Route
app.get('/', (req, res) => {
  res.send('Employee Management Server is Running!');
});

// Add an Employee
app.post('/addEmployee', upload.single('image'), async (req, res) => {
  try {
    const { id, name, email, position } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).send('No image file uploaded');
    }

    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      contentType: file.mimetype,
      public: true,
      metadata: { firebaseStorageDownloadTokens: fileName },
    });

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;

    // Save employee data to Firestore
    await db.collection('employees').doc(id).set({
      name,
      email,
      position,
      image: imageUrl, // Save the image URL
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send('Employee added successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get All Employees
app.get('/employees', async (req, res) => {
  try {
    const snapshot = await db.collection('employees').get();
    const employees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Employee by ID
app.get('/employee/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('employees').doc(id).get();
    if (!doc.exists) {
      return res.status(404).send('Employee not found');
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update an Employee
app.put('/employees/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, position } = req.body;
    const file = req.file;

    // Get current employee data
    const docRef = db.collection('employees').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).send('Employee not found');
    }

    let updatedData = { name, email, position };

    // If there is a new image, upload and update the image URL
    if (file) {
      const fileName = `${Date.now()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);
      
      await fileUpload.save(file.buffer, {
        contentType: file.mimetype,
        public: true,
        metadata: { firebaseStorageDownloadTokens: fileName },
      });

      updatedData.image = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
    }

    updatedData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    // Update employee data in Firestore
    await docRef.update(updatedData);

    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an Employee
app.delete('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection('employees').doc(id);

    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await docRef.delete();

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search Employee by Name
app.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    const snapshot = await db.collection('employees').where('name', '==', name).get();
    if (snapshot.empty) {
      return res.status(404).send('No matching employees found');
    }

    const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send(error.message);
  }
});



// Firebase Authentication: Sign In
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    // Firebase Admin SDK doesn't directly verify passwords. This should be handled on the frontend with Firebase Client SDK.
    // If you need to use Firebase Admin SDK to verify the user by UID, use the method below:
    
    const user = await admin.auth().getUserByEmail(email);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Assuming password validation is handled on the client-side (use Firebase Client SDK).
    res.status(200).json({ message: 'Signed in successfully', uid: user.uid });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Firebase Authentication: Sign Up
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Create a new user with Firebase Authentication
    const userRecord = await auth.createUser ({
      email: email,
      password: password,
    });

    // Respond with success
    res.status(201).json({ message: 'User  created successfully!', uid: userRecord.uid });
  } catch (error) {
    // Handle errors
    console.error('Error creating new user:', error);
    res.status(400).json({ message: error.message });
  }
});
  



// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
