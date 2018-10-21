var mongoose = require ("mongoose");

var questionSchema = new mongoose.Schema({
   name: String,
   image: String,
   technology: String,
   description: String,
   createdAt: { type: Date, default: Date.now },
   author: {
     id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
     }, 
     username: String,
     email: String,
     avatar: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Question", questionSchema);