var express    = require("express");
var router     = express.Router();
var passport   = require("passport");
var User       = require("../models/user");
var Question   = require("../models/question");
var middleware = require("../middleware");

// LANDING PAGE

router.get("/", function(req, res){
    res.render("landing");
});

// ===========
// AUTH ROUTES
// ===========

// REGISTER form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

// REGISTER logic

router.post("/register", function(req, res){
   var newUser = new User(
       {
           username: req.body.username, 
           email: req.body.email, 
           avatar: req.body.avatar
        }
    );
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("register");
       } 
           passport.authenticate("local")(req, res, function(){
               req.flash("success", "Welcome to fequest, " + user.username);
               res.redirect("/questions");
        });
   });
});

// LOGIN form
router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

// LOGIN logic
router.post("/login", passport.authenticate("local", 
    {successRedirect: "/questions",
    failureRedirect: "/login"
    }), function(req, res){
});

// LOGOUT route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "You have been successfully logged out");
   res.redirect("/questions");
});

// USER profile
router.get("/users/:id", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
       if(err){
           req.flash("error", "Something went wrong");
           return res.redirect("/");
       } 
   Question.find().where('author.id').equals(foundUser._id).exec(function(err, questions) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
       res.render("users/show", {user: foundUser, questions: questions});
   })
   });
});

module.exports = router;