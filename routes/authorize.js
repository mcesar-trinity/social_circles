// sign in page !!

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
var sess; 

//Login page
router.get('/login', (req, res) => {
    isUser = (req.session.user) ? true : false;
    console.log('GET /authorize/login');
    res.render('authorize', { 
        type: 'login',
        webTitle: 'Login | Social Circles',
        title: 'Welcome to Social Cirlces',
        isUser: isUser
    });
});


//Register page
router.get('/register', (req, res) => {
    isUser = (req.session.user) ? true : false;

    res.render('authorize', { 
        type: 'register',
        webTitle: 'Login | Social Circles',
        title: 'Welcome to Social Cirlces',
        isUser: isUser});
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
    console.log('Attempting login for email:', email);

    // Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.log('Error querying database:', err);
            return res.redirect('/authorize/login');
        }
        
        if (results.length === 0) {
            console.log('User not found');
            return res.redirect('/authorize/login');
        }

        const user = results[0];

        // Check if password matches
        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) {
                console.log('Error comparing passwords:', err);
                return res.redirect('/authorize/login');
            }

            if (isMatch) {
                console.log('Password match:', isMatch);

                // Set session data
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    name: user.username, // Assuming `username` is the name you want to show
                };

                console.log('Session set for user:', req.session.user);

                // Redirect to dashboard
                return res.redirect('/');
            } else {
                console.log('Incorrect password');
                return res.redirect('/authorize/login');
            }
        });
    });
});


//log out router

router.get('/logout', (req, res) => {
    console.log('Logging out user:', req.session.user);
    req.session.destroy((err) => {
        if(err) console.error('Error destroying session:', err);
        res.redirect('/authorize/login');
    });
})

module.exports = router;
