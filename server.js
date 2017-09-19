var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function() {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/post', function(req, res){
  console.log(req.body);
//in server.js because there is no link with postModel
  var post = new Post(req.body);
  post.save();
//
})

app.get('/post', function (req, res) {
Post.find({},function(err,results){
    if(err) {console.log(err)}
    console.log(results)
    res.send(results);
  })
  })


// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
// 2) to handle adding a post
// 3) to handle deleting a post
// 4) to handle adding a comment to a post
// 5) to handle deleting a comment from a post

app.listen(8000, function() {
  console.log("what do you want from me! get me on 8000 ;-)");
});
