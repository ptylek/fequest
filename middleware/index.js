var Question       = require("../models/question");
var Comment       = require("../models/comment");
var middlewareObj = {};
    
middlewareObj.checkQuestionOwnership = function(req, res, next){
    // is user logged in
    if(req.isAuthenticated()){
        Question.findById(req.params.id, function(err, foundQuestion){
            if(err || !foundQuestion){
                req.flash("error", "Question not found");
                res.redirect("back");
            } else {
                // does user own the question
                if(foundQuestion.author.id.equals(req.user._id)){
                   next();
                } else {
                    // otherwise redirect
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
            } else {
                // if not, redirect
                req.flash("error", "You must be logged in to do that");
                res.redirect("back");
            }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found")
                res.redirect("back");
            } else {
                // does user own the comment
                if(foundComment.author.id.equals(req.user._id)){
                   next();
                } else {
                    // otherwise redirect
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        });
            } else {
                // if not, redirect
                req.flash("error", "You must be logged in to do that!");
                res.redirect("back");
            }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
};

module.exports = middlewareObj;