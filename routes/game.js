// game / task selection page !!

const express = require('express');
const router = express.Router();
const db = require('../db');

router.get("/", (req, res) => {
    res.render("game");
});

module.exports = router;