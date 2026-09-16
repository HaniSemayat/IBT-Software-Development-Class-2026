# Addis Eats - React Day 28

Addis Eats is an interactive food ordering screen rebuilt with React as part of my Software Development training.

This is the **React project for Module 3 Day 28**, focusing on state, event handling, lifted state, controlled forms, live validation, conditional rendering, and reusable components.

## Features

- Interactive category filtering
- Active category chip styling
- Reusable CategoryBar component
- Reusable DishList component
- Stable list keys using dish IDs
- Empty state for categories with no dishes
- Add buttons for dishes
- Running order total in ETB
- Controlled delivery form
- Name, TeleBirr phone, and area fields
- Live TeleBirr phone validation
- Submit button disabled until the phone number is valid
- No DOM manipulation
- React state-driven interactivity

## Project Structure

```text
src/
├── App.jsx
├── Card.jsx
├── CategoryBar.jsx
├── Dish.jsx
├── DishList.jsx
├── Menu.jsx
├── OrderForm.jsx
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

Then open the local URL provided by Vite in your web browser.

## What I Practiced

This project helped me practice:

- Managing state with useState
- Lifting state into a parent component
- Passing state and event handlers through props
- Handling click events
- Filtering arrays with filter()
- Rendering lists with map()
- Using stable keys with unique IDs
- Conditional rendering
- Building controlled form inputs
- Managing multiple form fields with one state object
- Using the spread operator to update state
- Regular expression validation
- Disabling buttons based on validation state
- Building reusable React components