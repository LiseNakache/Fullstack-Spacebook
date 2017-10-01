var SpacebookApp = function () {

  var posts = [];

  $.ajax({
    method: 'GET',
    url: '/post',
    dataType: "jsonp",
    success: function (allTheSavedPosts) {
      posts = allTheSavedPosts;
      console.log(posts);
      _renderPosts();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus)
    }
  })

  var $posts = $(".posts");

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }


  function addPost(newPost) {
    $.ajax({
      method: 'POST',
      url: '/post',
      data: { text: newPost, comments: [] },
      dataType: "jsonp",
      success: function (savedPost) {
        console.log(savedPost)
        posts.push(savedPost);
        console.log(posts)
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('err')
        console.log(textStatus)
      }
    })
  }

  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function (index) {
    var postId = posts[index]._id
    $.ajax({
      method: 'DELETE',
      url: '/post/' + postId,
      dataType: "jsonp",
      success: function (postToRemove) {
//ici index et non pas postTo Remove car le paramètre qui identifie l'array est l'index
//contrairement au DB, le parametre est Id
        posts.splice(index, 1);
        console.log(posts)
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('err')
        console.log(textStatus)
      }
    })
  };

  var addComment = function (newComment, postIndex) {
    var postId = posts[postIndex]._id
    $.ajax({
      method: 'POST',
      url: '/post/' + postId + '/comments',
      data: newComment,
      dataType: "jsonp",
      success: function (thisPost) {
        posts[postIndex] = thisPost;
        _renderComments(postIndex);
        console.log(thisPost)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus)
      }
    })
  };


  var deleteComment = function (postIndex, commentIndex) {
    var postId = posts[postIndex]._id;
    var commentId = posts[postIndex].comments[commentIndex]._id;
    $.ajax({
      method: 'DELETE',
      url:'/post/' + postId + '/comments/' + commentId,
      dataType: "jsonp",
      success: function (post) {
        posts[postIndex].comments.splice(commentIndex, 1);
        _renderComments(postIndex);
        console.log(post)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus)
      }

    })
  };

  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
  };
};

var app = SpacebookApp();


$('#addpost').on('click', function () {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function () {
  var index = $(this).closest('.post').index();;
  app.removePost(index);
});

$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var newComment = { text: $comment.val(), user: $user.val() };

  app.addComment(newComment, postIndex);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();

  app.deleteComment(postIndex, commentIndex);
});
