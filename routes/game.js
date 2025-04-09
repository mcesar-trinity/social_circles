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
                
                let characterSQL = `select c.name, uc.happiness_score from game_characters c join user_character_score uc
                 on c.id = uc.character_id where uc.user_id = ` + db.escape(req.session.user.id);

                db.query(characterSQL, (characterErr, characterResult) => {
                    if(characterErr) throw characterErr;

                    characterGroups = createCharacterGroups(characterResult);
                    res.render("game",{title: 'Social Circle Game', webTitle: 'Game Page', isUser:isUser, characterGroups:characterGroups, tasks:capitalize(taskResult)});
                });

            })

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
    console.log("Reached");
    console.log(req.body);
});

module.exports = router;