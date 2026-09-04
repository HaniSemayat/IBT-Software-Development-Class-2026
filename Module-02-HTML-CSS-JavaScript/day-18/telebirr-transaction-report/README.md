# TeleBirr Transaction Report

A JavaScript mini-project that processes TeleBirr transactions for a fictional Addis Ababa shop.

The project demonstrates modern JavaScript features including `filter()`, `map()`, `reduce()`, destructuring, spread syntax, template literals, and ES modules.

## Features

* Store TeleBirr transactions as objects
* Separate credit and debit transactions
* Calculate total credits and debits
* Generate formatted receipt strings
* Use destructuring with array method callbacks
* Create updated transaction objects without modifying the originals
* Split the application into reusable modules

## Project Structure

```text
telebirr-transaction-report/
├── transactions.js
├── report.js
├── app.js
├── package.json
└── README.md
```

## Module Responsibilities

### transactions.js

Contains and exports the transaction data.

Each transaction has:

* `id`
* `customer`
* `amount`
* `type`

Example:

```javascript
{
    id: 1,
    customer: "Hayat",
    amount: 250,
    type: "debit"
}
```

### report.js

Contains the reusable report functions.

#### `totalByType()`

Uses `filter()` to select transactions by type and `reduce()` to calculate their total.

```javascript
totalByType(transactions, "credit");
```

#### `formatReceipts()`

Uses `map()` and object destructuring to create formatted receipt strings.

```javascript
({ customer, amount })
```

Example output:

```text
Hayat: 250 ETB
```

#### `updateTransaction()`

Uses the spread operator to create a new transaction object with an updated amount.

The original transaction is not modified.

```javascript
{
    ...transaction,
    amount: newAmount
}
```

### app.js

The main application.

It imports the transactions and report functions, calculates the totals, prints the receipts, and demonstrates updating a transaction without mutating the original.

## JavaScript Concepts Demonstrated

### filter()

Used to select transactions that match a condition.

```javascript
.filter(transaction => transaction.type === type)
```

### reduce()

Used to calculate the total amount.

```javascript
.reduce((sum, { amount }) => sum + amount, 0)
```

### map()

Used to transform transactions into formatted receipt strings.

```javascript
.map(({ customer, amount }) => {
    return `${customer}: ${amount} ETB`;
})
```

### Destructuring

Used to extract properties directly from transaction objects.

```javascript
({ customer, amount })
```

### Spread Syntax

Used to create a new object while keeping the original unchanged.

```javascript
{
    ...transaction,
    amount: newAmount
}
```

### Template Literals

Used to build readable receipt strings.

```javascript
`${customer}: ${amount} ETB`
```

### ES Modules

The project uses `export` and `import` to separate the application into reusable modules.

## Sample Report

```text
=== TeleBirr Transaction Report ===
Credits: 1050 ETB
Debits: 730 ETB

=== Receipts ===
Hayat: 250 ETB
Debebe: 600 ETB
Hagos: 180 ETB
Chaltu: 450 ETB
Daniel: 300 ETB

=== Updated Transaction ===
Original:
{ id: 1, customer: 'Hayat', amount: 250, type: 'debit' }

Updated:
{ id: 1, customer: 'Hayat', amount: 300, type: 'debit' }
```

## Running the Project

Make sure Node.js is installed.

Open a terminal in the project folder and run:

```bash
node app.js
```

## Technologies

* JavaScript
* Node.js
* ES Modules
* Array Methods
* Destructuring
* Spread Syntax
* Template Literals
