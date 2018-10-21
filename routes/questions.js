var express    = require("express");
var router     = express.Router();
var Question   = require("../models/question");
var middleware = require("../middleware");

// INDEX - show all questions

router.get("/", function(req, res){
    Question.find({}, function(err, allQuestions){
        if(err){
        console.log(err);
        } else {
            res.render("questions/index", {questions: allQuestions, currentUser: req.user, page: 'questions'});
        }
    })
});

// CREATE - add new question to DB

router.post("/", middleware.isLoggedIn,function(req, res){
    // take data and add to array
    var name = req.body.name;
    var image = req.body.image;
    var technology = req.body.technology;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar
    };
    var newQuestion = {name: name, image: image, technology: technology, description: desc, author: author};
    // create new question and save to DB
    Question.create(newQuestion, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            // redirect
            res.redirect("/questions");
        }
    })
});

// NEW - show form to create new questions

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("questions/new");
});

// SHOW - display questions

router.get("/:id", function(req, res){
    // find question with id
    Question.findById(req.params.id).populate("comments").exec(function(err, foundQuestion){
        if(err || !foundQuestion){
            req.flash("error", "Question not found!");
            res.redirect("back");
        } else {
            console.log(foundQuestion);
            // render
            res.render("questions/show", {question: foundQuestion});
        }
    });
});

// EDIT Question route
router.get("/:id/edit", middleware.checkQuestionOwnership, function(req,res){
    Question.findById(req.params.id, function(err, foundQuestion){
        res.render("questions/edit", {question: foundQuestion});
    });
});

// UPDATE Question route
router.put("/:id", middleware.checkQuestionOwnership, function(req, res){
    // find and update the correct question
    Question.findByIdAndUpdate(req.params.id, req.body.question, function(err, updatedQuestion){
        if(err){
            res.redirect("/questions");
        } else {
            // redirect to question (show page)
            res.redirect("/questions/" + req.params.id);
        }
    });
});

// DESTROY question route
router.delete("/:id", middleware.checkQuestionOwnership, function(req, res){
   Question.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/questions");
       } else {
           req.flash("success", "Question successfully removed");
           res.redirect("/questions");
       }
   });
});

module.exports = router;