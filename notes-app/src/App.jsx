import { useState, useMemo } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import NoteForm from './components/NoteForm.jsx'
import NoteGrid from './components/NoteGrid.jsx'
import Toolbar from './components/Toolbar.jsx'
import './App.css'

function App() {
  const [notes, setNotes] = useLocalStorage('marginalia-notes', [])
  const [editingNote, setEditingNote] = useState(null)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const saveNote = (draft) => {
    if (editingNote) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id
            ? { ...note, ...draft, updatedAt: new Date().toISOString() }
            : note,
        ),
      )
      setEditingNote(null)
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        ...draft,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setNotes((prev) => [newNote, ...prev])
    }
  }

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
    if (editingNote?.id === id) setEditingNote(null)
  }

  const startEditing = (note) => setEditingNote(note)
  const cancelEditing = () => setEditingNote(null)

  const visibleNotes = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase()

    return notes
      .filter((note) => activeCategory === 'All' || note.category === activeCategory)
      .filter((note) => {
        if (!lowerQuery) return true
        return (
          note.title.toLowerCase().includes(lowerQuery) ||
          note.body.toLowerCase().includes(lowerQuery)
        )
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [notes, query, activeCategory])

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__eyebrow">Keep Writing</p>
        <h1 className="app__title">Notes worth keeping.</h1>
        <p className="app__subtitle">{notes.length} note{notes.length === 1 ? '' : 's'} on the board</p>
      </header>

      <main className="app__main">
        <NoteForm onSave={saveNote} editingNote={editingNote} onCancelEdit={cancelEditing} />

        <Toolbar
          query={query}
          onQueryChange={setQuery}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <NoteGrid notes={visibleNotes} onEdit={startEditing} onDelete={deleteNote} />
      </main>
    </div>
  )
}

export default App
