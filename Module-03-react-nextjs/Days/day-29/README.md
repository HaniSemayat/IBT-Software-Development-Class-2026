# Addis Eats - React Day 29

Addis Eats is a React-based food menu project built as part of my Software Development training.

This is the **React project for Module 3 Day 29**, extending the interactive menu from Day 28 by loading menu data asynchronously from a JSON endpoint.

## Features

- Menu data loaded with `fetch()`
- Dishes stored in React state
- Category filtering
- Category changes trigger a new data request
- Loading state
- Error state
- Empty state
- HTTP response validation with `res.ok`
- Loading state cleared with `finally`
- Request cancellation with `AbortController`
- Search input automatically focused on mount
- Running order total in ETB
- TeleBirr delivery form
- Controlled form inputs
- TeleBirr phone validation
- Stable list keys using dish IDs
- Responsive menu layout

## Project Structure

```text
public/
└── dishes.json

src/
├── App.jsx
├── Card.jsx
├── CategoryBar.jsx
├── Dish.jsx
├── DishList.jsx
├── Menu.jsx
├── OrderForm.jsx
├── api.js
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
- Fetc API

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

## What I Practiced

This project helped me practice:

- Using useEffect() for asynchronous data loading
- Using useState() for fetched data, loading, and error states
- Using dependency arrays
- Refetching when state changes
- Checking response.ok
- Handling errors with try/catch
- Using finally for cleanup of loading state
- Cancelling requests with AbortController
- Using useRef() to focus an input
- Separating API logic into a helper function
- Handling loading, error, and empty states
- Keeping previous React state-based interactions