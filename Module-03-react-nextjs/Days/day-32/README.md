## Day 32 — Context API & State Management

### State Management

Day 32 moves the Addis Eats cart state from React Context and `useReducer` into Zustand.

The cart is shared across multiple parts of the application, including the menu, cart page, cart badge, and checkout. Zustand keeps this state outside the React component tree and allows each component to subscribe only to the state it needs.

### Zustand Cart Store

The cart store is located at:

`src/cart/cartStore.js`

It contains:

* `items` — the dishes currently in the cart
* `addItem(dish)` — adds a dish to the cart
* `remove(id)` — removes a dish from the cart
* `clear()` — clears the cart

The store uses Zustand's `persist` middleware with the storage key:

`addis-eats-cart`

This allows the cart to survive a full page refresh.

### Narrow Selectors

Components use narrow Zustand selectors instead of subscribing to the entire store.

For example:

```jsx
const items = useCartStore((state) => state.items);
```

and:

```jsx
const clear = useCartStore((state) => state.clear);
```

This keeps components subscribed only to the state or action they actually need.

### Authentication

Authentication remains in React Context because it is simple application-wide session state and does not change frequently.

Authentication is separated into:

* `src/auth/AuthContext.jsx` — provides the authentication state
* `src/auth/useAuth.js` — provides the guarded `useAuth` hook
* `src/auth/RequireAuth.jsx` — protects authenticated routes

The `useAuth` hook throws an actionable error if it is used outside `AuthProvider`.

### Why the Cart Uses Zustand

The cart is a good fit for Zustand because it is shared by several components and changes frequently.

Zustand provides a simple store outside the component tree, while narrow selectors allow individual components to subscribe only to the part of the cart they need. The persist middleware also keeps the cart after a browser refresh.

### Why Authentication Stayed in Context

Authentication is relatively small and changes infrequently. React Context is sufficient for the current user, loading state, and login action.

Using Zustand for authentication would add another state-management layer without providing a meaningful benefit for this application.

### State Ownership

| State                       | Owner                 |
| --------------------------- | --------------------- |
| Cart items and cart actions | Zustand               |
| Authentication/session      | React Context         |
| Local component UI state    | `useState`            |
| Menu category               | URL query string      |
| Menu data                   | `useFetch` / API data |

### Day 32 Features

* Replaced the old Cart Context and reducer with Zustand
* Added persistent cart storage
* Updated Menu to use the Zustand store
* Updated DishDetail to use the Zustand store
* Updated Cart to use Zustand selectors
* Updated CartBadge to use a narrow selector
* Updated Checkout to use Zustand
* Removed the old `CartProvider`, `CartContext`, and cart reducer
* Kept authentication in React Context
* Added a dedicated guarded `useAuth` hook
* Kept the protected Checkout route from Day 31
* Verified that the cart survives a full page refresh
