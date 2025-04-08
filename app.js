const express = require('express');
const path = require('path');
const db = require('./db'); // Ensure this path is correct
const leaderboardRoutes = require('./routes/leaderboard');
const homeRouter = require('./routes/home'); // Ensure this path is correct
const characterRoutes = require('./routes/character'); // Ensure this path is correct

const app = express();
const PORT = process.env.PORT || 9000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', homeRouter); // Handle root routes first
app.use('/characters', characterRoutes); // Handle character routes
app.use('/leaderboard', leaderboardRoutes); // Handle leaderboard routes

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});