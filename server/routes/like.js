const express = require('express');
const router = express.Router();

const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');

//=================================
//             like
//=================================

// getLikes [START]
router.post('/getLikes', (req, res) => {
  let variable = {};

  if (req.body.postId) {
    variable = { postId: req.body.postId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Like.find(variable).exec((err, likes) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, likes });
  });
});
// getLikes [END]

// getDislike [START]
router.post('/getDislikes', (req, res) => {
  let variable = {};

  if (req.body.postId) {
    variable = { postId: req.body.postId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Dislike.find(variable).exec((err, dislikes) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, dislikes });
  });
});
// getDislike [END]

// upLike [START]
router.post('/upLike', (req, res) => {
  let variable = {};

  if (req.body.postId) {
    variable = { postId: req.body.postId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  // Like collection에다가 클릭 정보를 넣어준다.
  const like = new Like(variable);
  like.save((err, result) => {
    if (err) return res.status(400).json({ success: false, err });

    // 만약에 dislike이 이미 클릭이 되있다면, Dislike을 1 줄여준다.
    Dislike.findOneAndDelete(variable).exec((err, dislikeResult) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, dislikeResult });
    });
  });
});
// upLike [END]

// unLike [START]
router.post('/unLike', (req, res) => {
  let variable = {};

  if (req.body.postId) {
    variable = { postId: req.body.postId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Like.findOneAndDelete(variable).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, result });
  });
});
// unLike [END]

// unDislike [START]
router.post('/unDislike', (req, res) => {
  let variable = {};

  if (req.body.postId) {
    variable = { postId: req.body.postId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Dislike.findOneAndDelete(variable).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, result });
  });
});
// unDislike [END]

// upDislike [START]
router.post('/upDislike', (req, res) => {
  let variable = {};

  if (req.body.postId) {
    variable = { postId: req.body.postId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  // Dislike collection에다가 클릭 정보를 넣어준다.
  const dislike = new Dislike(variable);

  dislike.save((err, result) => {
    if (err) return res.status(400).json({ success: false, err });

    // 만약에 like가 이미 클릭이 되있다면, Like을 1 줄여준다.
    Like.findOneAndDelete(variable).exec((err, likeResult) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, likeResult });
    });
  });
});
// upDislike [END]

module.exports = router;
