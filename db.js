const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Goten1!!',
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if(err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});

module.exports = connection;