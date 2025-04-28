const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming 'db' is your database connection file

// SQL query to get all leaderboard entries, ordered by user rank
router.get('/', function(req, res, next) {
  // Define the SQL query to fetch leaderboard data without limiting the number of entries
  let sql = `
    SELECT u.username, l.high_score, l.user_rank, c.name AS character_name, c.color AS character_color
    FROM leaderboard l
    JOIN users u ON u.id = l.user_id
    JOIN user_character_score ucs ON u.id = ucs.user_id
    JOIN game_characters c ON ucs.character_id = c.id
    ORDER BY l.user_rank ASC;  
    -- Sort by user rank in ascending order
  `;

  // Query the database to fetch leaderboard data
  db.query(sql, (err, result) => {
    if (err) {
      // Handle any errors that occur while querying the database
      console.error('Error fetching leaderboard:', err);
      return res.status(500).send('Server error');  // Send a 500 status if error occurs
    }

    // Map the database results into a format that can be easily rendered in the view
    const leaderboard = result.map((entry, index) => {
      let icon = null;
      // Assign an icon based on the rank (e.g., crown for 1st, silver medal for 2nd, etc.)
      if (index === 0) icon = '👑';
      else if (index === 1) icon = '🥈';
      else if (index === 2) icon = '🥉';
      else if(index >= 3) icon = index + 1;
      
      // Return an object with the leaderboard entry's rank, name, score, icon, and character information
      return {
        rank: icon,         // User's rank on the leaderboard
        name: entry.username,          // User's username
        score: entry.high_score,       // User's high score
        character: entry.character_name, // Name of the character associated with the user
        color: entry.character_color   // Color associated with the character
      };
    });

    // Optionally: Get the current user's rank from the session (if logged in)
    const currentUserRank = req.session.user ? leaderboard.find(entry => entry.name === req.session.user.username)?.rank : null;

    console.log(currentUserRank);
    // Render the 'leaderboard' view and pass the leaderboard data to it
    res.render('leaderboard', { leaderboard, currentUserRank });
    // Pass the user's rank (if any) to the view for the rank box
    });
  });


// Export the router so it can be used in the main app file
module.exports = router;
