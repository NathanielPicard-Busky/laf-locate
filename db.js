// db.js
var mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs');;
//require('./config/passport')(passport);
var passportLocalMongoose = require('passport-local-mongoose');


// users
var User = new mongoose.Schema({
  // username, password provided by plugin
  //lists:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
});

// a location
// * contains Google pin info to be served to the map
// * rating can be updated
//  
var Location = new mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  category: {type: String, required: true},
  rating: {type: Number, default: 0, required: true},
  rating_disp: {type: Number, default: 0, required: true},
  rating_cnt: {type: Number, default: 0, required: true},
  lat: {type: Number, required: true},
  lng: {type: Number, required: true},
  desc: {type: String},
  
  // googleInfo to be determined in API research
}, {
  _id: true
});

// a review
// * each list must have a related location
// * each review is initiated unchecked upon submission, admins can go in and check new reviews
var Review = new mongoose.Schema({
  location: {type: mongoose.Schema.Types.ObjectId, ref:'Location'},
  createdBy: {type: String, required: true},
  createdAt: {type: Date, required: true},
  content: {type: String, required: true},
  rating: {type: Number, required: true},
  
  // so that the admins can assure reviews displayed are appropriate and useful
  checked: {type: Boolean, default: false, required: true}
});

User.plugin(passportLocalMongoose);
// "register" it so that mongoose knows about it
mongoose.model('User', User);
mongoose.model('Location', Location);
mongoose.model('Review', Review);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV == 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 var fs = require('fs');
 var path = require('path');
 var fn = path.join(__dirname, 'config.json');
 var data = fs.readFileSync(fn);
console.log("DATA");
console.log(data);
 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 var conf = JSON.parse(data);
 var dbconf = conf.dbconf;
console.log("dbconf:");
console.log(dbconf);
} else {
console.log("ELSE"); // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://heroku_4n5p74pk:eaokt57b674t7nevb3p6isbol9@ds259105.mlab.com:59105/heroku_4n5p74pk';
}

mongoose.connect(dbconf);








