
require('dotenv').config();
// include the express modules
var express = require("express");
var app = express();

var session = require('express-session'); // import session to keep track of users
const passport = require('./passport'); // import the passport configuration

// use sequelize orm for database
const db = require("./models");
const {User, Meal, RSVP} = require('./models');

app.use(express.json()); // middleware for parsing
app.use(session({ // middleware for storing user info
    secret: "pooperscooper",
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // milisends * seconds * minutes * hours * days (7 days)
    },
  }
));
app.use(passport.initialize());
app.use(passport.session());
// middleware function used in protected routes to ensure user is logged in
// in the future I think im going to protect all routes and just redirect people to login if they aren't
// or maybe have a landing page, so users can have option to relogin
function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        // if user is authenticated, proceed 
        return next();
    }
    // send error if not authenticated
    res.status(401).send('Unauthorized: You must log in to access this resource.');
}

// default route
app.get('/', (req, res) => {
    res.send('hello world');
});

// google auth route
app.get('/auth/google', passport.authenticate('google', {scope: ['email']}));
app.get('/api', (req,res)=> {
    console.log("api hit");
    res.json({user:"chet",age:21})
});
// define the callback route for Google
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // successful authentication, redirect to another page
    req.session.isAuthenticated = true
    console.log(req.user.userID);
    if (req.user.firstName == null) {
        //
        console.log("set up new account");
    } else {
        res.redirect('/profile');
    }
   
  }
);
// all routes
// just a bunch of testing routes
app.get('/profile', isAuthenticated, (req, res) => {
  
  res.json({ message: `Welcome ${req.user.googleID}` });
});

// is Autthenticated middleware used to protect routes if user is not signed in
app.get('/select', isAuthenticated, (req, res) => {
    User.findOne( {where: {firstName: "chet"}})
    .then((users) => {
        res.send(users);
    })
    .catch(err => {
        console.log(err);
    });
});
app.get('/makeAdmin', isAuthenticated,(req, res) => {
    console.log("hit make admin endpoint");
    User.create({
        firstName: "chet",
        lastName: "opsasnick",
        hasMealPlan: false,
        isAdmin: true,
        
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    })
    console.log("success");
    res.send('insert');
});
app.get('/delete', isAuthenticated, (req, res) => {
    User.destroy({where: {isAdmin: False}})
    .then(result => {

    })
    .catch(err => {
        if (err) {
            console.log(err);
        }
    });
    res.send('delete');
});
/*
    sequalize.sync ensures that our object model is the same as the actual db schema,
    useful for devlopment but probably shouldn;t be used in production because we might
    accidently drop a table if we alter our model schema
*/
db.sequelize.sync({alter: true}).then((req) => {
    app.listen(3001, () => {
        console.log("lsitneing on:  http://localhost:3001\n");

    });
});
