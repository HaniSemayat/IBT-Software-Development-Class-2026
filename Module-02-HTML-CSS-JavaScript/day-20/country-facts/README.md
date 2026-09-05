# Country Facts 🌍

A single-page country information application built with vanilla JavaScript.

The application allows users to search for a country and displays useful information including its flag, capital, population, region, and currencies.

This project was created as part of **CodeOps Full Stack Software Development — Module 2, Day 20**.

## Features

* Search for a country by name
* Default country is Ethiopia
* Display the country's flag
* Display the capital
* Display the population with comma formatting
* Display the region
* Display currencies
* Show a loading state while fetching data
* Handle HTTP and network errors
* Display a friendly error message for invalid countries
* Dynamically render country information using the DOM
* No JavaScript framework used

## How It Works

### Searching for a Country

The user enters a country name into the search form.

JavaScript listens for the form's `submit` event and prevents the browser from reloading the page:

```javascript
e.preventDefault();
```

The entered country name is then passed to the `showCountry()` function.

### Fetching Data

The application uses `fetch()` with `async/await` to request country information from the API.

```javascript
const res = await fetch(
    `https://countries.dev/name/${encodeURIComponent(name)}`
);
```

The application checks the HTTP response before processing the data:

```javascript
if (!res.ok) {
    throw new Error("Country not found");
}
```

The JSON response is then converted into JavaScript data:

```javascript
const [country] = await res.json();
```

### Loading State

While the request is being processed, the page displays:

```text
Loading...
```

Once the data is successfully received, the loading message is removed and the country information is rendered.

### Rendering with the DOM

Country information is dynamically created using `createElement()`.

For example:

```javascript
const p = document.createElement("p");
p.textContent = `${label}: ${value}`;
```

This keeps the rendering logic separate and reusable through the `render()` function.

### Error Handling

The API request is wrapped in a `try...catch` block.

If the country does not exist or a network error occurs, the application displays a friendly error message instead of crashing.

Example:

```text
Country not found
```

## API Note

The original Day 20 assignment provided the **REST Countries v3.1 API**:

```text
https://restcountries.com/v3.1/name/{country}
```

However, while completing this project, the provided REST Countries v3.1 endpoint had been **deprecated** and returned an API deprecation message instead of country data.

Therefore, a different free country API was used so that the project could remain functional:

**countries.dev**

The application currently uses:

```text
https://countries.dev/name/{country}
```

The replacement API provides the country information required by this project, including:

* Country name
* Flag
* Capital
* Population
* Region
* Currencies

The rest of the project follows the same learning objectives from the original assignment: `fetch`, `async/await`, HTTP error checking, loading/error states, JSON data handling, and DOM rendering.

## Project Structure

```text
country-facts/
├── index.html
├── styles.css
├── app.js
└── README.md
```

### index.html

Contains the structure of the application, including:

* Search form
* Country input
* Search button
* Country information container

### styles.css

Contains the visual styling for:

* Page layout
* Header
* Search form
* Country information
* Flag
* Loading/error messages

### app.js

Contains the application logic, including:

* DOM element selection
* API requests
* `async/await`
* Error handling
* Form submission
* Country data processing
* Dynamic DOM rendering

## Technologies

* HTML5
* CSS3
* JavaScript
* DOM API
* Fetch API
* Async/Await
* REST-style API

## How to Run

No installation or build process is required.

1. Open the project folder in VS Code.
2. Open `index.html` using Live Server.
3. The application will automatically load Ethiopia's information.
4. Enter another country name and click **Search**.

## Example

Searching for:

```text
Ethiopia
```

displays information similar to:

```text
Ethiopia

Capital: Addis Ababa
Population: 114,963,583
Region: Africa
Currencies: Ethiopian birr
```

Searching for an invalid country displays:

```text
Country not found
```

## Learning Objectives

This project demonstrates:

* Form events
* `preventDefault()`
* `fetch()`
* `async` functions
* `await`
* HTTP response checking with `res.ok`
* `try...catch`
* JSON parsing
* Array destructuring
* Template literals
* `createElement()`
* DOM manipulation
* API data rendering
* Loading and error states
* Working with external APIs
