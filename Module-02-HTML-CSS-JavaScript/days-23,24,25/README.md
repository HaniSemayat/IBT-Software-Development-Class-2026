# Addis Eats

Addis Eats is a responsive food ordering web application built as part of my Software Development training.

This is the **Module 2 project for Days 23, 24, and 25**, where I practiced combining HTML, CSS, and JavaScript to build a functional, data-driven application.

## Features

- Browse food and drinks
- Live search
- Category filtering
- Add items to cart
- Update quantities
- Remove items
- Dynamic ETB total
- Cart persistence with `localStorage`
- Checkout form and validation
- Order confirmation
- Loading, empty, and error states
- Responsive design

## Technologies

- HTML5
- CSS3
- JavaScript
- JSON
- Fetch API
- DOM Manipulation
- localStorage

## How It Works

The menu is loaded from `data/menu.json` using the Fetch API. JavaScript manages the menu, search, categories, and shopping cart.

Cart data is saved in `localStorage`, so items remain after refreshing the page. During checkout, the customer's information is validated and an order confirmation is displayed.

## How to Run

Because the project uses `fetch()` to load the menu data, run it using a local server such as **VS Code Live Server**.

1. Open the project in VS Code.
2. Open `index.html`.
3. Right-click and select **Open with Live Server**.

## What I Practiced

This project helped me practice DOM manipulation, events, event delegation, array methods, Fetch API, JSON, `localStorage`, form validation, state management, and responsive design.

## Author

Built as part of my IBT Software Development learning journey.

**Module 2 — Days 23, 24 & 25**