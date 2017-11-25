// app.js

var database = require('./db.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require("path");
var publicPath = path.resolve(__dirname, "public");
require( './db' );
require('./auth');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Location = mongoose.model('Location');
var Review = mongoose.model('Review');

app.set('view engine', 'hbs');
app.set('port', (process.env.PORT || 5000));

app.use(express.static(publicPath));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

//main landing page, redirects to login page
app.get('/', function(req, res){
	res.redirect('/login');
})

//get homepage, send user to menu
app.get('/home', function(req, res){

	if(req.cookies.user != undefined){
		var user = "User: " + req.cookies.user;
	}
	else{

		res.redirect('/login');
		//var user = 'Click Here To Login!';
	}


	res.render('home', {'user': user, 'title': 'LafLocate'});


	

});

app.get('/api/filter/category', function(req, res){
  //get location category from request and filter locations based on it
  //send back list of locations of that category

  var locList = [];
  Location.find({category: req.query.category}, function(err, locations, count) {
 	
  	locations.forEach( function( element ) {
  		var newloc = {loc:element, id:element.id};
  		Review.find({location: element}, function(err, reviews, count){

  			newloc["reviews"] = reviews;

	  		locList.push(newloc);
  		});
  		


  	});

  	//ensure the review source task completes 
  	//(there is a better way to do this but this has worked so far, if it takes any longer than a second, there's something wrong)
  	setTimeout(sendList, 1000);

  });

  function sendList(){
  	
    res.send(locList);
  }


});

app.get('/api/filter/type', function(req, res){
  //get location type from request and filter locations based on it
  //send back list of locations of that type
  var locList = [];
  Location.find({type: req.query.type}, function(err, locations, count) {
 	
  	locations.forEach( function( element ) {
  		var newloc = {loc:element, id:element.id};
  		Review.find({location: element}, function(err, reviews, count){

  			newloc["reviews"] = reviews;
 
	  		locList.push(newloc);
  		});
  		


  	});
  	//ensure the review source task completes 
  	//(there is a better way to do this but this has worked so far, if it takes any longer than a second, there's something wrong)
  	setTimeout(sendList, 1000);
  });

  function sendList(){
  	
    res.send(locList);
  }


});

//simple about page 
app.get('/about', function(req, res){
	if(req.cookies.user != undefined){
		var user = "User: " + req.cookies.user;
	}
	else{
		res.redirect('/login');
		//var user = 'Click Here To Login!';
	}
	
	res.render('about', {'user': user, 'title': 'LafLocate'});

});


app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/home');

});

app.get('/login', function(req, res) {
	if(req.cookies.user != undefined){
		var userMessage = "You are logged in as: " + req.cookies.user;
		var logout = "Click here to log out!";
		
	}
	else{
		var userMessage = "Enter your username and password below!";
		var logout = undefined;
		//var user = 'Click Here To Login!';
	}

  res.render('login', {'userMessage': userMessage, 'logout': logout});
});


//framework sourced from https://github.com/nyu-csci-ua-0480-001-fall-2016/examples/tree/master/class16/passport-demo
app.post('/login', function(req,res,next) {

  passport.authenticate('local', function(err,user) {
    if(user) {
    	//call the login function and set the session data
      req.logIn(user, function(err) {
      	var cookieString = 'user=' + user.username + '; password=' + user.password + ';';
        res.append('Set-Cookie', cookieString);
        res.redirect('/home');
      });
    } else {
      res.render('login', {message:'Your login or password is incorrect.'});
    }
  })(req, res, next);

});

app.get('/register', function(req, res) {
  res.render('register');
});

//framework sourced from https://github.com/nyu-csci-ua-0480-001-fall-2016/examples/tree/master/class16/passport-demo
app.post('/register', function(req, res) {
	//ensure user is from NYU
	var split = req.body.username.split('@');
	var address = split [1];
	if(address == 'nyu.edu'){


	  User.register(new User({username:req.body.username}), 
	      req.body.password, function(err, user){
	    if (err) {
	      // NOTE: error? send message back to registration...
	      res.render('register',{message:'Your username or password is already taken'});
	    } else {
	      // NOTE: once you've registered, you should be logged in automatically
	      // ...so call authenticate if there's no error
	      passport.authenticate('local')(req, res, function() {
	      	
	        res.redirect('/login');
	      });
	    }
	  });
  	}
  	else{
  		res.render('register',{message:'You are not a member of the NYU community, please use your NYU email address.'});
  	} 
});



app.get('/add-location', function(req, res){
	//get user and display it in the menu
	if(req.cookies.user != undefined){
		var user = "User: " + req.cookies.user;
	}
	else{
		res.redirect('/login');
		//var user = 'Click Here To Login!';
	}

	res.render('add-location', {'user': user, 'title': 'LafLocate'});

});

app.post('/add-location', function(req, res){
	console.log("ADD LOCATION");
	//get user and display it in the menu
	if(req.cookies.user != undefined){
		var user = "User: " + req.cookies.user;
	}
	else{
		var user = 'Click Here To Login!';
	}
  	//create new Location object in database based on request body
  	new Location({
	      name: req.body.name,
	      type: req.body.type,
	      category: req.body.category,
	      lat: req.body.lat,
	      lng: req.body.lng,
	      desc: req.body.description
 	}).save(function(err, location, count) {
	  	//location saved
	  	console.log("SUCCESS");
	    res.send('success');

  	});


  


});

app.post('/review', function(req, res){
	//get today's date
	var today = new Date();
	//create new review in database
	new Review({
		rating: req.body.rating,
		content: req.body.review,
		createdBy: req.cookies.user,
		createdAt: today,
		checked: false,
		location: req.body.id
	}).save(function(err, rev, count){
		Location.findById(req.body.id, function(err, loc){
			//calculate the current average rating to be displayed and save it for the location
			loc.rating = parseInt(loc.rating) + parseInt(req.body.rating);
			
			loc.rating_disp = (parseInt(loc.rating))/(loc.rating_cnt+1);
			
			loc.rating_cnt++;
			
			
			//update the location in the database
			loc.save(function(err, loc, count){

				res.redirect('/home');
			});
		})
		
	})

});





app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
//app.listen(8080, '127.0.0.1');
