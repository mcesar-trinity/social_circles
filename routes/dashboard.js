// user account page !!

// if (!req.session.user) return res.redirect('/authorize/login');

const express = require('express');
const router = express.Router();
const db = require('../db');

//render the dashboard page with user profile info
router.get('/', (req, res) => {
    const user = req.session.user;
    console.log('GET /dashboard - session user:', user);

    //redirect if user is not logged in
    if(!user) {
        console.log('User not logged in. Redirecting to /authorize/login');
        return res.redirect('/authorize/login'); 
    }

    const pageTitle = 'Dashboard | Social Cirlces;'


    // if admin editing
    if (user.role === 'admin') {
        db.query('SELECT tasks.*, task_categories.name AS category_name FROM tasks JOIN task_categories ON tasks_category_id = task_categories.id', (err, tasks) => {
            if (err) throw err;

            db.query('SELECT * FROM game_characters', (err, gameCharacters) => {
                if (err) throw err;
                db.query('SELECT * FROM task_categories', (err, categories) => {
                    if (err) throw err;
                    res.render('dashboard', { user, isAdmin: true, tasks, gameCharacters, categories, title: pageTitle });
                });
            });
        });
    } else {
        res.render('dashboard', { user, isAdmin: false, title: pageTitle });
    }


    /*
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if(err) {
            console.error('Error fetching user data:', err);
            return res.status(500).send('DB error');
        }

        const user = results[0];
        if(!user) {
            console.log('No user found with session ID:', userId);
            return res.redirect('/authorize/login');
        }
        const isAdmin = user.role === 'admin';
        console.log('User data:', user);
        console.log('Is admin:', isAdmin);
        //if admin editing
        if(isAdmin) {
            db.query('SELECT tasks.*, task_categories.name AS category_name FROM tasks JOIN task_categories ON tasks_category_id = task_categories.id', (err, tasks) => {
                if(err) throw err;

                db.query('SELECT * FROM game_characters', (err, gameCharacters) => {
                    if(err) throw err;

                    db.query('SELECT * FROM task_categories', (err, categories) => {
                        if(err) throw err;
                        console.log('Rendering dashboard for admin with tasks and characters');
                        res.render('dashboard', { user, isAdmin, tasks, gameCharacters, categories});
                    });
                });
            });
        } else{
            console.log('Rendering dashboard for reguler user');
            res.render('dashboard', { user,  isAdmin });
        }

        ///get user data
        db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
            if(err) throw err;
            const user = results[0];
            //is user an admin?
            db.query('SELECT * FROM users WHERE role = "admin"', (err, adminResults) => {
                if(err) throw err;
                const isAdmin = adminResults.length > 0;
                res.render('dashboard', { user, isAdmin });
            });
        });*/
    //});
    
});

//handle profile editing
router.post('/edit', (req, res) => {
    const { name, email, bio } = req.body;
    const userId = req.session.userId;

    db.query('UPDATE users SET name = ?, email = ?, bio = ? WHERE id = ?',
    [name, email, bio, userId], (err, results) => {
        if (err) throw err;
        res.redirect('/dashboard'); //go back to dashboard after update
    });
});

//handle profile deleting
router.post('/delete', (req, res) => {
    const userId = req.session.userId;
    
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) throw err;
        req.session.destroy(); //log user out
        res.redirect('/'); //redirect to home page after deleting
    });
});

//admin management adding task
router.get('/admin/add-task', (req, res) => {
    db.query('SELECT * FROM task_categories', (err, categories) => {
        if(err) throw err;
        res.render('admin/add-task', { categories });
    });
});

// admin management form submission for adding a task
router.post('/admin/add-task', (req, res) => {
    const { name, description, category_id, points } = req.body;
    db.query('INSERT INTO tasks (name, description, category_id, points) VALUES (?, ?, ?, ?)',
        [name, description, category_id, points], (err, result) => {
            if(err) throw err;
            res.redirect('/dashboard');
    });
});

//admin management editing user
router.post('/admin/edit-user', (req, res) => {
    const { userId, newName, newEmail } = req.body 
    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?',
    [newName, newEmail, userId], (err, results) => {
        if(err) throw err;
        res.redirect('/dashboard');
    });
});

//admin management editing task
router.post('/admin/edit-task', (req, res) => {
    const { taskId, taskDescription} = req.body;
    db.query('UPDATE tasks SET description = ? WHERE id = ?', [taskDescription, taskId], (err, result) => {
        if (err) throw err;
        res.redirect('/dashboard');
    })
})

//admin management delete task
router.post('/admin/delete-task', (req, res) => {
    const { taskId } = req.body;
    db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, result) => {
        if (err) throw err;
        res.redirect('/dashboard');  // Redirect to dashboard after task deletion
    });
});

// Route for adding game characters
router.get('/admin/add-character', (req, res) => {
    res.render('admin/add-character');
});

// admin management form submission for adding a character
router.post('/admin/add-character', (req, res) => {
    const { name, loves, likes, dislikes, hates, activity_durability, happiness_score } = req.body;
    db.query('INSERT INTO game_characters (name, loves, likes, dislikes, hates, activity_durability, happiness_score) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [name, loves, likes, dislikes, hates, activity_durability, happiness_score], (err, result) => {
        if (err) throw err;
        res.redirect('/dashboard');  // Redirect after character is added
    });
});

// admin management deleting a game character
router.post('/admin/delete-character', (req, res) => {
    const { characterId } = req.body;
    db.query('DELETE FROM game_characters WHERE id = ?', [characterId], (err, result) => {
        if (err) throw err;
        res.redirect('/dashboard');  // Redirect after deleting a character
    });
});


module.exports = router;