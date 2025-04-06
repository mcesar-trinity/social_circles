const express = require('express');
const router = express.Router();
const db = require('../db'); // Ensure this path is correct

// Route for the home page
router.get('/', (req, res) => {
    console.log("index");
    res.render('index', { title: 'Welcome to Social Circles' });
});

module.exports = router; // Ensure you export the router