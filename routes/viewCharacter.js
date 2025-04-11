//viewCharacter.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // import database connection if needed (currently not used)

// Helper function to fetch tasks based on category ID
function fetchTasksByCategory(categoryId) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM tasks WHERE category_id = ?`, [categoryId], (err, taskList) => {
            if (err) {
                return reject(err);
            }
            resolve(taskList);
        });
    });
}

// Helper function to get category ID by name
function getCategoryIdByName(name) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT id FROM task_categories WHERE name = ?`, [name], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result.length > 0 ? result[0].id : null);
        });
    });
}


// Route to handle viewing a character based on the selected character name
router.post('/', (req, res) => {
    const selectedCharacter = req.body.characters;
    console.log(req.body);
    console.log(req.session.user.id);

    // Map character names to IDs (example)
    const characterMap = {
        'Molly': 9,
        'Jeepers Creepers': 8,
        'Krypton': 1,
        'Dumbo': 7,
        'Virgil': 6,
        'Zombozo': 5,
        'Elliot': 3,
        'Kingston': 4,
        'Thalion': 2,
    };

    const characterId = characterMap[selectedCharacter];

    if (characterId) {
        // Redirect to the character detail route
        res.redirect(`/character/viewCharacter/${characterId}`);
    } else {
        console.error('Unknown character selected.');
        return res.status(400).send('Invalid character selection.');
    }
});

// Route to get character details by ID
router.get('/:id', async (req, res) => {
    const characterId = req.params.id;

    try {
        // Fetch character information
        const character = await new Promise((resolve, reject) => {
            db.query(`SELECT * FROM game_characters WHERE id = ?`, [characterId], (err, character) => {
                if (err) {
                    return reject(err);
                }
                resolve(character);
            });
        });

        if (character.length === 0) {
            return res.status(404).send('Character not found');
        }

        // Prepare tasks based on character preferences
        const tasks = {
            love: [],
            like: [],
            dislike: [],
            hate: []
        };

        // Fetch tasks based on character's loves, likes, dislikes, and hates
        await Promise.all([
            ...character[0].loves.split(',').map(async (love) => {
                const categoryId = await getCategoryIdByName(love.trim());
                if (categoryId) {
                    const taskList = await fetchTasksByCategory(categoryId);
                    tasks.love.push(...taskList);
                }
            }),
            ...character[0].likes.split(',').map(async (like) => {
                const categoryId = await getCategoryIdByName(like.trim());
                if (categoryId) {
                    const taskList = await fetchTasksByCategory(categoryId);
                    tasks.like.push(...taskList);
                }
            }),
            ...character[0].dislikes.split(',').map(async (dislike) => {
                const categoryId = await getCategoryIdByName(dislike.trim());
                if (categoryId) {
                    const taskList = await fetchTasksByCategory(categoryId);
                    tasks.dislike.push(...taskList);
                }
            }),
            ...character[0].hates.split(',').map(async (hate) => {
                const categoryId = await getCategoryIdByName(hate.trim());
                if (categoryId) {
                    const taskList = await fetchTasksByCategory(categoryId);
                    tasks.hate.push(...taskList);
                }
            })
        ]);

        // Render the character page with character details and tasks
        res.render('characters', {
            character: character[0], // Pass the character object
            tasks: tasks // Pass the tasks object
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
});



module.exports = router;