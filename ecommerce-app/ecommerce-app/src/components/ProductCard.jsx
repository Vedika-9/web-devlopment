import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice.js'

function ProductCard({ product }) {
  const dispatch = useDispatch()

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-link">
        <img src={product.image} alt={product.title} className="product-image" />
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.title}</h3>
        {product.rating && (
          <p className="product-rating">
            ⭐ {product.rating.rate} ({product.rating.count})
          </p>
        )}
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button onClick={() => dispatch(addToCart(product))} className="btn btn-primary">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
