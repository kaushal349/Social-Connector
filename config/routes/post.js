const express = require('express');
const Profile = require('../models/Profile');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const router = express.Router();

// @route POST /api/post
// desc create posts
// mode private
router.post(
  '/',
  [auth, [check('text', 'text are required').not().notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id);
      const newpost = new Post({
        user: user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      });
      await newpost.save();
      return res.json(newpost);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('server error');
    }
  }
);

// @route GET /api/post
// desc get all posts
// mode private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ date: -1 });
    return res.json(posts);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error');
  }
});

// @route GET /api/post/:post_id
// desc get specific user post
// mode private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }
    if (req.user.id != post.user.toString()) {
      return res.status(401).json({ msg: 'user not authorized' });
    }
    return res.json(post);
  } catch (error) {
    return res.status(500).send('server error');
  }
});

// @route DELTE /api/post/:post_id
// desc deletes specific user post
// mode private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }
    if (req.user.id !== post.user.toString()) {
      return res.status(401).json({ msg: 'user not authorized' });
    }
    await Post.findByIdAndRemove(req.params.post_id);
    return res.json({ msg: 'post deleted' });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error');
  }
});

// @route PUT /api/post/like/:post_id
// desc like a post
// mode private
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }
    //   check if post has already been liked
    if (
      post.likes.filter((like) => {
        return like.user.toString() === req.user.id;
      }).length > 0
    ) {
      return res.json({ msg: 'post has already been liked' });
    }
    const likeobject = {
      user: req.user.id,
    };
    post.likes.unshift(likeobject);
    await post.save();
    return res.json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error');
  }
});

// @route PUT /api/post/unlike/:post_id
// desc unlikes a post
// mode private
router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }
    //   check if post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length == 0
    ) {
      return res.json({ msg: 'post has not been liked yet!' });
    }

    const removeat = post.likes
      .map((like) => like.id)
      .indexOf(req.params.post_id);
    post.likes.splice(removeat, 1);
    await post.save();
    return res.json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error');
  }
});

// @route PUT /api/post/add_comment/:post_id
// desc adds a comment
// mode private
router.put(
  '/add_comment/:post_id',
  [auth, [check('text', 'text is required').not().notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.post_id);
      if (!post) {
        return res.status(400).json({ msg: 'Post not found' });
      }
      const user = await User.findById(req.user.id);
      const commentobject = {
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
        text: req.body.text,
      };
      post.comments.unshift(commentobject);
      await post.save();
      return res.json(post);
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('server error');
    }
  }
);

// @route PUT /api/post/remove_comment/:post_id/:comment_id
// desc removes a comment
// mode private
router.put('/remove_comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(400).json({ msg: 'Post not found' });
    }
    //   check if there is no comment
    if (
      post.comments.filter(
        (cmt) =>
          cmt.user.toString() === req.user.id &&
          cmt.id === req.params.comment_id
      ).length == 0
    ) {
      return res.json({ msg: 'No comment found!' });
    }

    const removeat = post.comments
      .map((cmt) => cmt.id)
      .indexOf(req.params.comment_id);
    post.comments.splice(removeat, 1);
    await post.save();
    return res.json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error');
  }
});
module.exports = router;
