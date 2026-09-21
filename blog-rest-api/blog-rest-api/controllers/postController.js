const { posts, getNextId } = require("../data/posts");

/**
 * @desc    Create a new blog post
 * @route   POST /posts
 */
const createPost = (req, res) => {
  const { title, content, author, category } = req.body;

  const newPost = {
    id: getNextId(),
    title: title.trim(),
    content: content.trim(),
    author: author.trim(),
    category: category.trim(),
    createdDate: new Date().toISOString(),
  };

  posts.push(newPost);

  res.status(201).json({
    success: true,
    message: "Blog post created successfully.",
    data: newPost,
  });
};

/**
 * @desc    Get all blog posts (supports optional ?category= and ?author= filters)
 * @route   GET /posts
 */
const getAllPosts = (req, res) => {
  let result = posts;
  const { category, author } = req.query;

  if (category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (author) {
    result = result.filter(
      (p) => p.author.toLowerCase() === author.toLowerCase()
    );
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result,
  });
};

/**
 * @desc    Get a single blog post by ID
 * @route   GET /posts/:id
 */
const getPostById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: `Blog post with ID ${id} not found.`,
    });
  }

  res.status(200).json({
    success: true,
    data: post,
  });
};

/**
 * @desc    Update an existing blog post
 * @route   PUT /posts/:id
 */
const updatePost = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: `Blog post with ID ${id} not found.`,
    });
  }

  const { title, content, author, category } = req.body;

  if (title !== undefined) post.title = title.trim();
  if (content !== undefined) post.content = content.trim();
  if (author !== undefined) post.author = author.trim();
  if (category !== undefined) post.category = category.trim();
  post.updatedDate = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: "Blog post updated successfully.",
    data: post,
  });
};

/**
 * @desc    Delete a blog post
 * @route   DELETE /posts/:id
 */
const deletePost = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = posts.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Blog post with ID ${id} not found.`,
    });
  }

  const deleted = posts.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: "Blog post deleted successfully.",
    data: deleted,
  });
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
