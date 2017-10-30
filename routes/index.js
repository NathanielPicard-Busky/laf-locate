var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Location = mongoose.model('Location');
var Review = mongoose.model('Review');


router.get('/home', function(req, res){
  var ret = false;
  var cont = "test";
  console.log("ret");
  console.log(ret);
  Review.findOne({content: 'test'}, function(err, review, count) {
    console.log("TRUE");
    console.log(arguments);
    console.log(review);
    //console.log(review.location);
    if(review !== null){
      ret = true;
    }
    console.log("ret");
    console.log(ret);
    res.render('home', {'title': 'LafLocate', 'ret': ret});

  });





module.exports = router;
