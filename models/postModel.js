var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments

//you don't need a comments collection
//you only need a posts collection

var Schema = mongoose.Schema
var commentSchema = new mongoose.Schema({
 text : String,
 user : String
});

var postSchema = new mongoose.Schema({
   text : String,
   comments : [commentSchema],
   id : String
});

var Post = mongoose.model('post', postSchema)




module.exports = Post
// module.exports = Comment