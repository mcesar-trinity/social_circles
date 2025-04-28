// game / task selection page !!
const express = require('express');
const router = express.Router();
const db = require('../db');

//Values that persist through refreshes 
var maxScore = 0; 
var refreshGame = false; 
var taskList; 
var characterGroups; 

//Given the size/limit of the tasks in the database 
// it randomly selects 5 tasks based on id number
function getRandomTask(limit){
    var tasks = new Array(limit);
    let size = tasks.length >= 5 ? 5 : tasks.length;

    for(var x = 1; x <= limit; x++){
        tasks[x-1] = x;
    }

    for(var i = tasks.length - 1; i > 0; i--){
        var j = Math.floor(Math.random() * (i + 1));
        var temp = tasks[i];
        tasks[i] = tasks[j];
        tasks[j] = temp; 
    }

    var results = new Array(size);
    for(var x = 0; x < size; x++){
        results[x] = tasks[x];
    }

    return results;
}

//Randomly assigns all characters to 3 groups
//assumes characters can be divided evenly to 3 
function createCharacterGroups(characterResult){
    splitter = Math.round(characterResult.length / 3);
    
    var groups = new Array(3).fill(0).map(() => new Array(splitter).fill(0));

    for (var i = characterResult.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i+1));
        var temp = characterResult[i];
        characterResult[i] = characterResult[j];
        characterResult[j] = temp; 
    }

    let visited = characterResult;

    for(var x = 0; x < 3; x++){
        for(var y = 0; y < splitter; y++){
            groups[x][y] = characterResult[(splitter * x) + y];
            delete visited[(splitter * x) + y];
        }
    }

    if(visited.length != 0){
        let index = 0;
        visited.forEach((remain) => {
            groups[index].push(remain);
            index++;
        })
    }
    
    return groups; 
}

//Using the opinions of the given character changes the happiness score
//based on current character happiness score 
function calculateHappiness(happiness_score, opinions){
    var finalHappiness = happiness_score;
    if(finalHappiness < 0) {return 0;}
        switch(opinions){
            case 'like': 
                return finalHappiness += 1;
            case 'love':
                return finalHappiness += 2;
            case 'dislike':
                if((finalHappiness - 1) >= 0) {return finalHappiness -= 1;}
                break;
            case 'hate':
                if((finalHappiness - 2) >= 0) {return finalHappiness -= 2;}
                break;
            default:
                return finalHappiness;
        }

        return finalHappiness;
}

//Used to create a new game
//Intells randomizing the set of tasks and character assignemnt 
function createGame(req, res){
    //Query the amount tasks in the database
    let counterSQL = ` select count(*) as tasksCount from tasks`;
    db.query(counterSQL, (counterErr, counterResult) => {
        if(counterErr) throw counterErr; 

        //Query tasked based on the randomized id numbers selected from getRandomTask()
        taskList = getRandomTask(counterResult[0].tasksCount);
        let taskSQL = `select upper(name) as name, category_id from tasks t where t.id in (` + db.escape(taskList) + `)`;

        //Query neccessary user and character data needed for account page
        let userSQL = `select happiness_score, max_happiness_score from users where id  = ` + db.escape(req.session.user.id);
        let infoSQL = `select c.name, c.id, uc.happiness_score, uc.durability_score from users u, game_characters c, ` +
        `user_character_score uc where c.id = uc.character_id and uc.user_id = u.id and u.id = ` + db.escape(req.session.user.id);

        let opinionSQL = `select cld.character_id, cld.category_id, cld.opinions from character_likes_dislikes cld`;

        let leaderSQL = ` SELECT u.username, u.profile_color, u.max_happiness_score, rank() Over (order by l.high_score desc) as 'rank' ` + 
        ` FROM leaderboard l JOIN users u ON u.id = l.user_id limit 5;
        -- Sort by user rank in ascending order`; 

        db.query(taskSQL + "; " + userSQL + "; " + infoSQL + "; " + opinionSQL + ";" + leaderSQL + ";", (err, result) => {
            if(err) throw err;
            
            //Set maxScore to database max score, and assigned characters to random group via createCharacterGroups()
            maxScore = result[1][0].max_happiness_score
            characterGroups = createCharacterGroups(result[2]);
            //opinionGroups = createOpinionGroup(result[3]);

            res.render("game",{title: 'Social Circle Game', webTitle: 'Game Page', isUser:isUser, userData:result[1], characterGroups:characterGroups, opinions:result[3], leader:result[4], tasks:result[0], customStyle:'/stylesheets/game.css'});
        });
    });
}

//Used to redraw game when set of tasks and
//character assignment should not be rerandomized
function resetGame(req,res){
    //Query the amount tasks in the database
    let counterSQL = ` select count(*) as tasksCount from tasks`;
    db.query(counterSQL, (counterErr, counterResult) => {
        if(counterErr) throw counterErr; 

        //Query tasked based on the randomized id numbers selected from getRandomTask()
        taskList = taskList.length != 0 ? taskList : getRandomTask(counterResult[0].tasksCount);
        let taskSQL = `select upper(name) as name, category_id from tasks t where t.id in (` + db.escape(taskList) + `)`;

        //Query neccessary user and character data needed for account page
        let userSQL = `select happiness_score, max_happiness_score from users where id  = ` + db.escape(req.session.user.id);
        let infoSQL = `select c.name, c.id, uc.happiness_score, uc.durability_score from users u, game_characters c, ` +
        `user_character_score uc where c.id = uc.character_id and uc.user_id = u.id and u.id = ` + db.escape(req.session.user.id);

        let opinionSQL = `select cld.character_id, cld.category_id, cld.opinions from character_likes_dislikes cld`;
        let leaderSQL = ` SELECT u.username, u.profile_color, u.max_happiness_score, rank() Over (order by l.high_score desc) as 'rank' ` + 
        ` FROM leaderboard l JOIN users u ON u.id = l.user_id limit 5;
        -- Sort by user rank in ascending order`;
        
        db.query(taskSQL + "; " + userSQL + "; " + infoSQL + "; " + opinionSQL + ";" + leaderSQL + ";", (err, result) => {
            if(err) throw err;
            
            //Set maxScore to database max score, and assigned characters to random group via createCharacterGroups()
            maxScore = result[1][0].max_happiness_score; 
            characterGroups = characterGroups.length != 0 ? characterGroups : createCharacterGroups(result[2]);

            newGame = true; 
            res.render("game",{title: 'Social Circle Game', webTitle: 'Game Page', isUser:isUser, userData:result[1], characterGroups:characterGroups, opinions:result[3], leader:result[4], tasks:result[0], customStyle:'/stylesheets/game.css'});
        });
    });
}

//Creates the account page
router.get("/", (req,res) => {
    isUser = req.session.user ? true : false;
    //If the user has logged in it shall create the game page otherwise direct them to the account page
    if(isUser){
        if(!refreshGame){
            refreshGame = true; 
            createGame(req, res);
        }else{
            resetGame(req, res);
        }
    }else{
        res.render('authorize', {type: 'login', webTitle: 'Login | Social Circles', title: 'Welcome to Social Cirlces', isUser: isUser});
    }
});

//Update character and user scores based on game logic before 
//rendering a new game
router.post("/", (req, res) => {
    const characters = req.body.selectedGroup.split(',');
    const task = req.body.task; 
    console.log(characters);

    //Gets the selected character ids and base involvment score, their happiness and involvment score with the user, and 
    //there opinion on the selected task. 
    let selectedCharSQL = `select c.id, uc.happiness_score, cld.opinions, uc.durability_score, c.activity_durability ` 
        + `from game_characters c join user_character_score uc on c.id = uc.character_id join character_likes_dislikes cld on cld.character_id = c.id ` 
        + `where uc.user_id = ` + db.escape(req.session.user.id) + ` and c.name in (` + db.escape(characters) + `) and `
        + `cld.category_id = (select category_id from tasks where name = ` + db.escape(task.toLowerCase().trim()) + `);`;

    let unselectedCharSQL = `select c.id, uc.happiness_score, uc.durability_score, c.activity_durability ` 
        + `from game_characters c join user_character_score uc on c.id = uc.character_id join character_likes_dislikes cld on cld.character_id = c.id ` 
        + `where uc.user_id = ` + db.escape(req.session.user.id) + ` and c.name not in (` + db.escape(characters) + `) and `
        + `cld.category_id = (select category_id from tasks where name = ` + db.escape(task.toLowerCase().trim()) + `);`;

    
    console.log(selectedCharSQL);

    
    db.query(selectedCharSQL + unselectedCharSQL, (err, result) => {
        if(err) throw err; 

        var totalHappiness = 0; 
        var userCount = 0;
        var updateCharSQL = ""; 

        result[0].forEach((selected) => {
            console.log("Selected: " + selected.id);
            var character_happiness = calculateHappiness(selected.happiness_score, selected.opinions);
            totalHappiness += character_happiness;
            userCount += 1;
            
            updateCharSQL += `update user_character_score set happiness_score = ` + db.escape(character_happiness)
            + `, durability_score = ` + db.escape(selected.activity_durability) + ` where user_id = ` + db.escape(req.session.user.id) + 
            ` and character_id = ` + db.escape(selected.id) + `; `;

            console.log(selected.id + " : " + `update user_character_score set happiness_score = ` + db.escape(character_happiness)
            + `, durability_score = ` + db.escape(selected.activity_durability) + ` where user_id = ` + db.escape(req.session.user.id) + 
            ` and character_id = ` + db.escape(selected.id) + `; `);
        }); 

        result[1].forEach((unSelected) => {
            var durability_score = (unSelected.durability_score - 1 < 0) ? 0 : (unSelected.durability_score - 1);
            var un_happiness_score = ((unSelected.durability_score - 1 < 0) && (unSelected.happiness_score - 1 >= 0)) ? (unSelected.happiness_score - 1) : unSelected.happiness_score;
            
            totalHappiness += un_happiness_score;
            userCount += 1; 
            
            updateCharSQL += `update user_character_score set happiness_score = ` + db.escape(un_happiness_score)
            + `, durability_score = ` + db.escape(durability_score) + ` where user_id = ` + db.escape(req.session.user.id) + 
            ` and character_id = ` + db.escape(unSelected.id) + "; ";
        });

        user_happiness = Math.round(totalHappiness / userCount);
        if(user_happiness > maxScore){
            maxScore = user_happiness; 
            updateCharSQL += `update users set happiness_score = ` + db.escape(maxScore) 
            + `, max_happiness_score = ` + db.escape(maxScore) + ` where id = ` + db.escape(req.session.user.id) + ";";

            updateCharSQL += `update leaderboard set high_score = ` + db.escape(maxScore) + ' where user_id = ' + 
            db.escape(req.session.user.id) + "; ";
        }else{
            updateCharSQL += `update users set happiness_score = ` + db.escape(user_happiness) 
            + ` where id = ` + db.escape(req.session.user.id) + "; "
        }


        db.query(updateCharSQL, (err,result) => {
            if(err) throw err;
            createGame(req,res);
        });
    })
});

//module.exports = {router, getRandomTask, createCharacterGroups, calculateHappiness};
module.exports = router;