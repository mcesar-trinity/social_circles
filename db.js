const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Blue2004',
    database: 'social_game'
     //// Use quotes or backticks if you include spaces
});

connection.connect((err) => {
    if(err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});

module.exports = connection;