/**
 * In-memory data store for blog posts.
 * Acts as our "database" for this project (Basic storage option).
 * Data resets every time the server restarts.
 */

let posts = [
  {
    id: 1,
    title: "Getting Started with Node.js",
    content: "Node.js is a JavaScript runtime built on Chrome's V8 engine...",
    author: "Jane Doe",
    category: "Programming",
    createdDate: "2026-09-01T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Why Express.js Makes Backend Development Easier",
    content: "Express.js is a minimal and flexible Node.js web framework...",
    author: "John Smith",
    category: "Web Development",
    createdDate: "2026-09-05T14:30:00.000Z",
  },
];

// Keeps track of the next ID to assign to a new post
let nextId = 3;

const getNextId = () => nextId++;

module.exports = {
  posts,
  getNextId,
};
