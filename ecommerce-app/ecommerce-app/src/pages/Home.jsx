import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  getProducts,
  selectAllProducts,
  selectProductsStatus,
} from '../store/productsSlice.js'
import ProductCard from '../components/ProductCard.jsx'
import Loader from '../components/Loader.jsx'

function Home() {
  const dispatch = useDispatch()
  const products = useSelector(selectAllProducts)
  const status = useSelector(selectProductsStatus)

  useEffect(() => {
    if (status === 'idle') dispatch(getProducts())
  }, [status, dispatch])

  const featured = products.slice(0, 4)

  return (
    <div className="home">
      <section className="hero">
        <h1>Shop the Latest Trends</h1>
        <p>Quality products, unbeatable prices, delivered to your door.</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Shop Now
        </Link>
      </section>

      <section className="featured">
        <h2>Featured Products</h2>
        {status === 'loading' && <Loader />}
        {status === 'failed' && <p className="error">Could not load products.</p>}
        {status === 'succeeded' && (
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
