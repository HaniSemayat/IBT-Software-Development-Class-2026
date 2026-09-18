# Addis Eats - Week 1 React Project

Addis Eats is a React food ordering application built throughout Week 1 of my Software Development training.

The project brings together the React concepts learned from Days 26–30: components, props, state, events, API fetching, context, reducers, custom hooks, and memoization.

## Features

- Reusable React components
- Props and PropTypes
- Category filtering
- API-driven menu
- Loading state
- Error state
- Empty state
- AbortController request cancellation
- Auto-focused search field
- Add dishes to cart
- Shared cart state using Context
- Cart reducer for add, remove, and clear actions
- Cart item count in the header
- Checkout panel with cart items and total
- ETB order total
- TeleBirr delivery form
- Controlled form inputs
- TeleBirr phone validation
- Memoised Context provider value
- Memoised filtered dish list

## Project Structure

```text
src/
├── App.jsx
├── Card.jsx
├── CategoryBar.jsx
├── CartBadge.jsx
├── Checkout.jsx
├── Dish.jsx
├── DishList.jsx
├── Menu.jsx
├── OrderForm.jsx
├── index.css
├── main.jsx
│
├── hooks/
│   └── useFetch.js
│
└── cart/
    ├── CartContext.jsx
    ├── cartReducer.js
    └── CartProvider.jsx

public/
└── dishes.json
```

## React Concepts Practiced
### Components and Props

Reusable components are used throughout the application, including Dish, Card, CategoryBar, and DishList.

## State and Events

React state is used for the selected category and user interactions such as adding dishes to the cart

## Custom Hook

useFetch contains the reusable data-fetching logic.

It provides:

- data
- loading
- error

It also uses AbortController to cancel previous requests when the URL changes.

## Context

CartContext allows components such as CartBadge and Checkout to access the cart without passing cart data through multiple levels of props.

## Reducer

cartReducer owns the cart transitions:

- add
- remove
- clear

The reducer is kept separate from React components and works with plain state and action objects.

## Memoization

The cart provider value is memoised with useMemo so a new context value is not created on every render when the cart has not changed.

The filtered dish list is also memoised so the filtering calculation only runs when its dependencies change.

## API Data

The menu is loaded from:

``` public/dishes.json ```

The application fetches the menu whenever the selected category changes.

## How to Run

***Install the dependencies:***
```bash 
npm install
```
Start the development server:

```bash
npm run dev
```

Then open the local URL provided by Vite in your web browser.

## Technologies
- React
- Vite
- JavaScript
- JSX
- PropTypes
- Context API
- useReducer
- useEffect
- useState
- useRef
- useMemo
- Custom Hooks

# Week 1 Summary

### Days 26–30 built the application progressively:

- Day 26 — React components
- Day 27 — Props, PropTypes, children, filtering, and stable keys
- Day 28 — State, events, category interaction, cart total, and controlled forms
- Day 29 — API fetching, loading/error states, request cancellation, and refs
- Day 30 — Custom hooks, Context, reducers, and memoization

***So Overall, Week 1 — Addis Eats, Assembled.***
