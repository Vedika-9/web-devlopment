import { createSlice } from '@reduxjs/toolkit'

const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem('cart')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('cart', JSON.stringify(items))
  } catch {
    // ignore write errors (e.g. storage disabled)
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addToCart(state, action) {
      const product = action.payload
      const existing = state.items.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...product, quantity: 1 })
      }
      saveCartToStorage(state.items)
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
      saveCartToStorage(state.items)
    },
    increaseQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload)
      if (item) item.quantity += 1
      saveCartToStorage(state.items)
    },
    decreaseQuantity(state, action) {
      const item = state.items.find((i) => i.id === action.payload)
      if (item && item.quantity > 1) {
        item.quantity -= 1
      } else if (item) {
        state.items = state.items.filter((i) => i.id !== action.payload)
      }
      saveCartToStorage(state.items)
    },
    clearCart(state) {
      state.items = []
      saveCartToStorage(state.items)
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartTotalItems = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
export const selectCartTotalPrice = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity * i.price, 0)

export default cartSlice.reducer
