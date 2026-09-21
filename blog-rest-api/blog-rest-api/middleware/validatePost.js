/**
 * Middleware to validate blog post data on Create (POST) requests.
 * Ensures required fields are present and are non-empty strings.
 */
const validatePost = (req, res, next) => {
  const { title, content, author, category } = req.body;
  const errors = [];

  if (!title || typeof title !== "string" || title.trim() === "") {
    errors.push("Title is required and must be a non-empty string.");
  }

  if (!content || typeof content !== "string" || content.trim() === "") {
    errors.push("Content is required and must be a non-empty string.");
  }

  if (!author || typeof author !== "string" || author.trim() === "") {
    errors.push("Author name is required and must be a non-empty string.");
  }

  if (!category || typeof category !== "string" || category.trim() === "") {
    errors.push("Category is required and must be a non-empty string.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  next();
};

/**
 * Middleware to validate blog post data on Update (PUT) requests.
 * Fields are optional here, but if present must be non-empty strings.
 */
const validatePostUpdate = (req, res, next) => {
  const { title, content, author, category } = req.body;
  const errors = [];

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    errors.push("Title must be a non-empty string.");
  }

  if (content !== undefined && (typeof content !== "string" || content.trim() === "")) {
    errors.push("Content must be a non-empty string.");
  }

  if (author !== undefined && (typeof author !== "string" || author.trim() === "")) {
    errors.push("Author name must be a non-empty string.");
  }

  if (category !== undefined && (typeof category !== "string" || category.trim() === "")) {
    errors.push("Category must be a non-empty string.");
  }

  if (Object.keys(req.body).length === 0) {
    errors.push("Request body cannot be empty. Provide at least one field to update.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  next();
};

/**
 * Middleware to validate that :id route param is a valid positive integer.
 */
const validateIdParam = (req, res, next) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid post ID. ID must be a positive integer.",
    });
  }

  next();
};

module.exports = {
  validatePost,
  validatePostUpdate,
  validateIdParam,
};
