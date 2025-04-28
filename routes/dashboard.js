// user account page !!

// if (!req.session.user) return res.redirect('/authorize/login');

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

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
    const pageTitle = 'Dashboard | Social Cirlces'
    const getUserScore = 'SELECT max_happiness_score FROM users WHERE id = ?';

    db.query(getUserScore, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user score:', err);
            return res.status(500).send('Server error');
        }

        const happinessScore = result[0]?.max_happiness_score || 0;


        // if admin editing
        if (user.role === 'admin') {
            db.query('SELECT tasks.*, task_categories.name AS category_name FROM tasks JOIN task_categories ON tasks.category_id = task_categories.id', (err, tasks) => {
                if (err) throw err;

                db.query('SELECT * FROM game_characters', (err, gameCharacters) => {
                    if (err) throw err;
                    db.query('SELECT * FROM task_categories', (err, categories) => {
                        if (err) throw err;
                        res.render('dashboard', { user, isAdmin: true, tasks, gameCharacters, categories, title: pageTitle , happinessScore});
                    });
                });
            });
        } else {
            res.render('dashboard', { user, isAdmin: false, title: pageTitle , happinessScore});
        }
    });

});

//handle profile editing
/*router.post('/edit', (req, res) => {
    const bcrypt = require('bcrypt');*/

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
                    return res.send('Incorrect current password.');
                }

                // Hash new password and update
                bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                    if (err) {
                        console.error('Error hashing password:', err);
                        return res.status(500).send('Server error');
                    }

                    db.query(
                        'UPDATE users SET username = ?, email = ?, password_hash = ? WHERE id = ?',
                        [name, email, hashedPassword, userId],
                        (err) => {
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
                                res.redirect('/dashboard');
                            });

                            /*console.log('User updated successfully');
                            res.redirect('/dashboard');*/
                        }
                    );
                });
            });
        } else {
            // No password change
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
                        res.redirect('/dashboard');
                    });

                    /*console.log('User updated successfully');
                    res.redirect('/dashboard');*/
                }
            );
        }
    });

});

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

//ADMIN BELOW

function isAdmin(req, res, next) {
    if(req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Forbidden');
}

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


//admin management editing 
router.post('/admin/edit-user', isAdmin, (req, res) => {
    const { userId, newName, newEmail } = req.body 
    db.query('UPDATE users SET username = ?, email = ? WHERE id = ?',
    [newName, newEmail, userId], (err, results) => {
        if(err) throw err;
        res.redirect('/dashboard');
    });
});

//admin management editing task
router.post('/admin/edit-task', isAdmin, (req, res) => {
    const { taskId, taskDescription} = req.body;
    db.query('UPDATE tasks SET description = ? WHERE id = ?', [taskDescription, taskId], (err, result) => {
        if (err) throw err;
        res.redirect('/dashboard');
    })
})

//admin management delete task
router.post('/admin/delete-task', isAdmin, (req, res) => {
    const { taskId } = req.body;
    db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, result) => {
        if (err) throw err;
        res.redirect('/dashboard');  // Redirect to dashboard after task deletion
    });
});

// Route for adding game characters
router.get('/admin/add-character', isAdmin, (req, res) => {
    res.render('admin/add-character');
});

// admin management form submission for adding a character
router.post('/admin/add-character', isAdmin, (req, res) => {
    const { name, loves, likes, dislikes, hates, activity_durability, happiness_score } = req.body;
    db.query('INSERT INTO game_characters (name, loves, likes, dislikes, hates, activity_durability, happiness_score) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [name, loves, likes, dislikes, hates, activity_durability, happiness_score], (err, result) => {
        if (err) throw err;
        res.redirect('/dashboard');  // Redirect after character is added
    });
});

// admin management deleting a game character
router.post('/admin/delete-character', isAdmin, (req, res) => {
    const { characterId } = req.body;
    db.query('DELETE FROM game_characters WHERE id = ?', [characterId], (err, result) => {
        if (err) throw err;
        res.redirect('/dashboard');  // Redirect after deleting a character
    });
});

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




module.exports = router;