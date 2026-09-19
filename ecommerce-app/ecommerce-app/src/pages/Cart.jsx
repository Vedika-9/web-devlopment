import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from '../store/cartSlice.js'

function Cart() {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const totalItems = useSelector(selectCartTotalItems)
  const totalPrice = useSelector(selectCartTotalPrice)

  if (items.length === 0) {
    return (
      <div className="cart empty-cart">
        <h1>Your Cart is Empty</h1>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="cart">
      <h1>Shopping Cart</h1>
      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.title} />
            <div className="cart-item-info">
              <h3>{item.title}</h3>
              <p>${item.price.toFixed(2)}</p>
            </div>
            <div className="qty-controls">
              <button onClick={() => dispatch(decreaseQuantity(item.id))}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
            </div>
            <p className="line-total">${(item.price * item.quantity).toFixed(2)}</p>
            <button className="remove-btn" onClick={() => dispatch(removeFromCart(item.id))}>
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p>Total Items: {totalItems}</p>
        <p className="grand-total">Total: ${totalPrice.toFixed(2)}</p>
        <div className="cart-actions">
          <button className="btn btn-secondary" onClick={() => dispatch(clearCart())}>
            Clear Cart
          </button>
          <Link to="/products" className="btn btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
