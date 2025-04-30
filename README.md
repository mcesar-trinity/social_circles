# social_circles

Updated Outstanding Issues:
- Leaderboard automatic updates (including a signifier to show changes over time)
- Needs an instruction page when first starting the game.
- Character page information is skewed to the left (ideally would be in the center)
- Design implementation is not ideal (styling, color theme, etc)
- After assigning a task, create a pop up saying what happened to each character
- Adding to server side functions that involve database use, and client side functions.
- When adding a character we created a connection from game_character to the user_character_score and to character_likes_dislikes tables.
  * For some reason inclusion (activity durability score) shows up as 0 even when entered as a different number, so that connection might need to be reviewed.
  * We found the issue is that there are hanging white spaces on the character names → we weren’t able to fix this issue.

Updated:
- Fixing connections issue in user account creation
  * Creating a new leaderboard row for new users
  * Setting inclusion value to character based inclusion in user_character_score table
