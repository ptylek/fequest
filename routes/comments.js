var express    = require("express");
var Question   = require("../models/question");
var Comment    = require("../models/comment");
var router     = express.Router({mergeParams: true});
var middleware = require("../middleware");

// NEW comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find question by id
    Question.findById(req.params.id, function(err, question){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {question: question}); 
        }
    });
});

// CREATE comment
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup questions using id
    Question.findById(req.params.id, function(err, question){
        if(err){
            console.log(err);
            res.redirect("/questions");
        } else {
            // create comments
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.email = req.user.email;
                    comment.author.avatar = req.user.avatar;
                    // connect new comment to question
                    comment.save();
                    question.comments.push(comment);
                    question.save();
                    // redirect question show page
                    req.flash("success", "Comment successfully added");
                    res.redirect("/questions/" + question._id);
                }
            });
        }
    });
});

// EDIT comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Question.findById(req.params.id, function(err, foundQuestion){
        if(err || !foundQuestion){
            req.flash("error", "Question not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {question_id: req.params.id, comment: foundComment});  
            }
        });
    });
});

// UPDATE comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully updated");
            res.redirect("/questions/" + req.params.id);
        }
    });
});

// DESTROY comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully removed");
            res.redirect("/questions/" + req.params.id);
        }
    });
});

module.exports = router;