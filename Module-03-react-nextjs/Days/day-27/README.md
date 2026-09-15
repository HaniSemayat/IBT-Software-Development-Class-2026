# Addis Eats - React Day 27

Addis Eats is a static food menu rebuilt with React as part of my Software Development training.

This is the **React project for Module 3 Day 27**, focusing on props, PropTypes, default props, conditional rendering, children, filtering, empty states, and stable keys.

## Features

- Static Addis Eats menu
- Reusable Dish component
- PropTypes validation
- Required `name` and `price` props
- Optional `spicy` prop
- Default currency of ETB
- Conditional "Spicy" badge
- Reusable Card component using `children`
- Menu filtering by category
- Empty state when no dishes match
- Menu rendered with `map()`
- Stable keys using each dish's `id`

## Project Structure

```text
src/
├── App.jsx
├── Card.jsx
├── Dish.jsx
├── Menu.jsx
├── data.js
├── index.css
└── main.jsx
```
## Technologies
- React
- Vite
- JavaScript
- JSX
- PropTypes

## How to Run

Install the dependencies:

```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Then open the local URL provided by Vite.

## What I Practiced

This project helped me practice:

- Passing and validating props
- Using default prop values
- Conditional rendering with &&
- Using the children prop
- Filtering arrays with filter()
- Rendering lists with map()
- Using stable keys with unique IDs
- Creating reusable React components
- Handling empty states
