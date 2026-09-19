const FILTERS = ['All', 'Pending', 'Completed']

function FilterBar({ activeFilter, onChangeFilter, counts }) {
  return (
    <div className="filter-bar">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          className={`filter-bar__pill ${activeFilter === filter ? 'filter-bar__pill--active' : ''}`}
          onClick={() => onChangeFilter(filter)}
        >
          {filter}
          <span className="filter-bar__count">{counts[filter]}</span>
        </button>
      ))}
    </div>
  )
}

export default FilterBar
