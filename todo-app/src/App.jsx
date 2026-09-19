import { useState, useEffect, useMemo } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import TaskForm from './components/TaskForm.jsx'
import TaskList from './components/TaskList.jsx'
import FilterBar from './components/FilterBar.jsx'
import './App.css'

function App() {
  const [tasks, setTasks] = useLocalStorage('drift-tasks', [])
  const [filter, setFilter] = useState('All')

  // Side effect: keep the browser tab title in sync with progress
  useEffect(() => {
    const remaining = tasks.filter((task) => !task.completed).length
    document.title = remaining > 0 ? `(${remaining}) Drift — Task Board` : 'Drift — Task Board'
  }, [tasks])

  const addTask = ({ title, dueDate }) => {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [newTask, ...prev])
  }

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    )
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const editTask = (id, updates) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  const filteredTasks = useMemo(() => {
    if (filter === 'Pending') return tasks.filter((task) => !task.completed)
    if (filter === 'Completed') return tasks.filter((task) => task.completed)
    return tasks
  }, [tasks, filter])

  const counts = useMemo(
    () => ({
      All: tasks.length,
      Pending: tasks.filter((task) => !task.completed).length,
      Completed: tasks.filter((task) => task.completed).length,
    }),
    [tasks],
  )

  const progressPercent = tasks.length
    ? Math.round((counts.Completed / tasks.length) * 100)
    : 0

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__eyebrow">Drift</p>
        <h1 className="app__title">Move your day forward.</h1>
        <div className="app__progress-track">
          <div className="app__progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="app__progress-label">
          {counts.Completed} of {tasks.length} tasks complete
        </p>
      </header>

      <main className="app__main">
        <TaskForm onAddTask={addTask} />
        <FilterBar activeFilter={filter} onChangeFilter={setFilter} counts={counts} />
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
        />
      </main>
    </div>
  )
}

export default App
