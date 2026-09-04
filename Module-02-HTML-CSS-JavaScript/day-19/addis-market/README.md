# Addis Market Shopping List

An interactive shopping-list web application for a fictional Addis Market.

The application allows users to add shopping items with ETB prices, mark items as bought, remove items, and see a live running total.

This project is the foundation of the Week-2 project and is built using vanilla JavaScript, the DOM, and browser events without a framework.

## Features

* Add a shopping item with a name and ETB price
* Validate that both fields are filled
* Add items without reloading the page
* Dynamically create shopping-list rows using `createElement()`
* Mark items as bought
* Remove items from the list
* Use event delegation for list interactions
* Display a live running total of all item prices
* Responsive basic layout

## How It Works

### Adding an Item

The user enters an item name and price into the form.

JavaScript listens for the form's `submit` event and uses:

```javascript
e.preventDefault();
```

to prevent the page from reloading.

The item is then created dynamically using:

```javascript
document.createElement("li");
```

and added to the shopping list using:

```javascript
list.append(li);
```

### Bought Items

Clicking an item toggles the `bought` CSS class.

```javascript
li.classList.toggle("bought");
```

The appearance of bought items is controlled by CSS:

```css
#list li.bought {
    text-decoration: line-through;
    opacity: 0.6;
}
```

### Deleting Items

The application uses event delegation.

Instead of creating a separate click listener for every delete button, there is one listener on the list container.

```javascript
list.addEventListener("click", (e) => {
    // Handle list interactions
});
```

The clicked element is checked to determine whether it is a delete button.

### Running Total

Every item stores its price using a data attribute:

```javascript
li.dataset.price = itemPrice;
```

The `updateTotal()` function reads the prices from the list and calculates the current total.

The total is updated whenever an item is added or removed.

## Project Structure

```text
addis-market/
├── index.html
├── styles.css
├── app.js
└── README.md
```

### index.html

Contains the structure of the application, including:

* Shopping-list form
* Item name input
* Price input
* Shopping list
* Running total

### styles.css

Contains the visual styling of the application, including the bought-item state.

### app.js

Contains the application logic, including:

* DOM element selection
* Form submission
* Input validation
* Dynamic element creation
* Event delegation
* Bought-state toggling
* Item deletion
* Running total calculation

## Technologies

* HTML5
* CSS3
* JavaScript
* DOM API
* Browser Events

## Running the Project

No installation or build process is required.

Open `index.html` in a web browser, or use VS Code's Live Server extension.

For example:

```text
Open index.html with Live Server
```

## Current Limitations

The shopping list is currently stored only in the webpage's memory.

Refreshing the page will clear all added items.

Browser storage and API functionality will be added in later stages of the Week-2 project.

## Example

A user can add:

```text
Injera — 50 ETB
Tomato — 80 ETB
Onion — 40 ETB
```

The application displays:

```text
Shopping List

Injera — 50 ETB       Delete
Tomato — 80 ETB       Delete
Onion — 40 ETB        Delete

Total: 170 ETB
```

Clicking an item marks it as bought, while clicking its Delete button removes it from the list and updates the total.
