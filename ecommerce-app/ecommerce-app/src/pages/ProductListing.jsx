import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getProducts,
  selectFilteredProducts,
  selectProductsStatus,
  selectProductsError,
} from '../store/productsSlice.js'
import ProductCard from '../components/ProductCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Filters from '../components/Filters.jsx'
import Loader from '../components/Loader.jsx'

function ProductListing() {
  const dispatch = useDispatch()
  const products = useSelector(selectFilteredProducts)
  const status = useSelector(selectProductsStatus)
  const error = useSelector(selectProductsError)

  useEffect(() => {
    if (status === 'idle') dispatch(getProducts())
  }, [status, dispatch])

  return (
    <div className="product-listing">
      <h1>All Products</h1>
      <div className="listing-controls">
        <SearchBar />
        <Filters />
      </div>

      {status === 'loading' && <Loader />}
      {status === 'failed' && <p className="error">Error: {error}</p>}
      {status === 'succeeded' && products.length === 0 && (
        <p className="empty">No products match your search.</p>
      )}
      {status === 'succeeded' && products.length > 0 && (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductListing
