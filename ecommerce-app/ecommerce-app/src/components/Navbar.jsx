import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartTotalItems } from '../store/cartSlice.js'

function Navbar() {
  const totalItems = useSelector(selectCartTotalItems)

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">ShopEase</Link>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>
            Products
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active' : '')}>
            Cart {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
