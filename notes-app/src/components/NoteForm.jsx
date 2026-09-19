import { useState, useEffect } from 'react'

const CATEGORIES = ['General', 'Work', 'Ideas', 'Personal']

const emptyDraft = { title: '', body: '', category: 'General' }

function NoteForm({ onSave, editingNote, onCancelEdit }) {
  const [draft, setDraft] = useState(emptyDraft)

  // When a note is selected for editing, load it into the form
  useEffect(() => {
    if (editingNote) {
      const { title, body, category } = editingNote
      setDraft({ title, body, category })
    } else {
      setDraft(emptyDraft)
    }
  }, [editingNote])

  const handleChange = (field) => (e) => {
    setDraft((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedTitle = draft.title.trim()
    if (!trimmedTitle) return

    onSave({ ...draft, title: trimmedTitle })
    setDraft(emptyDraft)
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="note-form__title"
        placeholder="Note title"
        value={draft.title}
        onChange={handleChange('title')}
      />
      <textarea
        className="note-form__body"
        placeholder="Write something worth keeping…"
        rows={4}
        value={draft.body}
        onChange={handleChange('body')}
      />
      <div className="note-form__footer">
        <select className="note-form__category" value={draft.category} onChange={handleChange('category')}>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className="note-form__buttons">
          {editingNote && (
            <button type="button" className="note-form__cancel" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
          <button type="submit" className="note-form__submit">
            {editingNote ? 'Save changes' : 'Add note'}
          </button>
        </div>
      </div>
    </form>
  )
}

export { CATEGORIES }
export default NoteForm
