const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const {
  validatePost,
  validatePostUpdate,
  validateIdParam,
} = require("../middleware/validatePost");

// POST /posts -> Create a new blog post
router.post("/", validatePost, createPost);

// GET /posts -> Retrieve all blog posts
router.get("/", getAllPosts);

// GET /posts/:id -> Retrieve a specific blog post
router.get("/:id", validateIdParam, getPostById);

// PUT /posts/:id -> Update an existing blog post
router.put("/:id", validateIdParam, validatePostUpdate, updatePost);

// DELETE /posts/:id -> Delete a blog post
router.delete("/:id", validateIdParam, deletePost);

module.exports = router;
