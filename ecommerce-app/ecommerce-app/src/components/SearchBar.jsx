import { useDispatch, useSelector } from 'react-redux'
import { setSearchTerm } from '../store/productsSlice.js'

function SearchBar() {
  const dispatch = useDispatch()
  const searchTerm = useSelector((state) => state.products.searchTerm)

  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => dispatch(setSearchTerm(e.target.value))}
    />
  )
}

export default SearchBar
