require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const mysql = require('mysql2');
const path = require('path');
const PORT = process.env.PORT || 9000;
const db = require('./db');
const sessions = require('express-session');

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions( { 
    secret: "D3velop1ngAnS0methingUnpr3dictable",
    resave: true,
    saveUninitialized: false,
    cookie: {}
}));

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
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/static', express.static(__dirname));
app.use(session({
    secret: process.env.SESSION_SECRET || 'socialcircles-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false}
}));

//redirecting authorize to authorize login
app.get('/authorize', (req, res) => {
    res.redirect('/authorize/login');
})

//Use Routes
app.use('/', home);
app.use('/authorize', authorize);
app.use('/dashboard', dashboard);
app.use('/characters', characters);
app.use('/game', game);
app.use('/leaderboard', leaderboard);

app.use((req, res, next) => {
    console.log('[$new Date().toISOString()}] ${req.method} ${req.url}');
    console.log('Session contents:', req.session);
    next();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));