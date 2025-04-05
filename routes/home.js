// home page!!

const express = require('express');
const router = express.Router();
var sess; 

//This function takes the session and resender in order to check user's permissions
//to create either the home page for users, or the home page for non-user
function createHomePage(sess, res){
    if(sess.userid != 0 && sess.userid != undefined){
        console.log("Logged in");
        res.render("home", {title: 'Social Circle Game', webTitle: 'Home Page', isUser:true});
    }else{
        console.log("Not currently logged in");
        res.render("home", {title: 'Social Circle Game', webTitle: 'Home Page', isUser:false});
    }
}

//Creates home page based on user's permission (are they logged in or not?)
router.get("/", (req, res) => {
    sess = req.session

    console.log(sess.userid);
    createHomePage(sess, res);
});

//NEED TO BE CHANGED WHEN ACCOUNT PAGE IS CREATED
//Takes user's id and stores in session or returns to 0 when log off occurs
//before creating the proper home page. 
router.post("/", (req,res) => {
    sess = req.session; 

    data = req.body;
    console.log(data.authorize);
    switch(data.authorize){
        case "login":
            sess.userid = 0; 
            break;

        case "logoff":
            sess.userid = 1; 
            break;
        
        default:
            console.log("Error");
     }
     
     createHomePage(sess, res);
});

module.exports = router;
