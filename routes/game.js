// game / task selection page !!

const express = require('express');
const router = express.Router();
const db = require('../db');

function getRandomTask(limit){
    console.log(limit);
    console.log(parseInt(limit));
    var tasks = new Array(5);
    var counter = 0; 

    while(counter != 5){
        var idNum = Math.floor((Math.random() * parseInt(limit) + 1)); 
        if(tasks.includes(idNum)){
        }else{
            tasks[counter] = idNum;
            counter++;
        }
    }

    return tasks;
}

router.get("/", (req, res) => {
    isUser = req.session.user ? true : false;
    if(isUser){
        let counterSQL = `select count(*) as tasksCount from tasks`;
        db.query(counterSQL, (counterErr, counterResult, fields) => {
            if(counterErr) throw counterErr; 
            console.log(counterResult[0].tasksCount);
            var taskList = getRandomTask(counterResult[0].tasksCount);
            let taskSQL = `select name from tasks t where t.id in (` + db.escape(taskList) + `)`;
            console.log(taskSQL);
            db.query(taskSQL, (taskErr, taskResult) => {
                if(taskErr) throw taskErr;
                
                res.render("game",{title: 'Social Circle Game', webTitle: 'Game Page', isUser:isUser, tasks:taskResult});
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

module.exports = router;