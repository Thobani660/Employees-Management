const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const multer = require('multer');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-project-id>.firebaseio.com",
  storageBucket: "<your-project-id>.appspot.com",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

const app = express();
const PORT = 5000;

// Middleware
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

// File Upload to Firebase Storage (Optional standalone route)
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const blob = bucket.file(`uploads/${file.originalname}`);
    const stream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    stream.end(file.buffer);
    stream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res.status(200).send({ message: 'File uploaded successfully', url: publicUrl });
    });

    stream.on('error', (error) => {
      res.status(500).send(error.message);
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Sign up user (store user data in Firestore)
app.post('/signup', async (req, res) => {
  try {
    const { email, password, name, position } = req.body;

    if (!email || !password || !name || !position) {
      return res.status(400).send('All fields are required');
    }

    // Create user in Firebase Authentication (if using email/password auth)
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    // Save user data to Firestore
    const userRef = db.collection('users').doc(userRecord.uid);
    await userRef.set({
      email: email,
      name: name,
      position: position,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
