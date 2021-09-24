const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   name: String,
   email: String,
   blogs: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog"
   }]
});

const BlogSchema = new Schema({
   title: String,
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   body: String,
   comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
   }]
})

const CommentSchema = new Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog"
   },
   body: String
})

const User = mongoose.model("Author", UserSchema);
const Blog = mongoose.model("Blog", BlogSchema);
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = {User, Blog, Comment}