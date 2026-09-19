import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchProducts } from '../services/api.js'

// Async thunk to fetch products from the API
export const getProducts = createAsyncThunk('products/getProducts', async () => {
  const data = await fetchProducts()
  return data
})

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    searchTerm: '',
    category: 'all',
    sortBy: 'default',
  },
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload
    },
    setCategory(state, action) {
      state.category = action.payload
    },
    setSortBy(state, action) {
      state.sortBy = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { setSearchTerm, setCategory, setSortBy } = productsSlice.actions

// Selectors
export const selectAllProducts = (state) => state.products.items
export const selectProductsStatus = (state) => state.products.status
export const selectProductsError = (state) => state.products.error

export const selectFilteredProducts = (state) => {
  const { items, searchTerm, category, sortBy } = state.products
  let result = items

  if (searchTerm.trim()) {
    result = result.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  if (category !== 'all') {
    result = result.filter((p) => p.category === category)
  }

  if (sortBy === 'price-asc') {
    result = [...result].sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-desc') {
    result = [...result].sort((a, b) => b.price - a.price)
  }

  return result
}

export const selectCategories = (state) => {
  const cats = state.products.items.map((p) => p.category)
  return ['all', ...new Set(cats)]
}

export default productsSlice.reducer
