// game / task selection page !!

const express = require('express');
const router = express.Router();
const db = require('../db');

function capitalize(taskResult){
    var tasks = new Array(taskResult.length);

    for(var x = 0; x < tasks.length; x++){
        var splitter = taskResult[x].name.split(' ');

        for(var y = 0; y < splitter.length; y++){
            splitter[y] = splitter[y].charAt(0).toUpperCase() + splitter[y].substring(1);
        }

        tasks[x] = splitter.join(' ');
    }

    return tasks;
}

function getRandomTask(limit){
    var tasks = new Array(limit);
    for(var x = 1; x <= limit; x++){
        tasks[x-1] = x;
    }

    for(var i = tasks.length - 1; i > 0; i--){
        var j = Math.floor(Math.random() * (i + 1));
        var temp = tasks[i];
        tasks[i] = tasks[j];
        tasks[j] = temp; 
    }

    var results = new Array(5);
    for(var x = 0; x < 5; x++){
        results[x] = tasks[x];
    }

    return results;
}

function createCharacterGroups(characterResult){
    splitter = Math.round(characterResult.length / 3);
    
    var groups = new Array(3).fill(0).map(() => new Array(splitter).fill(0));

    for (var i = characterResult.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i+1));
        var temp = characterResult[i];
        characterResult[i] = characterResult[j];
        characterResult[j] = temp; 
    }

    for(var x = 0; x < 3; x++){
        for(var y = 0; y < splitter; y++){
            groups[x][y] = characterResult[(splitter * x) + y];
        }
    }
    
    return groups; 
}

function calculateHappiness(happiness_score, opinions){
    var finalHappiness = happiness_score;
        console.log("Before: " + finalHappiness);
        switch(opinions){
            case 'like': 
                finalHappiness += 1;
                break;
            case 'love':
                finalHappiness += 2;
                break;
            case 'dislike':
                finalHappiness = (finalHappiness - 1 < 0) ? finalHappiness : (finalHappiness - 1);
                break;
            case 'hate':
                finalHappiness = (finalHappiness - 2 < 0) ? finalHappiness : (finalHappiness - 2);
                break;
            default:
                break; 
        }
        console.log("After: " + finalHappiness);

    return finalHappiness;
}


router.get("/", (req, res) => {
    isUser = req.session.user ? true : false;
    if(isUser){
        let counterSQL = `select count(*) as tasksCount from tasks`;
        db.query(counterSQL, (counterErr, counterResult, fields) => {
            if(counterErr) throw counterErr; 

            var taskList = getRandomTask(counterResult[0].tasksCount);
            let taskSQL = `select name from tasks t where t.id in (` + db.escape(taskList) + `)`;

            db.query(taskSQL, (taskErr, taskResult) => {
                if(taskErr) throw taskErr;
                
                let characterSQL = `select c.name, uc.happiness_score, uc.durability_score from game_characters c join user_character_score uc
                 on c.id = uc.character_id where uc.user_id = ` + db.escape(req.session.user.id);

                db.query(characterSQL, (characterErr, characterResult) => {
                    if(characterErr) throw characterErr;

                    characterGroups = createCharacterGroups(characterResult);
                    let userSQL = `select happiness_score from users where id = `+ db.escape(req.session.user.id);

                    db.query(userSQL, (userErr, userResult) => {
                        res.render("game",{title: 'Social Circle Game', webTitle: 'Game Page', isUser:isUser, userData:userResult, characterGroups:characterGroups, tasks:capitalize(taskResult)});
                    });
                });
            });
        });
       
    }else{
        console.log('GET /authorize/login');
    res.render('authorize', { 
        type: 'login',
        webTitle: 'Login | Social Circles',
        title: 'Welcome to Social Cirlces',
        isUser: isUser
    });
    }
});


router.post("/", (req, res) => {
    const characters = req.body.selectedGroup;
    const task = req.body.task; 

    let selectedChar = `select c.id, c.name, uc.happiness_score, cld.opinions, uc.durability_score, c.activity_durability ` 
        + `from game_characters c join user_character_score uc on c.id = uc.character_id join character_likes_dislikes cld on cld.character_id = c.id ` 
        + `where uc.user_id = ` + db.escape(req.session.user.id) + ` and c.name in (` + db.escape(characters) + `) and `
        + `cld.category_id = (select category_id from tasks where name = ` + db.escape(task.toLowerCase().trim()) + `);`;
    
    db.query(selectedChar, (selectedErr, selectedResult) => {
        if(selectedErr) throw selectedErr;

        var totalHappiness = 0; 
        var userCount = 0;

        selectedResult.forEach((character) => {
            var happiness_score = calculateHappiness(character.happiness_score, character.opinions);
            totalHappiness += happiness_score;
            userCount += 1; 

            let updateCharSQL = `update user_character_score set happiness_score = ` + db.escape(happiness_score)
            + `, durability_score = ` + db.escape(character.activity_durability) + ` where user_id = ` + db.escape(req.session.user.id) + 
            ` and character_id = ` + db.escape(character.id);

            db.query(updateCharSQL, (updateERR, updateResult) => {
                if(updateERR) throw updateERR;
            })
        })

        let unselectedCharSQL = `select c.id, c.name, uc.happiness_score, uc.durability_score ` 
        + `from game_characters c join user_character_score uc on c.id = uc.character_id join character_likes_dislikes cld on cld.character_id = c.id ` 
        + `where uc.user_id = ` + db.escape(req.session.user.id) + ` and c.name not in (` + db.escape(characters) + `) and `
        + `cld.category_id = (select category_id from tasks where name = ` + db.escape(task.toLowerCase().trim()) + `);`;

        db.query(unselectedCharSQL, (unselectedERR, unselectedResult) => {
            if(unselectedERR) throw unselectedERR;
            
            unselectedResult.forEach((character) => {
                var durability_score = (character.durability_score - 1 < 0) ? 0 : (character.durability_score - 1);
                var un_happiness_score = ((character.durability_score - 1 < 0) && (character.happiness_score - 1 >= 0)) ? (character.happiness_score - 1) : character.happiness_score;
                
                totalHappiness += un_happiness_score;
                userCount += 1; 
                
                let updateCharSQL = `update user_character_score set happiness_score = ` + db.escape(un_happiness_score)
                + `, durability_score = ` + db.escape(durability_score) + ` where user_id = ` + db.escape(req.session.user.id) + 
                ` and character_id = ` + db.escape(character.id);
                
                db.query(updateCharSQL, (updateERR, updateResult) => {
                    if(updateERR) throw updateERR;
                });
            });

            let updateUserHap = `update users set happiness_score = ` + db.escape(Math.round(totalHappiness / userCount)) 
            + ` where id = ` + db.escape(req.session.user.id);
            
            db.query(updateUserHap, (userHapErr, userHapResult) => {
                if(userHapErr) throw userHapErr;

                let counterSQL = `select count(*) as tasksCount from tasks`;
                db.query(counterSQL, (counterErr, counterResult, fields) => {
                    if(counterErr) throw counterErr; 

                    var taskList = getRandomTask(counterResult[0].tasksCount);
                    let taskSQL = `select name from tasks t where t.id in (` + db.escape(taskList) + `)`;

                    db.query(taskSQL, (taskErr, taskResult) => {
                        if(taskErr) throw taskErr;
                        
                        let characterSQL = `select c.name, uc.happiness_score, uc.durability_score from game_characters c join user_character_score uc
                        on c.id = uc.character_id where uc.user_id = ` + db.escape(req.session.user.id);
        
                        db.query(characterSQL, (characterErr, characterResult) => {
                            if(characterErr) throw characterErr;

                            characterGroups = createCharacterGroups(characterResult);
                            let userSQL = `select happiness_score from users where id = `+ db.escape(req.session.user.id);
                            db.query(userSQL, (userErr, userResult) => {
                                res.render("game",{title: 'Social Circle Game', webTitle: 'Game Page', isUser:isUser, userData:userResult, characterGroups:characterGroups, tasks:capitalize(taskResult)});
                            });
                        });
                    });
                });
            })
        });
    });
});


module.exports = router;