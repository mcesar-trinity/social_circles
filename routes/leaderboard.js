const express = require('express');
const router = express.Router();
const db = require('../db'); // Your database connection

router.get('/', function (req, res, next) {
  const sql = `
    SELECT u.id, u.username, u.profile_color, l.high_score AS max_happiness_score
    FROM leaderboard l
    JOIN users u ON u.id = l.user_id
    ORDER BY l.high_score DESC;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching leaderboard:', err);
      return res.status(500).send('Server error');
    }

    const updateLeaderboardRank = `UPDATE leaderboard SET user_rank = ? WHERE user_id = ?`;

    let leaderboard = [];
    let completed = 0;
    const total = result.length;
    let errorOccurred = false;

    // Build leaderboard and queue updates
    result.forEach((user, index) => {
      const rank = index + 1;
      const icon =
        rank === 1 ? '👑' :
        rank === 2 ? '🥈' :
        rank === 3 ? '🥉' : rank;

      leaderboard.push({
        rank: icon,
        name: user.username,
        score: user.max_happiness_score,
        color: user.profile_color,
        id: user.id,
      });

      db.query(updateLeaderboardRank, [rank, user.id], (err) => {
        if (err && !errorOccurred) {
          errorOccurred = true;
          console.error('Error updating leaderboard rank:', err);
          return res.status(500).send('Server error');
        }

        completed++;
        if (completed === total && !errorOccurred) {
          // Only render once all updates are done
          res.render('leaderboard', { leaderboard });
        }
      });
    });
  });
});

module.exports = router;
