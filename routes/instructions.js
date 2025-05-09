// home page!!

const express = require('express');
const router = express.Router();

//Creates home page based on user's permission (are they logged in or not?)
router.get("/", (req, res) => {
    res.render("instructions", { title: 'Social Circle Game', webTitle: 'Instructions Page' });
});

module.exports = router;