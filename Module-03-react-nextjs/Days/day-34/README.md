# Day 34- Hardened Addis Eats

A React-based Ethiopian food ordering application built as part of the IBT Fullstack Software Development & QA Engineering program.

Addis Eats demonstrates modern React development through reusable components, state management, routing, forms, API-style data loading, authentication, error handling, lazy loading, accessibility, and performance profiling.

## 🚀 Features

* Browse an Ethiopian-inspired food menu
* Filter dishes by category
* View individual dish details
* Quick-view dish information in an accessible modal
* Add and remove dishes from the cart
* Persist cart data with Zustand
* User authentication and protected checkout
* Controlled checkout form with validation
* Ethiopian phone number validation
* Server-style order validation errors
* Order receipt after successful checkout
* Separate error boundaries for menu, cart, checkout, and receipt
* Lazy-loaded checkout and receipt routes
* Loading states with Suspense
* Keyboard-accessible modal with:

  * Escape-to-close
  * Focus trapping
  * Focus return
  * Portal rendering with `createPortal`
* Performance profiling with React DevTools
* Targeted component optimization using `memo()` and `useCallback()`
* Responsive layout

## 🛠️ Tech Stack

* React
* React Router
* Zustand
* React Hook Form
* JavaScript
* HTML
* CSS
* Vite
* ESLint
* Git & GitHub

## 📚 React Concepts Demonstrated

This project brings together concepts learned throughout the React module:

### Components

The application is divided into reusable components such as:

* `Dish`
* `DishItem`
* `DishList`
* `Card`
* `CategoryBar`
* `Modal`
* `Field`

### State

React state is used for local UI behavior such as:

* Form values
* Form validation state
* Modal visibility
* Selected dishes
* Loading and submission states

Zustand manages shared cart state.

### Routing

React Router is used for:

* Home
* Menu
* Dish details
* Cart
* Login
* Checkout
* Receipt
* Not Found

Protected routes are used for checkout.

### Data Loading

Menu data is loaded through a custom `useFetch` hook with loading and error states.

### Forms

The checkout demonstrates:

* Controlled inputs
* Field-level validation
* Blur validation
* Server-style validation errors
* Accessible error messages
* React Hook Form implementation

### Error Boundaries

Separate error boundaries protect different application regions.

For example, a menu rendering error should not take down the cart or the rest of the application.

A deliberate test error can be enabled in `Dish.jsx` to verify the menu error boundary.

### Lazy Loading

Checkout and receipt pages are lazy-loaded with React `lazy()` and displayed through `Suspense`.

This allows those routes to be loaded only when needed.

### Accessible Modal

The dish Quick View uses `createPortal()` to render the modal outside the normal component DOM hierarchy.

The modal supports:

* `role="dialog"`
* `aria-modal`
* Accessible labeling
* Escape-to-close
* Focus trapping
* Focus return
* Closing by clicking the backdrop

## 🛒 Cart

The cart is managed with Zustand and persisted to local storage.

Cart actions include:

* Add item
* Remove item
* Clear cart

The cart is shared between the menu, cart page, and checkout.

## 💳 Checkout

The checkout collects:

* Name
* TeleBirr phone number
* Delivery area
* Optional delivery notes

Orders are submitted through the local order API simulation.

A successful order produces a receipt containing the order information and items.

## ⚡ Performance Profiling

React DevTools Profiler was used to investigate rendering behavior.

The measured `DishList` render during the Quick View interaction was:

| Measurement         | Render time |
| ------------------- | ----------: |
| Before optimization |     19.5 ms |
| After optimization  |      3.8 ms |

The optimization extracted individual dishes into `DishItem` and used `memo()` together with stable `useCallback()` handlers.

The measured result is specific to the profiling interaction and development environment.

Further memoization was not added without profiling evidence.

See [`PROFILE.md`](./PROFILE.md) for the complete measurement and optimization notes.

## 📁 Project Structure

```text
src/
├── api/
│   └── orders.js
├── auth/
│   ├── AuthContext.jsx
│   ├── RequireAuth.jsx
│   └── useAuth.js
├── cart/
│   ├── Cart.jsx
│   └── cartStore.js
├── checkout/
│   ├── Checkout.jsx
│   ├── CheckoutHookForm.jsx
│   ├── Field.jsx
│   └── validate.js
├── hooks/
│   └── useFetch.js
├── ui/
│   └── Modal.jsx
├── App.jsx
├── Card.jsx
├── CategoryBar.jsx
├── Dish.jsx
├── DishDetail.jsx
├── DishItem.jsx
├── DishList.jsx
├── Home.jsx
├── Layout.jsx
├── Login.jsx
├── Menu.jsx
├── NotFound.jsx
├── Receipt.jsx
└── main.jsx
```

## ▶️ Run Locally

Clone the repository and enter the project directory:

```bash
git clone <your-repository-url>
cd day-34
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL provided by Vite.

## 🔍 Available Commands

Start development server:

```bash
npm run dev
```

Build the production application:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

## 🧪 Day 34 Hardening Checklist

The final Day 34 implementation includes:

* [x] Separate menu error boundary
* [x] Separate cart error boundary
* [x] Checkout error fallback
* [x] Receipt error fallback
* [x] Deliberate menu rendering error test
* [x] Lazy-loaded checkout
* [x] Lazy-loaded receipt
* [x] Suspense loading fallback
* [x] Error handling for failed lazy routes
* [x] Performance profiling
* [x] Measured optimization
* [x] `createPortal` modal
* [x] Escape-to-close
* [x] Focus trapping
* [x] Focus return
* [x] Final production build verification

## 🎓 Project Context

**Program:** IBT College Canada / QIYAS Advanced Digital Skills Training
**Track:** Fullstack Software Development & QA Engineering
**Project:** Addis Eats
**Module:** React & Next.js
**Day:** 34 — Hardening Addis Eats

---

Built as a learning project while developing practical React and fullstack development skills.
