// user account page !!

// if (!req.session.user) return res.redirect('/authorize/login');

const express = require('express');
const router = express.Router();
const db = require('../db');

router.get("/", (req, res) => {
    res.render("dashboard");
});

module.exports = router;