const express = require('express');
const router = express.Router();
const db = require('../db'); // Import database connection if needed

// Helper function to fetch tasks based on category ID
function fetchTasksByCategory(categoryId) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT name FROM task_categories WHERE id = ?`, [categoryId], (err, taskList) => {
            if (err) {
                return reject(err);
            }
            resolve(taskList);
        });
    });
}

// Helper function to get category IDs by character name and opinion
function getCategoryIdsByCharacter(characterName) {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT tc.id, cld.opinions FROM task_categories tc 
             JOIN character_likes_dislikes cld 
             ON tc.id = cld.category_id
             JOIN game_characters gc
             ON gc.id = cld.character_id
             WHERE gc.name = ?`, 
            [characterName], 
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            }
        );
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
        // Fetch the happiness score for the character
        const happinessScore = await new Promise((resolve, reject) => {
            db.query(`SELECT happiness_score FROM user_character_score WHERE character_id = ?`, [characterId], (err, scoreResult) => {
                if (err) {
                    return reject(err);
                }
                resolve(scoreResult[0] ? scoreResult[0].happiness_score : null);
            });
        });

        // Prepare tasks based on character preferences
        const tasks = {
            love: [],
            like: [],
            dislike: [],
            hate: []
        };

        // Fetch all task categories based on the character's preferences
        const preferences = await getCategoryIdsByCharacter(character[0].name);

        // Loop through the preferences and fetch the task categories for each opinion
        await Promise.all(preferences.map(async (pref) => {
            const taskList = await fetchTasksByCategory(pref.id);
            tasks[pref.opinions].push(...taskList);
        }));

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



