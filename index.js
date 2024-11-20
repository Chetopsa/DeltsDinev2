
require('dotenv').config();
// include the express modules
var express = require("express");
var app = express();
const path = require('path');
const { Pool } = require('pg');

var session = require('express-session');
const passport = require('./passport'); // Import the passport configuration

// use sequelize orm for database
const db = require("./models");
const {User, Meal, RSVP} = require('./models');

app.use(express.json()); // middleware for parsing
app.use(session({ // middleware for storing user id
    secret: "pooperscooper",
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // milisends * seconds * minutes * hours * days
    },
  }
));
app.use(passport.initialize());
app.use(passport.session());
function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        // If user is authenticated, proceed to the next middleware/route
        return next();
    }
    // If not authenticated, send an error or redirect to login page
    res.status(401).send('Unauthorized: You must log in to access this resource.');
}

// default route
app.get('/', (req, res) => {
    res.send('hello world');
});

// google auth route
app.get('/auth/google', passport.authenticate('google', {scope: ['email']}));

// Define the callback route for Google
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // Successful authentication, redirect home or any other page.
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
app.get('/profile', isAuthenticated, (req, res) => {
  
  res.json({ message: `Welcome ${req.user.firstName}` });
});


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
    app.listen(3000, () => {
        console.log("lsitneing on:  http://localhost:3000\n");

    });
});
