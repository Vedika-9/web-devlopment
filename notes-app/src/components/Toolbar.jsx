import { CATEGORIES } from './NoteForm.jsx'

function Toolbar({ query, onQueryChange, activeCategory, onCategoryChange }) {
  return (
    <div className="toolbar">
      <input
        type="search"
        className="toolbar__search"
        placeholder="Search notes…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <div className="toolbar__categories">
        <button
          className={`toolbar__chip ${activeCategory === 'All' ? 'toolbar__chip--active' : ''}`}
          onClick={() => onCategoryChange('All')}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`toolbar__chip ${activeCategory === category ? 'toolbar__chip--active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Toolbar
