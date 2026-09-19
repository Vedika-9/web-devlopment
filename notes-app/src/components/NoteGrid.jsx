import NoteCard from './NoteCard.jsx'

function NoteGrid({ notes, onEdit, onDelete }) {
  if (notes.length === 0) {
    return (
      <div className="note-grid__empty">
        <p>No notes match here yet. Write your first one above.</p>
      </div>
    )
  }

  return (
    <div className="note-grid">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default NoteGrid
