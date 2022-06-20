const Post = require("../../models/Post");
// const slugify = require("slugify");

exports.findPostById = async (postId, next) => {
  try {
    const post = await Post.findById(postId);
    return post;
  } catch (error) {
    next(error);
  }
};
exports.postsGet = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    next(error);
  }
};
exports.postsCreate = async (req, res, next) => {
  try {
    const newPost = await Post.create(req.body);
    // console.log(req.body.slug);
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

exports.postsDelete = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.post._id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.postsUpdate = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(req.post._id, req.body);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
