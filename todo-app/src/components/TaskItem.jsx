import { useState } from 'react'

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(task.title)
  const [draftDate, setDraftDate] = useState(task.dueDate)

  const startEditing = () => {
    setDraftTitle(task.title)
    setDraftDate(task.dueDate)
    setIsEditing(true)
  }

  const saveEdit = () => {
    const trimmed = draftTitle.trim()
    if (!trimmed) return
    onEdit(task.id, { title: trimmed, dueDate: draftDate })
    setIsEditing(false)
  }

  const cancelEdit = () => setIsEditing(false)

  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0)

  if (isEditing) {
    return (
      <li className="task-item task-item--editing">
        <input
          type="text"
          className="task-item__edit-input"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          autoFocus
        />
        <input
          type="date"
          className="task-item__edit-date"
          value={draftDate || ''}
          onChange={(e) => setDraftDate(e.target.value)}
        />
        <div className="task-item__actions">
          <button className="task-item__btn task-item__btn--save" onClick={saveEdit}>
            Save
          </button>
          <button className="task-item__btn" onClick={cancelEdit}>
            Cancel
          </button>
        </div>
      </li>
    )
  }

  return (
    <li className={`task-item ${task.completed ? 'task-item--done' : ''}`}>
      <button
        className="task-item__check"
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
      >
        {task.completed ? '✓' : ''}
      </button>

      <div className="task-item__body">
        <span className="task-item__title">{task.title}</span>
        <div className="task-item__meta">
          <span className={`task-item__status task-item__status--${task.completed ? 'done' : 'pending'}`}>
            {task.completed ? 'Completed' : 'Pending'}
          </span>
          {task.dueDate && (
            <span className={`task-item__due ${isOverdue ? 'task-item__due--overdue' : ''}`}>
              {task.dueDate}
            </span>
          )}
        </div>
      </div>

      <div className="task-item__actions">
        <button className="task-item__btn" onClick={startEditing}>
          Edit
        </button>
        <button className="task-item__btn task-item__btn--delete" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </li>
  )
}

export default TaskItem
