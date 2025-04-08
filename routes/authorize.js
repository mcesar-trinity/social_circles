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
        const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
        db.query(checkQuery, [username, email], async (err, results) => {
            if(err) {
                console.error('Error checking existing user:', err);
                return res.render('authorize', {
                    type: 'register',
                    error: 'An error occurred. Please try again later.',
                    isUser: false,
                    webTitle: 'Login | Social Circles',
                    title: 'Welcome to Social Circles',
                    username: username,
                    email: email
                });
            }
            //if this user exists with the email
            if(results.length > 0) {
                console.log('User already exists with this email:', email);
                const existingUser = results[0];
                let errorMsg = 'An account already exists';

                if (existingUser.email === email) {
                    errorMsg = 'Account already exists with this email.';
                } else if (existingUser.username === username) {
                    errorMsg = 'Username already taken.';
                }

                return res.render('authorize', {
                    type: 'register',
                    error: errorMsg,
                    webTitle: 'Login | Social Circles',
                    title: 'Welcome to Social Cirlces',
                    isUser: false,
                    username: username,
                    email: email
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
            db.query(query, [username, email, hashedPassword], (err) => {
                if (err) {
                    console.error('Error during user creation:', err);
                    return res.render('authorize', {
                        type: 'register',
                        error: 'An error occurred. Please try again later.',
                        isUser: false,
                        webTitle: 'Login | Social Circles',
                        title: 'Welcome to Social Cirlces',
                        username: username,
                        email: email
                    });
                }

                res.redirect('/authorize/login');
            });
    });
        
    } catch (error) {
        console.error('Error during user creation:', err);
        return res.render('authorize', {
            type: 'register',
            error: 'An error occurred. Please try again later.',
            isUser: false,
            webTitle: 'Login | Social Circles',
            title: 'Welcome to Social Cirlces',
            username: username,
            email: email
        });
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
            return res.redirect('/authorize/login', {
                type: 'login',
                error: 'An error occurred. Please try again later.',
                email: email,
                webTitle: 'Login | Social Circles',
                title: 'Welcome to Social Cirlces',
                isUser: false
            });
        }
        
        //no user found for the email
        if (results.length === 0) {
            console.log('User not found');
            return res.render('authorize', { type: 'login', error: 'Email not found', email: email,  webTitle: 'Login | Social Circles', title: 'Welcome to Social Cirlces', isUser: false});
            /*return res.redirect('/authorize/login', {
                type: 'login',
                error: 'Email not found',
                email: email // preserve email in the form
            });*/
        }

        const user = results[0];

        // Check if password matches
        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) {
                console.log('Error comparing passwords:', err);
                return res.redirect('/authorize/login', {
                    type: 'login',
                    error: 'An error occurred. Please try again later.',
                    email: email,
                    webTitle: 'Login | Social Circles',
                    title: 'Welcome to Social Cirlces',
                    isUser: false
                });
            }

            if(!isMatch) {
                console.log('Password mismatch for user:', email);
                return res.render('authorize', {
                    type: 'login',
                    error: 'Incorrect password',
                    email: email,
                    webTitle: 'Login | Social Circles',
                    title: 'Welcome to Social Cirlces',
                    isUser: false
                });
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
            } /*else {
                console.log('Incorrect password');
                return res.redirect('/authorize/login');
            }*/
        });
    });
});


module.exports = router;
