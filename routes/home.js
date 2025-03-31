// home page!!

const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("home", {title: 'Social Circle Game', webTitle: 'Home Page'});
});

module.exports = router;
