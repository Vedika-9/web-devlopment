# Blog REST API

A RESTful API for managing blog posts with full CRUD (Create, Read, Update, Delete) functionality, built with **Node.js** and **Express.js** as part of the Week 06 Minor Project.

## Project Overview

This API allows users to create, retrieve, update, and delete blog posts. Each blog post contains a title, content, author name, category, and creation date. The project follows RESTful conventions, uses proper HTTP status codes, returns JSON responses, and includes input validation and centralized error handling.

Data is stored in-memory (a JavaScript array), so it resets whenever the server restarts. The code is organized into `routes/`, `controllers/`, `middleware/`, and `data/` folders for maintainability.

## Technologies Used

- **Node.js** — JavaScript runtime
- **Express.js** — web framework for routing and middleware
- **In-memory array** — basic data storage (no external database required)

## Project Structure

```
blog-rest-api/
├── routes/
│   └── postRoutes.js       # Route definitions for /posts endpoints
├── controllers/
│   └── postController.js   # Business logic for CRUD operations
├── middleware/
│   ├── validatePost.js     # Input validation middleware
│   ├── logger.js           # Request logging middleware
│   └── errorHandler.js     # 404 and global error handling
├── data/
│   └── posts.js            # In-memory data store
├── app.js                  # Express app configuration
├── server.js               # Server entry point
├── package.json
└── README.md
```

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-github-repo-url>
   cd blog-rest-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   Or, for auto-restart during development (requires `nodemon`):
   ```bash
   npm run dev
   ```

4. The server will run at:
   ```
   http://localhost:5000
   ```

## API Endpoints

| Method | Endpoint      | Description                    |
|--------|---------------|---------------------------------|
| POST   | `/posts`      | Create a new blog post          |
| GET    | `/posts`      | Retrieve all blog posts         |
| GET    | `/posts/:id`  | Retrieve a single blog post     |
| PUT    | `/posts/:id`  | Update an existing blog post    |
| DELETE | `/posts/:id`  | Delete a blog post              |

`GET /posts` also supports optional query filters: `?category=Programming` and `?author=Jane Doe`.

### Request Body (POST / PUT)

```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post.",
  "author": "Jane Doe",
  "category": "Technology"
}
```

For `PUT`, you may include only the fields you want to update.

### Sample Responses

**Success (200/201):**
```json
{
  "success": true,
  "message": "Blog post created successfully.",
  "data": {
    "id": 3,
    "title": "My First Blog Post",
    "content": "This is the content of my blog post.",
    "author": "Jane Doe",
    "category": "Technology",
    "createdDate": "2026-09-20T10:15:00.000Z"
  }
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Blog post with ID 99 not found."
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    "Title is required and must be a non-empty string."
  ]
}
```

## Testing Instructions

You can test the API using **Postman**, **Thunder Client**, or **Insomnia**.

1. Start the server with `npm start`.
2. Import the included `postman_collection.json` file into Postman (File → Import), or manually create requests against `http://localhost:5000`.
3. Try each endpoint:
   - `POST http://localhost:5000/posts` with a JSON body to create a post.
   - `GET http://localhost:5000/posts` to list all posts.
   - `GET http://localhost:5000/posts/1` to fetch a single post.
   - `PUT http://localhost:5000/posts/1` with a JSON body to update a post.
   - `DELETE http://localhost:5000/posts/1` to delete a post.
4. Confirm correct status codes are returned (200, 201, 400, 404) and that the JSON responses match the expected structure.

## Concepts Demonstrated

- REST API Design
- CRUD Operations
- Express Routing
- Custom Middleware (logging, validation, error handling)
- Request & Response Handling
- HTTP Status Codes
- JSON Data Handling

## Possible Future Enhancements (Bonus)

- MongoDB integration for persistent storage
- User authentication using JWT
- Pagination for blog posts
- API documentation with Swagger
- Deployment to Render/Railway
