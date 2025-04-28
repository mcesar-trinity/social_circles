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
    const { username, email, password, confirmPassword } = req.body;

    //Checking if passwords match
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
        // Check if the username or email is already in use
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

            // No conflicts, go ahead and create the user
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
                    name: user.username, 
                    profile_color: user.profile_color,
                }

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
