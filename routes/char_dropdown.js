//char_dropdown.js 
const express = require('express');
const router = express.Router();
const db = require('../db'); // Database connection

//Route to display characters in the dropdown
router.get('/', (req, res) => { // Change to '/' so it matches /char_dropdown
    db.query('SELECT * FROM game_characters', (err, characters) => {
        if (err) {
           console.error(err);
            return res.status(500).send('Internal Server Error');
             }
res.render('char_dropdown', { characters }); // Render the EJS file with character data
});
});


module.exports = router;