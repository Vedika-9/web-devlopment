# Drift — Task Board

A task management app built with React. Part of the Week 04 Minor Project (To-Do App + Notes App).

## Project Overview

Drift is a single-page task manager. Tasks are added, checked off, edited in place, and filtered by status. A vertical "thread" runs down the task list, filling in as tasks are completed, so progress through the day is visible at a glance.

## Features Implemented

- Add new tasks with an optional due date
- Mark tasks as completed / pending
- Edit a task's title and due date inline
- Delete tasks
- Task status badges (Completed / Pending)
- Filter tasks: All, Pending, Completed (with live counts)
- Overdue tasks are flagged in red
- Data persists across reloads via `localStorage`
- Fully responsive layout (mobile → desktop)

## Technologies Used

- React 18 (functional components, hooks)
- Vite (build tooling)
- Plain CSS with custom properties (no framework)
- `useState`, `useEffect`, `useMemo`, and a custom `useLocalStorage` hook

## Project Structure

```
todo-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    ├── hooks/
    │   └── useLocalStorage.js
    └── components/
        ├── TaskForm.jsx
        ├── TaskList.jsx
        ├── TaskItem.jsx
        └── FilterBar.jsx
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the printed local URL (usually `http://localhost:5173`) in your browser.

To build a production bundle:
```bash
npm run build
```

## Screenshots

_Add screenshots here after running the app locally._
