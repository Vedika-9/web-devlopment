import { useDispatch, useSelector } from 'react-redux'
import { setCategory, setSortBy, selectCategories } from '../store/productsSlice.js'

function Filters() {
  const dispatch = useDispatch()
  const category = useSelector((state) => state.products.category)
  const sortBy = useSelector((state) => state.products.sortBy)
  const categories = useSelector(selectCategories)

  return (
    <div className="filters">
      <select value={category} onChange={(e) => dispatch(setCategory(e.target.value))}>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c === 'all' ? 'All Categories' : c}
          </option>
        ))}
      </select>
      <select value={sortBy} onChange={(e) => dispatch(setSortBy(e.target.value))}>
        <option value="default">Sort: Default</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  )
}

export default Filters
