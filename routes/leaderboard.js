const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming 'db' is your database connection file

// SQL query to get all leaderboard entries, ordered by user rank
router.get('/', function(req, res, next) {
  // Define the SQL query to fetch leaderboard data without limiting the number of entries
  let sql = `
    SELECT u.username, u.profile_color, u.max_happiness_score, rank()
	  Over (order by l.high_score desc) as 'rank'
    FROM leaderboard l
    JOIN users u ON u.id = l.user_id;

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
    var leaderboard = []
    result[0].forEach((user) => {
      console.log("User: " + user.username);
      let icon = null;
      // Assign an icon based on the rank (e.g., crown for 1st, silver medal for 2nd, etc.)
      if (user.rank === 1) icon = '👑';
      else if (user.rank=== 2) icon = '🥈';
      else if (user.rank === 3) icon = '🥉';
      else if(user.rank >= 4) icon = user.rank;
    
      
      // Return an object with the leaderboard entry's rank, name, score, icon, and character information
      leaderboard.push({
        rank: icon, // User's rank on the leaderboard
        name: user.username, // User's username
        score: user.max_happiness_score,       // User's high score
        color: user.profile_color // color associated with the user
      })     
    });

    // Optionally: Get the current user's rank from the session (if logged in)
    const currentUserRank = req.session.user ? leaderboard.find(entry => entry.name === req.session.user.username)?.rank : null;

    console.log("Current rank:" + leaderboard);
    // Render the 'leaderboard' view and pass the leaderboard data to it
    res.render('leaderboard', { leaderboard});
    // Pass the user's rank (if any) to the view for the rank box
    });
  });


// Export the router so it can be used in the main app file
module.exports = router;
