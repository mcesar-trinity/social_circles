// home page!!

const express = require('express');
const router = express.Router();
var sess; 

//Creates home page based on user's permission (are they logged in or not?)
router.get("/", (req, res) => {
    sess = req.session

    console.log(sess.userid);
    isUser = (req.session.user) ? true : false;
    res.render("home", {title: 'Social Circle Game', webTitle: 'Home Page', isUser:isUser});
});

//NEED TO BE CHANGED WHEN ACCOUNT PAGE IS CREATED
//Takes user's id and stores in session or returns to 0 when log off occurs
//before creating the proper home page. 
router.post("/", (req,res) => {
    user = req.session.user;
    isUser = (req.session.user) ? true : false;
    res.render("home", {title: 'Social Circle Game', webTitle: 'Home Page', isUser:isUser});
});

module.exports = router;
