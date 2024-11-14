const express = require('express');
const router = express.Router();
const { addEmployee } = require('../controllers/employeeController');
const upload = require('../middleware/upload'); // Multer middleware

router.post('/employees', upload.single('photo'), addEmployee);

module.exports = router;
