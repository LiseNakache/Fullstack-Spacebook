var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', function () {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.post('/post', function (req, res) {
  console.log(req.body);
  var post = new Post(req.body);
  post.save(function (err, savedPost) {
    if (err) { res.send(err) }
    res.send(savedPost)
  });
})

app.get('/post', function (req, res) {
  Post.find({}, function (err, allTheSavedPosts) {
    if (err) { res.send(err) }
    res.send(allTheSavedPosts);
  })
})



app.delete('/post/:postId', function (req, res) {
  console.log("the id of the post is : " + req.params.postId);
  Post.findByIdAndRemove(req.params.postId, function (err, postToRemove) {
    if (err) { res.send(err) };
    console.log(postToRemove)
    res.send(postToRemove);
    console.log('Post successfully deleted!');
  });
});

app.post('/post/:postId/comments', function (req, res) {
  Post.findById(req.params.postId, function (err, thisPost) {
    if (err) { res.send(err) };
    thisPost.comments.push(req.body);
    thisPost.save(function (err,commentAdded) {
      if (err) {res.send(err)}
       res.send(thisPost);
      console.log("the comment was added to the post : " + thisPost)
    });
  })
});

app.delete('/post/:postId/comments/:commentId', function (req, res) {
  // Post.findById (req.params.postId, function (err, post) {
  //   if (err) { res.send(err) };
  //   post.comments.findByIdAndRemove(req.params.commentId, function (err, commentToRemove) {
  //     console.log('heyyyyyy')
  //   res.send(post);
  //   post.save();
  //   console.log('Comment successfully deleted!');
  // });
  // })

  Post.update(
    { _id: req.params.postId },
    {
      $pull: {
        comments: { _id: req.params.commentId }
      }
    },
    function (err, post) { res.send(post) }

  )

})


// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
// 2) to handle adding a post
// 3) to handle deleting a post
// 4) to handle adding a comment to a post
// 5) to handle deleting a comment from a post

app.listen(8000, function () {
  console.log("what do you want from me! get me on 8000 ;-)");
});
