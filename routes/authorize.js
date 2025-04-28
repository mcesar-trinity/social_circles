// ===============================================

// Login and Registration page!! (Authentication Routes)
// This page handles user login and registration functions

// ===============================================


// It is connected to the MySQL database to verify no other users have the same emails/usernames
// It also manages user session creation after a successful login

// ===============================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');


// ===============================================

//Render the Login page

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

// ===============================================

//Render the Registration page

router.get('/register', (req, res) => {
    isUser = (req.session.user) ? true : false;

    res.render('authorize', { 
        type: 'register',
        webTitle: 'Login | Social Circles',
        title: 'Welcome to Social Cirlces',
        isUser: isUser});
})

// ===============================================

//Handles user registration form submissions

router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    //STEP 1: Checking if passwords match
    if(password !== confirmPassword) {
        return res.render('authorize', {
            type: 'register',
            error: 'Passwords do not match.',
            isUser: false,
            webTitle: 'Register | Social Circles',
            title: 'Welcome to Social Circles',
            username,
            email
        });
    }
    
    try {
        // STEP 2: Check if username or email already exists
        const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
        db.query(checkQuery, [username, email], async (err, results) => {
            if (err) {
                console.error('Error checking existing user:', err);
                return res.render('authorize', {
                    type: 'register',
                    error: 'An error occurred while checking your information. Please try again later.',
                    isUser: false,
                    webTitle: 'Register | Social Circles',
                    title: 'Welcome to Social Circles',
                    username,
                    email
                });
            }

            if (results.length > 0) {
                const existingUser = results[0];
                let errorMsg = 'An account already exists.';

                if (existingUser.email === email) {
                    errorMsg = 'An account already exists with this email.';
                } else if (existingUser.username === username) {
                    errorMsg = 'This username is already in use.';
                }

                return res.render('authorize', {
                    type: 'register',
                    error: errorMsg,
                    isUser: false,
                    webTitle: 'Register | Social Circles',
                    title: 'Welcome to Social Circles',
                    username,
                    email
                });
            }

            //STEP 3: No conflicts => proceed with creating the user
            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                (err, results) => {
                    if (err) {
                        console.error('Error inserting user:', err);
                        return res.render('authorize', {
                            type: 'register',
                            error: 'Failed to create account. Please try again.',
                            isUser: false,
                            webTitle: 'Register | Social Circles',
                            title: 'Welcome to Social Circles',
                            username,
                            email
                        });
                    }

                    const userId = results.insertId;

                    //STEP 4: Initialize the user's happiness scores for all game characters
                    db.query('SELECT id FROM game_characters', (err, characters) => {
                        if (err) {
                            console.error('Error fetching characters:', err);
                            return res.render('authorize', {
                                type: 'register',
                                error: 'Failed to initialize user scores.',
                                isUser: false,
                                webTitle: 'Register | Social Circles',
                                title: 'Welcome to Social Circles',
                                username,
                                email
                            });
                        }

                        // Build bulk insert array
                        const inserts = characters.map(character => [userId, character.id, 0]);

                        db.query(
                            'INSERT INTO user_character_score (user_id, character_id, happiness_score) VALUES ?',
                            [inserts],
                            (err2, results2) => {
                                if (err2) {
                                    console.error('Error inserting user scores:', err2);
                                    return res.render('authorize', {
                                        type: 'register',
                                        error: 'Failed to initialize user scores.',
                                        isUser: false,
                                        webTitle: 'Register | Social Circles',
                                        title: 'Welcome to Social Circles',
                                        username,
                                        email
                                    });
                                }

                                console.log('User and scores initialized successfully.');
                                return res.redirect('/authorize/login');
                            }
                        );
                    });
                }
            );
        });
    } catch (err) {
        console.error('Registration failed:', err);
        return res.render('authorize', {
            type: 'register',
            error: 'An unexpected error occurred. Please try again later.',
            isUser: false,
            webTitle: 'Register | Social Circles',
            title: 'Welcome to Social Circles',
            username,
            email
        });
    }
});


// ===============================================

//Handle user login form submission

// ===============================================
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Attempting login for email:', email);

    // STEP 1: Find user by email
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
        
        // STEP 1a: If the user isn't found then return an error message.
        if (results.length === 0) {
            console.log('User not found');
            return res.render('authorize', { type: 'login', error: 'Email not found', email: email,  webTitle: 'Login | Social Circles', title: 'Welcome to Social Cirlces', isUser: false});
        }

        const user = results[0];

        // STEP 2: Compare provided password with hashed password
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

            //STEP 2a: If passwords don't match, return an error message.
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


            // STEP 3: Password matches, so create a session
            if (isMatch) {
                console.log('Password match:', isMatch);

                // Set session data
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    name: user.username, //defaults to username !
                    profile_color: user.profile_color,
                }

                console.log('Session set for user:', req.session.user);

                // Redirect to homepage
                return res.redirect('/');
            } 
        });
    });
});

// ===============================================
//Exporting router

module.exports = router;
