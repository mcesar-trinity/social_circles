// ==============================================
// User profile page / dashboard routes

// ==============================================
//Handles the dashboard/account display, editing profiles,
        // and admin management of tasks, users, and game characters
// ==============================================
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');


// ==============================================
//render the dashboard page with user profile info
router.get('/', (req, res) => {
    const user = req.session.user;
    console.log('GET /dashboard - session user:', user);

    //redirect if user is not logged in
    if(!user) {
        console.log('User not logged in. Redirecting to /authorize/login');
        return res.redirect('/authorize/login'); 
    }

    const userId = user.id;
    const pageTitle = 'Dashboard | Social Circles'
    const getUserScore = 'SELECT max_happiness_score FROM users WHERE id = ?';

    db.query(getUserScore, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user score:', err);
            return res.status(500).send('Server error');
        }

        const happinessScore = result[0]?.max_happiness_score || 0;


        // Admin view for tasks, characters, and users
        if (user.role === 'admin') {
            db.query('SELECT tasks.*, task_categories.name AS category_name FROM tasks JOIN task_categories ON tasks.category_id = task_categories.id', (err, tasks) => {
                if (err) throw err;

                db.query('SELECT * FROM game_characters', (err, gameCharacters) => {
                    if (err) throw err;
                    db.query('SELECT * FROM task_categories', (err, categories) => {
                        if (err) throw err;
                        db.query('SELECT id, username, email, role FROM users', (err, users) =>{
                            if(err) throw err;
                            res.render('dashboard', { user, isAdmin: true, tasks, gameCharacters, categories, users, title: pageTitle , happinessScore});
                        });
                    });
                });
            });
        } else {
            //View for a regular user
            res.render('dashboard', { user, 
                isAdmin: false, 
                title: pageTitle, 
                happinessScore,
                categories:[],
                tasks: [],
                gameCharacters: [],
                users: []
            });
        }
    });

});

// ==============================================
// Editing profile (username, email, password updating)
router.post('/edit', (req, res) => {
    console.log('Form submitted', req.body);
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.session.user?.id;

    if (!userId) {
        console.log('No userId in session');
        return res.redirect('/dashboard');
    }

    if(!name) {
        console.log('name cannot be emputy');
        return res.status(400).send('name cannot be empty');
    }

    // Fetch current password hash from DB
    db.query('SELECT password_hash FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Server error');
        }

        const user = results[0];
        if (!user) return res.status(404).send('User not found');

        // If changing password
        if (newPassword && currentPassword) {
            bcrypt.compare(currentPassword, user.password_hash, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).send('Server error');
                }

                if (!isMatch) {
                    return res.redirect('/dashboard?error=incorrectPassword');
                }

                // Hash new password and update
                bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                    if (err) {
                        console.error('Error hashing password:', err);
                        return res.status(500).send('Server error');
                    }

                    db.query(
                        'UPDATE users SET username = ?, email = ?, password_hash = ? WHERE id = ?',
                        [name, email, hashedPassword, userId],(err) => {
                            if (err) {
                                console.error('Error updating user:', err);
                                return res.status(500).send('Server error');
                            }

                            req.session.user.username = name;
                            req.session.user.email = email;
                            req.session.user.name = name;

                            req.session.save((err) => {
                                if (err) {
                                    console.error('Error saving session:', err);
                                    return res.status(500).send('Session save error');
                                }
                                console.log('Session saved successfully');
                                res.redirect('/dashboard?success=profileUpdated');
                            });
                        }
                    );
                });
            });
        } else {
            // No password change, just the email and username
            db.query(
                'UPDATE users SET username = ?, email = ? WHERE id = ?',
                [name, email, userId],
                (err) => {
                    if (err) {
                        console.error('Error updating user:', err);
                        return res.status(500).send('Server error');
                    }
                    req.session.user.username = name;
                    req.session.user.name = name;
                    req.session.user.email = email;
                    req.session.save((err) => {
                        if (err) {
                            console.error('Error saving session:', err);
                            return res.status(500).send('Session save error');
                        }
                        console.log('Session saved successfully');
                        res.redirect('/dashboard?success=profileUpdated');
                    });
                }
            );
        }
    });

});

// ==============================================
//handle profile deleting
router.post('/delete', (req, res) => {
    const loggedInUser = req.session.user;

    if(!loggedInUser) return res.redirect('/leaderboard');

    const userId = loggedInUser.id;
    
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) throw err;
        req.session.destroy(); //log user out
        res.redirect('/'); //redirect to home page after deleting
    });
});

// ==============================================
//log out router
router.get('/logout', (req, res) => {
    console.log('Logging out user:', req.session.user);
    req.session.destroy((err) => {
        if(err) console.error('Error destroying session:', err);
        return res.status(500).send('Server error during logout');
    });
    res.redirect('/');
});

router.post('/logout', (req, res) => {
    console.log('Logging out user:', req.session.user);
    req.session.destroy((err) => {
        if(err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Server error during logout');
        }
        res.redirect('/');
    });
});


// ==============================================
// ADMIN FUNCTIONALITY

// ==============================================
// middleware to only allow admin access


function isAdmin(req, res, next) {
    if(req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Forbidden');
}

// ==============================================
//admin management adding task
router.get('/admin/add-task', isAdmin, (req, res) => {
    db.query('SELECT * FROM task_categories', (err, categories) => {
        if(err) throw err;
        res.render('admin/add-task', { categories });
    });
});

// admin management form submission for adding a task
router.post('/admin/add-task', isAdmin, (req, res) => {
    console.log('Add task route hit', req.body);
    const { taskName, category_id} = req.body;
    
    db.query(
        'INSERT INTO tasks (name, category_id) VALUES (?, ?)',
        [taskName, category_id],
        (err, result) => {
            if (err) {
                console.error('Error adding task:', err);
                return res.status(500).send('Server error while adding task');
            }
            console.log('Task added successfully.');
            res.redirect('/dashboard');
        }
    );
});

// ==============================================
//admin management editing user
router.post('/admin/edit-user', isAdmin, (req, res) => {
    const { userId, newName, newEmail } = req.body;
    const loggedInUserId = req.session.user.id; // current admin logged in

    db.query('UPDATE users SET username = ?, email = ? WHERE id = ?', 
        [newName, newEmail, userId], (err, results) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).send('Server error');
            }

            // Check if admin edited their own account
            if (parseInt(userId) === parseInt(loggedInUserId)) {
                // Update session
                req.session.user.username = newName;
                req.session.user.email = newEmail;
                req.session.user.name = newName; // if you also use `name` in session
            }

            res.redirect('/dashboard');
        });
});


// ==============================================
//admin management deleting user
router.post('/admin/delete-user', isAdmin, (req, res) => {
    const { userId } = req.body;

    // STEP 1: Delete from user_character_score
    db.query('DELETE FROM user_character_score WHERE user_id = ?', [userId], (err, result) => {
        if (err) {
            console.error('Error deleting from user_character_score:', err);
            return res.status(500).send('Error deleting character scores');
        }

        // STEP 2: Delete from leaderboard
        db.query('DELETE FROM leaderboard WHERE user_id = ?', [userId], (err, result) => {
            if (err) {
                console.error('Error deleting from leaderboard:', err);
                return res.status(500).send('Error deleting leaderboard entry');
            }

            // STEP 3: Finally, delete from users
            db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
                if (err) {
                    console.error('Error deleting user:', err);
                    return res.status(500).send('Error deleting user');
                }
                res.redirect('/dashboard');
            });
        });
    });
});


// ==============================================
//admin management editing task
router.post('/admin/edit-task', isAdmin, (req, res) => {
    const { taskId, taskDescription} = req.body;
    db.query('UPDATE tasks SET description = ? WHERE id = ?', [taskDescription, taskId], (err, result) => {
        if (err) throw err;
        res.redirect('/dashboard');
    })
})

// ==============================================
//admin management delete task
router.post('/admin/delete-task', isAdmin, (req, res) => {
    const { taskId } = req.body;
    db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, result) => {
        if (err) throw err;
        res.redirect('/dashboard');  // Redirect to dashboard after task deletion
    });
});

// ==============================================
// Route for adding game characters
router.get('/admin/add-character', isAdmin, (req, res) => {
    res.render('admin/add-character');
});

// ==============================================
// admin management form submission for adding a character
router.post('/admin/add-character', isAdmin, (req, res) => {
    const { name, loves, likes, dislikes, hates, activity_durability, description, npm_picture, color } = req.body;
    
    const lovesArray = Array.isArray(loves) ? loves : [];
    const likesArray = Array.isArray(likes) ? likes : [];
    const dislikesArray = Array.isArray(dislikes) ? dislikes : [];
    const hatesArray = Array.isArray(hates) ? hates : [];

    const lovesString = lovesArray.join(', ');
    const likesString = likesArray.join(', ');
    const dislikesString = dislikesArray.join(', ');
    const hatesString = hatesArray.join(', ');

    // Step 1: Insert into game_characters
    db.query(
        'INSERT INTO game_characters (name, loves, likes, dislikes, hates, activity_durability, description, npc_picture, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, lovesString, likesString, dislikesString, hatesString, activity_durability, description, npm_picture, color],
        (err, result) => {
            if (err) {
                console.error('Error adding character', err);
                return res.status(500).send('Server Error while adding character.');
            }

            const newCharacterId = result.insertId;

            // Step 2: Insert into user_character_score
            db.query('SELECT id FROM users', (err, users) => {
                if (err) {
                    console.error('Error fetching users', err);
                    return res.status(500).send('Server Error while fetching users.');
                }

                const userScoreInserts = users.map(user => [user.id, newCharacterId, 0, null]); // happiness 0, durability NULL

                db.query(
                    'INSERT INTO user_character_score (user_id, character_id, happiness_score, durability_score) VALUES ?',
                    [userScoreInserts],
                    (err) => {
                        if (err) {
                            console.error('Error inserting user character scores', err);
                            return res.status(500).send('Server Error inserting user character scores.');
                        }

                        // Step 3: Insert into character_likes_dislikes
                        const allCategories = [...lovesArray, ...likesArray, ...dislikesArray, ...hatesArray];
                        if (allCategories.length === 0) {
                            return res.redirect('/dashboard');
                        }

                        const placeholders = allCategories.map(() => '?').join(', ');
                        const query = `SELECT id, name FROM task_categories WHERE name IN (${placeholders})`;

                        db.query(query, allCategories, (err, categoryRows) => {
                            if (err) {
                                console.error('Error fetching category IDs', err);
                                return res.status(500).send('Server Error fetching category IDs.');
                            }

                            const nameToId = {};
                            categoryRows.forEach(row => {
                                nameToId[row.name] = row.id;
                            });

                            const likesDislikesInserts = [];

                            lovesArray.forEach(category => {
                                if (nameToId[category]) {
                                    likesDislikesInserts.push([newCharacterId, nameToId[category], 'love']);
                                }
                            });

                            likesArray.forEach(category => {
                                if (nameToId[category]) {
                                    likesDislikesInserts.push([newCharacterId, nameToId[category], 'like']);
                                }
                            });

                            dislikesArray.forEach(category => {
                                if (nameToId[category]) {
                                    likesDislikesInserts.push([newCharacterId, nameToId[category], 'dislike']);
                                }
                            });

                            hatesArray.forEach(category => {
                                if (nameToId[category]) {
                                    likesDislikesInserts.push([newCharacterId, nameToId[category], 'hate']);
                                }
                            });

                            if (likesDislikesInserts.length > 0) {
                                db.query(
                                    'INSERT INTO character_likes_dislikes (character_id, category_id, opinions) VALUES ?',
                                    [likesDislikesInserts],
                                    (err) => {
                                        if (err) {
                                            console.error('Error inserting likes/dislikes', err);
                                            return res.status(500).send('Server Error inserting likes/dislikes.');
                                        }
                                        console.log('Character fully created successfully.');
                                        res.redirect('/dashboard');
                                    }
                                );
                            } else {
                                res.redirect('/dashboard');
                            }
                        });
                    }
                );
            });
        }
    );
});


// ==============================================
// admin management deleting a game character
router.post('/admin/delete-character', isAdmin, (req, res) => {
    const { characterId } = req.body;

    // STEP 1: Delete from character_likes_dislikes
    db.query('DELETE FROM character_likes_dislikes WHERE character_id = ?', [characterId], (err, result) => {
        if (err) {
            console.error('Error deleting from character_likes_dislikes:', err);
            return res.status(500).send('Error deleting character likes/dislikes');
        }

        // STEP 2: Delete from user_character_score
        db.query('DELETE FROM user_character_score WHERE character_id = ?', [characterId], (err, result) => {
            if (err) {
                console.error('Error deleting from user_character_score:', err);
                return res.status(500).send('Error deleting character scores');
            }

            // STEP 3: Now safe to delete from game_characters
            db.query('DELETE FROM game_characters WHERE id = ?', [characterId], (err, result) => {
                if (err) {
                    console.error('Error deleting character:', err);
                    return res.status(500).send('Error deleting character');
                }
                res.redirect('/dashboard');
            });
        });
    });
});



// ==============================================
// Save profile color 

router.post('/saveColor', (req, res) => {
    const userId = req.session.user.id;
    const { profile_color } = req.body;

    if (!profile_color || typeof profile_color !== 'string') {
        return res.status(400).json({ error: 'Invalid color' });
    }

    const sql = 'UPDATE users SET profile_color = ? WHERE id = ?';
    db.query(sql, [profile_color, userId], (err, result) => {
        if (err) {
            console.error('Error saving profile color:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        req.session.user.profile_color = profile_color;
        
        res.json({ message: 'Color saved' });
    });
});


// ==============================================
// Exporting router

//Testing code
//module.exports = {router, isAdmin};

module.exports = router;