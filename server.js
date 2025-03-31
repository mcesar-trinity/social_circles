require('dotenv').config();
const express = require('express');
const app = express();
const mysql = require('mysql2');
const path = require('path');
const PORT = process.env.PORT || 9000;
const db = require('./db');

//Import Routes
const home = require('./routes/home.js');
const authorize = require('./routes/authorize.js');
const dashboard = require('./routes/dashboard.js');
const characters = require('./routes/characters.js');
const game = require('./routes/game.js');
const leaderboard = require('./routes/leaderboard.js');

//view engine setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/static', express.static(__dirname));

//Use Routes
app.use('/', home);
app.use('/authorize', authorize);
app.use('/dashboard', dashboard);
app.use('/characters', characters);
app.use('/game', game);
app.use('/leaderboard', leaderboard);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));