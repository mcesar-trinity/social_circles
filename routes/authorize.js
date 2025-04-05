// sign in page !!

const express = require('express');
const router = express.Router();
const db = require('../db');
var sess; 

//The following code is a dummy program design to allow developer
//to switch between logged in and no logged in (non-user to user)
router.get("/", (req, res) => {
    sess = req.session;

    if(sess.userid != 0 && sess.userid != undefined){
        console.log("Logged in");
        res.render("authorize", {title:"Dummy Login Page", webTitle:"DummyLogin", isUser:true});
    }else{
        console.log("Not currently logged in");
        res.render("authorize", {title:"Dummy Login Page", webTitle:"DummyLogin", isUser:false});
    }
});


module.exports = router;
