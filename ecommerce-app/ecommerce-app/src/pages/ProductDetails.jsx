import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchProductById } from '../services/api.js'
import { addToCart } from '../store/cartSlice.js'
import Loader from '../components/Loader.jsx'

function ProductDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    fetchProductById(id)
      .then((data) => {
        setProduct(data)
        setStatus('succeeded')
      })
      .catch(() => setStatus('failed'))
  }, [id])

  if (status === 'loading') return <Loader />
  if (status === 'failed' || !product) return <p className="error">Product not found.</p>

  return (
    <div className="product-details">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>
      <div className="details-grid">
        <div className="gallery">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="info">
          <span className="product-category">{product.category}</span>
          <h1>{product.title}</h1>
          {product.rating && (
            <p className="product-rating">
              ⭐ {product.rating.rate} ({product.rating.count} reviews)
            </p>
          )}
          <p className="description">{product.description}</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <button
            onClick={() => dispatch(addToCart(product))}
            className="btn btn-primary btn-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
