const express = require('express');
const router = express.Router();
const db = require('../db');

// Calculate happiness score based on preferences
function calculateHappiness(preferences) {
    let score = 0;
    for (const p of preferences) {
        switch (p.preference) {
            case 'loved':
                score += 2;
                break;
            case 'liked':
                score += 1;
                break;
            case 'disliked':
                score -= 1;
                break;
            case 'hated':
                score -= 2;
                break;
        }
    }
    return score;
}

// Route to get character details by ID
router.get("/:id", (req, res) => {
    const characterId = req.params.id;

    const characterQuery = `SELECT * FROM npc WHERE id = ?`;
    const tasksQuery = `
        SELECT t.task_name AS task, t.topic, cp.preference 
        FROM character_preferences cp
        JOIN tasks t ON cp.task_id = t.id
        WHERE cp.character_id = ?
    `;

    db.query(characterQuery, [characterId], (err, characterResults) => {
        if (err) {
            console.error('Error fetching character:', err);
            return res.status(500).send('Internal Server Error Version #1');
        }

        if (characterResults.length === 0) {
            return res.status(404).send('Character not found');
        }

        const npc = characterResults[0];

        db.query(tasksQuery, [characterId], (err, preferences) => {
            if (err) {
                console.error('Error fetching preferences:', err);
                return res.status(500).send('Internal Server Error');
            }

            const happinessScore = calculateHappiness(preferences);

            // Extract unique topic names
            const topicSet = new Set(preferences.map(p => p.topic));
            const topics = [...topicSet].map(name => ({ name }));

            // Render the character page
            res.render("character", {
                npc,
                preferences,
                topics,
                happinessScore
            });
        });
    });
});

module.exports = router; // Don't forget to export the router
