var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");


//Landing route
router.get("/", function(req, res){
    res.render("landing");
});

//============
// Auth Routes
//============

router.get("/register", function(req, res){
    res.render("register")
});

//Handle signup logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {"error":err.message});
            
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect('/campgrounds');
            req.flash("success", "Welcome to Yelp Camp" + user.username);
            
        })
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//Handling Login Logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//logout logic
router.get("/logout", function(req,res){
    req.logOut();
    req.flash("success", "Goodbye")
    res.redirect('/campgrounds')
});

module.exports = router;
