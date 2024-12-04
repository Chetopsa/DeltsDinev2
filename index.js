
require('dotenv').config();
// include the express modules
var express = require("express");

var session = require('express-session'); // import session to keep track of users
var app = express();

const passport = require('./passport'); // import the passport configuration

// use sequelize orm for database
const db = require("./models");
const {User, Meal, RSVP} = require('./models');

const cors = require('cors'); // allows for cross orgin requests liek when using google auth
const { user } = require('./config/config');
app.use(cors({
    origin: 'http://localhost:3000', // or your frontend's URL
    methods: ['GET', 'POST'],
    credentials: true, // allow cookies to be sent
  }));


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

// middleware for checking if admin
function isAdmin(req, res, next) {
    if (req.session.isAdmin) {
        // if user is authenticated, proceed 
        return next();
    }
    // send error if not authenticated
    console.log("Error: User tried accessing admin protected route");

    res.status(401).send('Unauthorized: You must be admin');
}

// default route
app.get('/', (req, res) => {
    res.send('hello world');
});

// google auth route

app.get('/auth/google', passport.authenticate('google', {scope: ['email']}));
/** 
 * API for checking if the curent session is validated
 * @request GET
 * @resonse {authorized: boolean, userID: int}
 * 
*/
app.get('/api/validation', (req,res) => {
    console.log("user check auth api: " + req.session.isAuthenticated + "  user: " +req.session.userID);
    if (req.session.isAuthenticated) {
        res.json({authorized: true, userID:req.session.userID})
    } else {
        res.json({authorized: false})
    }
});

/**
 * API for setting the users name and mealPLan status
 * @request POST
 * @body {firstName: string, lastName: string, hasMealPlan: bool}
 * @response 200 ok || 500 server error
 */
 app.post('/api/setUser', isAuthenticated, async (req,res) => {
    const {firstName, lastName, hasMealPlan} = req.body;
    const parsedHasMealPlan =  hasMealPlan == "true" ? true : false; // prob back practice to convert to bool on backend, oh well..
    try {
        await User.update(
            {firstName: firstName, lastName: lastName, hasMealPlan: parsedHasMealPlan},
            { where: { userID: req.session.userID}}
        );
    } catch (err) {
        console.log(err);
        res.status(500).send("server error");
    }
    res.status(200).send("sucess!");
 })
// define the callback route for Google
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000/' }), (req, res) => {
    // successful authentication, redirect to another page
    req.session.isAuthenticated = true;
    req.session.userID = req.user.userID;
    // console.log(req.user.userID);
    if (req.user.firstName == null) {
        // console.log(req.session.isAuthenticated +"\n");
         // associate the UserID with the session object
        res.redirect('http://localhost:3000/?signUp=true');
        // res.redirect('http://localhost:3000/');
    } else {
        res.redirect('http://localhost:3000/?signUp=false');
    }
  }
);
app.post('/api/logout', isAuthenticated, (req, res) => {
    // Destroy the session and handle the result
    req.session.destroy(err => {
      if (err) {
        console.error('Session destruction error:', err);
        res.status(500).send('Could not log out, server error');
      } else {
        res.status(200).json({ success: true });
      }
    });
  });
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
