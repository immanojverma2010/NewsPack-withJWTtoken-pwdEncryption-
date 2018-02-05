var express = require('express');
var router = express.Router();
//var User= require('../models/users');
var UserTrial= require('../models/user_trial');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Get is responding--no data attatched');
});

/*
// Earlier code to add user

router.route("/add")
.post(function (req,res) {
  if(req.body){
    console.log(req.body);
    var userVar =new User();
    userVar.fullname=req.body.fullname;
    userVar.username=req.body.username;
    userVar.password=req.body.password;
    userVar.age=req.body.age;
    userVar.contact=req.body.contact;
    /*userVar.save(function(err){
    .
    ..
  });
  */
  //var userVar=new User(req.body);
  /*userVar.save(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("User Inserted");
    }
  });
}
});
*/

router.route("/addNewUser")
.post(function (req,res) {
  if(req.body){
    console.log(req.body);
    var userVar =new UserTrial();

    userVar.username=req.body.username;
    userVar.password=req.body.password;

  userVar.save(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.send("User Inserted");
    }
  });
}
});

router.route("/login")
.post(function (req,res) {
  if(req.body){
    console.log(req.body);
    var userVar =new UserTrial();

    userVar.username=req.body.username;
    userVar.password=req.body.password;
  

    UserTrial.getAuthenticated(req.body.username,req.body.password,function(err, user, reason){
      if (err) {
        res.send(err);
      }
      if (user) {
        res.send("Login sucess");
      }
      
      var reasons = UserTrial.failedLogin;
      console.log("reasons:",reasons);
      switch (reason) {
          case reasons.NOT_FOUND:
        res.send("User Not Found");
        break;    
          case reasons.PASSWORD_INCORRECT:
        res.send("Incorrect Password");
          
              // note: these cases are usually treated the same - don't tell
              // the user *why* the login failed, only that it did
              break;
          case reasons.MAX_ATTEMPTS:
              // send email or otherwise notify user that account is
              // temporarily locked
        res.send("Maximum attempts failed");
              
              break;
      }
    })



}
});





module.exports = router;
