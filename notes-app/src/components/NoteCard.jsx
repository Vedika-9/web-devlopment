const CATEGORY_COLORS = {
  General: '#8b8578',
  Work: '#2f5233',
  Ideas: '#e07856',
  Personal: '#5b6ea8',
}

function formatTimestamp(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' · ' +
    date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function NoteCard({ note, onEdit, onDelete }) {
  const flagColor = CATEGORY_COLORS[note.category] || CATEGORY_COLORS.General

  return (
    <article className="note-card">
      <span className="note-card__flag" style={{ background: flagColor }}>
        {note.category}
      </span>

      <h3 className="note-card__title">{note.title}</h3>
      {note.body && <p className="note-card__body">{note.body}</p>}

      <div className="note-card__footer">
        <span className="note-card__timestamp">{formatTimestamp(note.updatedAt)}</span>
        <div className="note-card__actions">
          <button className="note-card__btn" onClick={() => onEdit(note)}>
            Edit
          </button>
          <button className="note-card__btn note-card__btn--delete" onClick={() => onDelete(note.id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

export default NoteCard
