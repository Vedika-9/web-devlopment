# Marginalia — Notes

A note-taking app built with React. Part of the Week 04 Minor Project (To-Do App + Notes App).

## Project Overview

Marginalia is a note-taking app styled after an index-card board: each note is a card with a colored category flag, arranged in a masonry-style grid. Notes can be searched, filtered by category, and edited in place using the same form used to create them.

## Features Implemented

- Create new notes with a title, body, and category
- Edit existing notes (reuses the create form)
- Delete notes
- View all notes in a responsive masonry grid
- Search notes by title or body (live filtering)
- Categorize notes (General, Work, Ideas, Personal) with color-coded flags
- Note timestamps ("last updated") shown on each card
- Data persists across reloads via `localStorage`
- Fully responsive layout (mobile → desktop)

## Technologies Used

- React 18 (functional components, hooks)
- Vite (build tooling)
- Plain CSS with custom properties and CSS multi-column layout (no framework)
- `useState`, `useEffect`, `useMemo`, and a custom `useLocalStorage` hook

## Project Structure

```
notes-app/
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
        ├── NoteForm.jsx
        ├── NoteGrid.jsx
        ├── NoteCard.jsx
        └── Toolbar.jsx
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
