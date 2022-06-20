const express = require("express");
const slugify = require("slugify");
// const { append } = require("express/lib/response");

const router = express.Router();
const {
  postsGet,
  postsUpdate,
  postsDelete,
  postsCreate,
  findPostById,
} = require("./posts.controllers");

//Middlewares
//router param

router.param("postId", async (req, res, next, postId) => {
  const post = await findPostById(postId, next);
  if (post) {
    req.post = post;
    next();
  } else {
    const err = new Error("Post Not Found");
    err.status = 404;
    next(err);
  }
});
// exports.slugMiddleware = (title, next) => {
//   return slugify(title, { delimeter: "-" });
// };
router.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.slug = slugify(req.body.title, { delimeter: "-" });
  }
  next();
});

router.get("/", postsGet);
router.post("/", postsCreate);
router.delete("/:postId", postsDelete);
router.put("/:postId", postsUpdate);

module.exports = router;
