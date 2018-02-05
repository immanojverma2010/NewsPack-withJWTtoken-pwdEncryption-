var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var User= require('./models/user_trial');

var news = require('./routes/news');
//var User = require('./models/users');
var connectflash = require('connect-flash');
var jwt    = require('jsonwebtoken');

var passport= require('passport'),
LocalStrategy= require('passport-local').Strategy;;



var mongoose = require('mongoose');
//connection with database
mongoose.connect("mongodb://localhost/newsdb")
//assign the mongoose connection to a variable
var db= mongoose.connection;
//verify the connection status with the database
db.on('error',console.error.bind(console,'connection error......!!!!!'));
db.once('open',function(){
  console.log("Connected to MongoDB successfully");
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../server/dist')));


app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(connectflash());

//app.use('/', index);
// app.use('/users', users);
// app.use('/news', news);

// app.post('/login',
// passport.authenticate('local',
// { failureFlash: 'Error',
// succssFlash: 'Success'
// }),
// function(req, res) {
//   res.json({responseText:'authenticated'});
//   console.log("in login");
// });
app.use('/users', users);


app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.get('/logout', function(req, res){

  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});
// app.get('/login', function(req, res){
//
//   console.log("req",req.body);
//
// });
app.set('superSecret', 'ilovescotchyscotch');
//var apiRoutes = express.Router();

//   app.post('/login',function(req,res){
// console.log("req",req.body.username);
// User.findOne({ "username": req.body.username }, function(err, user) {
//   if (err) throw err;

// 		if (!user) {
// 			res.json({ success: false, message: 'Authentication failed. User not found.' });
// 		}
//     else if (user) {

// 			// check if password matches
// 			if (user.password != req.body.password) {
// 				res.send({ success: false, message: 'Authentication failed. Wrong password.' });
// 			}
//       else {
//       var payload = {
//         user: user
//       }
//       var token = jwt.sign(payload, app.get('superSecret'), {
//         expiresIn: 60 // expires in 24 hours
//       });
//       res.send({
// 					success: true,
//           responseText: "authenticated",
// 					message: 'Enjoy your token!',
// 					token: token
// 				});
//       }
// }
// })
// });










app.post('/login',function(req,res){
  console.log("req",req.body.username);



if (req.body) {
  var userVar =new User();

  userVar.username=req.body.username;
  userVar.password=req.body.password;


  User.getAuthenticated(req.body.username,req.body.password,function(err, user, reason){
    if (err) {
      res.send(err);
    }
    if (user) {
      var payload = {
        user: user
      }
      var token = jwt.sign(payload, app.get('superSecret'), {
        expiresIn: 60 // expires in 24 hours
      });
      res.send({
          success: true,
          responseText: "authenticated",
          message: 'Enjoy your token!',
          token: token
        });
    
    }
    
    var reasons = User.failedLogin;
    console.log("reasons:",reasons);
    switch (reason) {
        case reasons.NOT_FOUND:
        console.log("User Not Found");
      res.send("User Not Found");
      break;    
        case reasons.PASSWORD_INCORRECT:
        console.log("Incorrect Password");
      res.send("Incorrect Password");
        
            // note: these cases are usually treated the same - don't tell
            // the user *why* the login failed, only that it did
            break;
        case reasons.MAX_ATTEMPTS:
            // send email or otherwise notify user that account is
            // temporarily locked

            console.log("Maximum attempts failed");
      res.send("Maximum attempts failed");
            
            break;
    }
  })

}
});



app.use(function(req, res, next){
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log("token:",token);
  if (token) {

     // verifies secret and checks exp
     jwt.verify(token, app.get('superSecret'), function(err, decoded) {
       if (err) {
         console.log(err);
         return res.json({ success: false, message: 'Failed to authenticate token.' });
       } else {
         // if everything is good, save to request for use in other routes
         console.log(decoded);
         req.decoded = decoded;
         next();
       }
     });

   } else {
     console.log("token:",token);

     // if there is no token
     // return an error
     return res.status(403).send({
         success: false,
         message: 'No token provided.'
     });

   }
 });

 app.use('/news', news);

// User.findOne({ "username": username }, function (err, user) {
//       if (err) { return cb(err); }
//       if (!user) { return cb(null, false); }
//       if (user.password !=password) { return cb(null, false); }
//       console.log("Authentication success");
//       return cb(null, user);
//     });


// passport.use(new LocalStrategy(
//   function(username, password, cb) {
//     console.log("username"+username+"    "+"pwd:"+password);
//     User.findOne({ "username": username }, function (err, user) {
//       if (err) { return cb(err); }
//       if (!user) { return cb(null, false); }
//       if (user.password !=password) { return cb(null, false); }
//       console.log("Authentication success");
//       return cb(null, user);
//     });
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
