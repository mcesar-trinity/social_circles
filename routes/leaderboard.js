const express = require('express');
const router = express.Router();
const db = require('../db'); // Your database connection

router.get('/', function (req, res, next) {
  const insertMissingUsers = `
    INSERT INTO leaderboard (user_id, high_score, user_rank)
    SELECT u.id, u.max_happiness_score, 0
    FROM users u
    LEFT JOIN leaderboard l ON u.id = l.user_id
    WHERE l.user_id IS NULL
      AND u.max_happiness_score IS NOT NULL;
  `;

  db.query(insertMissingUsers, (insertErr) => {
    if (insertErr) {
      console.error('Error inserting missing users into leaderboard:', insertErr);
      return res.status(500).send('Server error');
    }
    

    const updateScores = `
      UPDATE leaderboard l
      JOIN users u ON l.user_id = u.id
      SET l.high_score = u.max_happiness_score
      WHERE u.max_happiness_score IS NOT NULL
        AND u.max_happiness_score > l.high_score`;


    db.query(updateScores, (updateErr) => {
      if (updateErr) {
        console.error('Error updating leaderboard scores:', updateErr);
        return res.status(500).send('Server error');
      }
    });

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
            res.render('leaderboard', { leaderboard });
          }
        });
      });
    });
  });
});

module.exports = router;
