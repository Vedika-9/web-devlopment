# ShopEase — E-commerce Frontend (React + Redux Toolkit)

A responsive e-commerce frontend built for the Week 05 Minor Project. It simulates a
real-world online shopping experience: browsing products, viewing details, and managing
a shopping cart, all backed by Redux Toolkit for state management.

## Features

- **Home Page** — hero banner, navigation, and a featured products section
- **Product Listing Page** — grid layout with image, name, price, category, and rating
- **Product Details Page** — image, description, price, and Add to Cart
- **Shopping Cart** — add/remove items, increase/decrease quantity, live totals
- **Search & Filter** — search by name, filter by category, sort by price
- **State Management** — Redux Toolkit (slices, actions, reducers, thunks, selectors)
- **Persistent Cart** — cart is saved to `localStorage` and restored on reload (bonus)
- **Loading & Error States** — spinner while fetching, friendly error messages
- **Responsive Design** — works on mobile, tablet, and desktop

## Tech Stack

- React 18 (functional components + hooks)
- Redux Toolkit + React Redux
- React Router v6
- Vite
- [Fake Store API](https://fakestoreapi.com) for product data

## Project Structure

```
ecommerce-app/
├── src/
│   ├── components/        # Reusable UI pieces
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Filters.jsx
│   │   └── Loader.jsx
│   ├── pages/              # Route-level views
│   │   ├── Home.jsx
│   │   ├── ProductListing.jsx
│   │   ├── ProductDetails.jsx
│   │   └── Cart.jsx
│   ├── store/               # Redux Toolkit slices
│   │   ├── store.js
│   │   ├── productsSlice.js
│   │   └── cartSlice.js
│   ├── services/            # API calls
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
3. Open the printed local URL (usually `http://localhost:5173`).

To build for production:
```bash
npm run build
npm run preview
```

## State Management Notes

- `productsSlice.js` holds product data, loading/error status, and search/filter/sort
  state. `getProducts` is an async thunk that fetches from Fake Store API.
  Memoized-style selectors (`selectFilteredProducts`, `selectCategories`) derive the
  filtered/sorted list so components stay simple.
- `cartSlice.js` holds cart items and exposes `addToCart`, `removeFromCart`,
  `increaseQuantity`, `decreaseQuantity`, and `clearCart`. Every mutation persists the
  cart to `localStorage` so it survives a page refresh.

## Possible Next Steps (Bonus Ideas)

- Wishlist functionality
- Dark mode toggle
- Product pagination
- Login/Register UI
