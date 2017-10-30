//// auth.js from in-class examples: https://github.com/nyu-csci-ua-0480-001-fall-2016/examples/blob/master/class16/user-image/auth.js

var mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User'),
    LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());