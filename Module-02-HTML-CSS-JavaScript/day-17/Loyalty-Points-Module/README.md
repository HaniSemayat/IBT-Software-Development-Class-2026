# TeleBirr Loyalty Points Module

A JavaScript loyalty-points module for a fictional TeleBirr shop.

The module demonstrates closures, higher-order functions, private state, and pure calculation logic.

## Features

- Earn loyalty points from ETB spending
- Redeem loyalty points
- Prevent the balance from going below zero
- Keep the points balance private using a closure
- Support different earning rules
- Demonstrate independent loyalty cards

## Default Earn Rule

The default rule awards:

1 point for every 10 ETB spent.

For example:

250 ETB → 25 points

The calculation uses:

```javascript
Math.floor(etb / 10)