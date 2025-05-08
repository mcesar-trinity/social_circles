const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming 'db' is your database connection file

// SQL query to get all leaderboard entries, ordered by user rank
router.get('/', function(req, res, next) {
  let sql = `
    SELECT u.id, u.username, u.profile_color, l.high_score as max_happiness_score
    FROM leaderboard l
    JOIN users u ON u.id = l.user_id
    ORDER BY l.high_score DESC;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching leaderboard:', err);
      return res.status(500).send('Server error');
    }

    let leaderboard = [];

    // Assign ranks to the users
    result.forEach((user, index) => {
      let icon = null;
      let rank = index + 1; // Manually assign rank (starting from 1)

      // Assign an icon based on the rank
      if (rank === 1) icon = '👑';
      else if (rank === 2) icon = '🥈';
      else if (rank === 3) icon = '🥉';
      else if (rank >= 4) icon = rank;

      leaderboard.push({
        rank: icon,
        name: user.username,
        score: user.max_happiness_score,
        color: user.profile_color,
        id: user.id
      });
    });

    // Optionally: Get the current user's rank from the session (if logged in)
    const currentUserRank = req.session.user ? leaderboard.find(entry => entry.name === req.session.user.username)?.rank : null;

    console.log("Leaderboard:", leaderboard);

    // Render the 'leaderboard' view and pass the leaderboard data to it
    res.render('leaderboard', { leaderboard });
  });
});



// Export the router so it can be used in the main app file
module.exports = router;
