// sign in page !!

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

//Login page
router.get('/login', (req, res) => {
    res.render('authorize', { 
        type: 'login',
        webTitle: 'Login | Social Circles',
        title: 'Welcome to Social Cirlces',
    });
});


//Register page
router.get('/register', (req, res) => {
    res.render('authorize', { 
        type: 'register',
        webTitle: 'Login | Social Circles',
        title: 'Welcome to Social Cirlces',});
})

//POST register user

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
        db.query(query, [username, email, hashedPassword], (err) => {
            if (err) {
                console.error('Error during user creation:', err);
                return res.send('Error creating user');
            }
            res.redirect('/authorize/login');
        });
    } catch (error) {
        console.error('Error dyring bcrypt password hashing:', error);
        res.send('Error creating user');
    }
});

//POST login user
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) return res.send('User not found');
        const match = await bcrypt.compare(password, results[0].password_hash);
        if(match){
            req.session.user = { id: results[0].id, username: results[0].username };
            res.redirect('/dashboard');
        } else{
            res.send('Incorrect password');
        }
    });
});

module.exports = router;
