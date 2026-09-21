const express = require("express");
const logger = require("./middleware/logger");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Built-in middleware to parse JSON request bodies
app.use(express.json());

// Custom request logger
app.use(logger);

// Root route - simple API info response
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Blog REST API",
    endpoints: {
      createPost: "POST /posts",
      getAllPosts: "GET /posts",
      getSinglePost: "GET /posts/:id",
      updatePost: "PUT /posts/:id",
      deletePost: "DELETE /posts/:id",
    },
  });
});

// Mount blog post routes
app.use("/posts", postRoutes);

// 404 handler for undefined routes
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
